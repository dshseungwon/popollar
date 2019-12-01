import React from 'react';

import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import TitleIcon from '@material-ui/icons/BubbleChart';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import WritingIcon from '@material-ui/icons/Create';
import DrawingIcon from '@material-ui/icons/Brush';
import PhotoIcon from '@material-ui/icons/PhotoCamera';
import DesignIcon from '@material-ui/icons/Layers';
import MusicIcon from '@material-ui/icons/MusicNote';
import AttachIcon from '@material-ui/icons/AttachFile';
import CircularProgress from '@material-ui/core/CircularProgress';

import newCommitDialogStyle from "assets/jss/material-dashboard-react/components/newCommitDialogStyle";
import UploadDropzone from "../../components/Upload/UploadDropzone";

import { withFirebase } from "../../components/Firebase";
import { DialogContent, Divider } from '@material-ui/core';

const INITIAL_STATE = {
  name: "",
  type: "",
  files: [],
  branchName: "master",
  description: "",
  commitMessage: "",

  parent: [],
  thumbnail: "",
  
  owner: "",
  ownerName: "",

  uploading: false,

  oldBranchName: "",
  oldRefId: "",
  
};


class NewCommitDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  handleClose = () => {
    this.setState({...INITIAL_STATE});
    this.props.onClose();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    
    this.listner = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if(authUser) {
          this.setState({ authUser });
        } else {
          this.setState({ authUser: null });
        }
      }
    );


    console.log(this.props.data);

    this.setState({
      ...this.props.data,
      commitMessage: "",
      oldBranchName: this.props.data.branchName,
      oldRefId: this.props.data.id,
    });

  }

  componentWillUnmount() {
    this.listner();
  }

  handleUpload = (e) => {
    console.log(this.state);

    const isInvalid =
      this.state.title === '' ||
      this.state.type === '' ||
      this.state.description === '' ||
      this.state.commitMessage === '' ||
      (this.state.type !== 'Writing' && this.state.fileArray.length === 0);
    
    if(isInvalid) {
      alert("모든 필드에 정보를 입력해 주세요");
      return;
    }

    this.setState({ uploading: true });

    let userRef = this.props.firebase.user(this.state.authUser.uid);
    let workRef = this.props.firebase.db.collection('works');
    let storageRef = this.props.firebase.storage.ref();
    let treeRef = this.props.firebase.db.collection('trees');

    if(this.state.type === "Writing") {
      // Writing
      workRef.add({})
      .then((docRef) => {
        let object = {
          name: this.state.name,
          description: this.state.description,
          branchName: this.state.branchName,
          parent: this.state.parent.concat({[this.state.branchName]: docRef.id}),
          thumbnail: "gs://popollar-ku.appspot.com/poll_image.jpeg",
          type: this.state.type,
          like: 0,
          isRecent: true,
          commitMessage: this.state.commitMessage,
          comments: [],
          forkedUsers: [],
          likedUsers: [],
          owner: this.state.owner,
          ownerName: this.state.ownerName,
          date: (new Date()).getTime(),
          files: [this.state.writing],
        };
        console.log(object);
        docRef.set(object)
        .then(()=>{
          console.log('Work add success!');
          userRef.update({
            collections: this.props.firebase.FieldValue.arrayUnion(docRef.id)
          })
          .then(()=>{
            console.log('User collection update success!');

            // async function getObject() {
            //   const snapshot = await treeRef.get();
            //   return snapshot.docs.map(doc => doc.data());
            // }

            treeRef.add({
              id: docRef.id,
              branch: this.state.branchName,
              children: []
            })
            .then(() => {
              console.log("Tree collection add success!");

              if(this.state.oldBranchName === this.state.branchName) {
                workRef.doc(this.state.oldRefId).update({
                  isRecent: false,
                })
                .then(() => {
                  console.log("isRecent update success!");
                  this.handleClose();
                  window.location.reload();
                })
                .catch((error) => {
                  console.log(error);
                })
              } else {
                this.handleClose();
                window.location.reload();
              }
            })
            .catch((error) => {
              console.log(error);
            });

          })
          .catch((error)=>{
            console.log(error);
          })
        })
        .catch((error)=>{
          console.log(error);
        })
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      // Else
      storageRef.constructor.prototype.putFiles = (files) => {
          return Promise.all(files.map((file) => {
            return storageRef
              .child(file.name)
              .put(file)
              .then((snapshot) => snapshot.ref.getDownloadURL())
              .catch((error) => Promise.reject(error));
          }))
        };
      
      storageRef.putFiles(this.state.fileArray)
        .then((downloadUrls) => {
          workRef.add({})
          .then((docRef) => {
            console.log(this.state);
            docRef.set({
              name: this.state.name,
              branchName: this.state.branchName,
              description: this.state.description,
              parent: this.state.parent.concat({[this.state.branchName]: docRef.id}),
              thumbnail: this.state.files[0],
              type: this.state.type,
              like: 0,
              isRecent: true,
              commitMessage: this.state.commitMessage,
              comments: [],
              forkedUsers: [],
              likedUsers: [],
              owner: this.state.owner,
              ownerName: this.state.ownerName,
              date: (new Date()).getTime(),
              files: this.state.files.concat(downloadUrls),
            })

            .then(()=>{
              console.log('Work add success!');
              userRef.update({
                collections: this.props.firebase.FieldValue.arrayUnion(docRef.id)
              })
              .then(()=>{
                console.log('User collection update success!');

                treeRef.add({
                  id: docRef.id,
                  branch: this.state.branchName,
                  children: []
                })
                .then(() => {
                  console.log("Tree collection add success!");
                  console.log(this.state.oldBranchName, this.state.branchName, this.state.oldRefId);
                  if(this.state.oldBranchName === this.state.branchName) {
                    workRef.doc(this.state.oldRefId).update({
                      isRecent: false,
                    })
                    .then(() => {
                      console.log("isRecent update success!");
                      this.handleClose();
                      window.location.reload();
                    })
                    .catch((error) => {
                      console.log(error);
                    })
                  } else {
                    this.handleClose();
                    window.location.reload();
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
                
              })
              .catch((error)=>{
                console.log(error);
              })
            })
            .catch((error)=>{
              console.log(error);
            })
          })
          .catch((error) => {
            console.log(error);
          })
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  getWriting = () => {
    let literature = "";
    this.state.files.forEach((writing) => {
      console.log(writing);
      literature += (writing + '\n');
    })
    return literature;
  }

  handleNewFile = (acceptedFiles) => {
    this.setState({
      fileArray: acceptedFiles,
    })
  }

  render() {
    const { classes, onClose, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} maxWidth={false} {...other}>
        <DialogContent>
          <CssBaseline/>
          <main className={classes.layout}>

            <div className={classes.div_title}>
              <Grid container spacing={24}>
                <Grid item xs={8}>
                <TextField
                  name="name"
                  defaultValue={this.state.name}
                  className={classes.uploadTitle}
                  onChange={this.handleChange}
                  id="input-with-icon-textfield"
                  label="Title"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                </Grid>
                <Grid item xs={4}>
                <Button 
                  variant="contained"
                  color="secondary"
                  className={classes.uploadButton}
                  onClick={this.handleUpload}
                  >
                  Upload
                  {this.state.uploading ? 
                    <CircularProgress size={24} className={classes.progress} /> :
                    <CloudUploadIcon className={classes.uploadButtonIcon} />}
                </Button>
                </Grid>
              </Grid>
            </div>

            <Divider/>

            <div>
              <Typography gutterBottom variant="caption" className={classes.typeSelect}>
                Select type
              </Typography>

              <Grid container>
                <Grid item xs={12} sm={2}>
                  <Chip avatar={<Avatar><WritingIcon /></Avatar>}
                    variant={(this.state.type === "Writing") ? "default" : "outlined"}
                    color="primary"
                    className={classes.type}
                    label="글"
                    onClick={()=>this.setState({type: "Writing"})}/>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Chip
                    avatar={<Avatar><DrawingIcon /></Avatar>}
                    variant={(this.state.type === "Drawing") ? "default" : "outlined"}
                    color="primary"
                    className={classes.type}
                    label="그림"
                    onClick={()=>this.setState({type: "Drawing"})}/>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Chip
                    avatar={<Avatar><PhotoIcon /></Avatar>}
                    variant={(this.state.type === "Photo") ? "default" : "outlined"}
                    color="primary"
                    className={classes.type}
                    label="사진"
                    onClick={()=>this.setState({type: "Photo"})}/>
                </Grid>
                <Grid item xs={12} sm={2}>
                <Chip
                  avatar={<Avatar><DesignIcon /></Avatar>}
                  variant={(this.state.type === "Design") ? "default" : "outlined"}
                  color="primary"
                  className={classes.type}
                  label="디자인"
                  onClick={()=>this.setState({type: "Design"})}/>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Chip
                    avatar={<Avatar><MusicIcon /></Avatar>} 
                    variant={(this.state.type === "Music") ? "default" : "outlined"}
                    color="primary"
                    className={classes.type}
                    label="음악"
                    onClick={()=>this.setState({type: "Music"})}/>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Chip
                    avatar={<Avatar><AttachIcon /></Avatar>}
                    variant={(this.state.type === "Attach") ? "default" : "outlined"}
                    color="primary"
                    className={classes.type}
                    label="기타"
                    onClick={()=>this.setState({type: "Attach"})}/>
                </Grid>
               
              </Grid>
            </div>

            <Divider className={classes.divider}/>

            {this.state.type === "Writing" ?
              <TextField
              name="writing"
              id="textfield-literature"
              label="Literature"
              placeholder="Once upon a time..."
              multiline
              fullWidth
              rows="8"
              defaultValue={this.getWriting()}
              onChange={this.handleChange}
              className={classes.writing}
              margin="normal"
              variant="outlined"
            /> :
              <UploadDropzone fileUrls={this.state.files} onNewFile={this.handleNewFile}/>
            }
            
            
            <Divider className={classes.divider}/>
            
            <TextField
                name="branchName"
                id="textfield-branchName"
                label="Branch"
                placeholder="Branch Name"
                fullWidth
                defaultValue={this.state.branchName}
                onChange={this.handleChange}
                className={classes.branchName}
                margin="normal"
                variant="outlined"
              />

            <Divider className={classes.divider}/>

            <div>
              <TextField
                name="description"
                id="textfield-description"
                label="Description"
                placeholder="Lovely work!"
                multiline
                fullWidth
                defaultValue={this.state.description}
                onChange={this.handleChange}
                className={classes.description}
                margin="normal"
                variant="outlined"
              />
              
              <TextField
                name="commitMessage"
                id="textfield-commit-message"
                label="Commit Message"
                placeholder="First Commit"
                multiline
                fullWidth
                onChange={this.handleChange}
                className={classes.commitMessage}
                margin="normal"
                variant="outlined"
              />
            </div>
          </main>
        </DialogContent>
      </Dialog>
    );
  }
}

NewCommitDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

export default withFirebase(withStyles(newCommitDialogStyle)(NewCommitDialog));