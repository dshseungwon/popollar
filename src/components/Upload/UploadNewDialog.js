import React from 'react';

import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';

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

import uploadDialogStyle from "assets/jss/material-dashboard-react/components/uploadDialogStyle";
import UploadDropzone from "./UploadDropzone";

import { withFirebase } from "../Firebase";
import { DialogContent, Divider } from '@material-ui/core';
import { rejects } from 'assert';

import AddSurvey from "./AddSurvey";

const INITIAL_STATE = {
  title: "",
  type: "",
  description: "",
  commitMessage: "",
  fileArray: [],
  uploading: false,
  email: "",
  writing: "",
};

class UploadNewDialog extends React.Component {

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
          this.props.firebase.getUserInfo(authUser)
            .then((userDoc) => {
              this.setState({
                email: userDoc.email,
              });
            })
            .catch(() => {
              console.log('Something went wrong!');
            })
        } else {
          this.setState({ authUser: null });
        }
      }
    );

  }

  componentWillUnmount() {
    this.listner();
  }

  handleUpload = (e) => {
    console.log(this.state);

    const isInvalid =
      this.state.title === '' ||
      this.state.description === '';
    
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
        docRef.set({
          name: this.state.title,
          description: this.state.description,
          branchName: "master",
          parent: [{master: docRef.id}],
          thumbnail: "gs://popollar-ku.appspot.com/poll_image.jpeg",
          type: this.state.type,
          like: 0,
          isRecent: true,
          commitMessage: this.state.commitMessage,
          comments: [],
          forkedUsers: [],
          likedUsers: [],
          owner: this.state.authUser.uid,
          ownerName: this.state.email,
          date: (new Date()).getTime(),
          files: [this.state.writing],
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
              branch: 'master',
              children: []
            })
            .then(() => {
              console.log("Tree collection add success!");
              this.handleClose();
              window.location.reload();
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
    }   
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
                  name="title"
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
                <Grid item xs={12} sm={3}>
                  <Chip avatar={<Avatar><WritingIcon /></Avatar>}
                    variant={(this.state.type === "AddSurvey") ? "default" : "outlined"}
                    color="primary"
                    className={classes.type}
                    label="Add Survey"
                    onClick={()=>this.setState({type: "AddSurvey"})}/>
                </Grid>
                <Grid item xs={4}>
                  <AddSurvey />
                </Grid>
              </Grid>
            </div>

            <Divider className={classes.divider}/>

            {/* {this.state.type === "Writing" ? */}
              <TextField
              name="poll_json"
              id="textfield-literature"
              label="POLL"
              placeholder="Please Copy&Paste JSON string of a poll"
              multiline
              fullWidth
              rows="8"
              onChange={this.handleChange}
              className={classes.writing}
              margin="normal"
              variant="outlined"
            /> 
            {/* :
              <UploadDropzone onNewFile={this.handleNewFile}/>
            } */}
            
            
            <Divider className={classes.divider}/>

            <div>
              <TextField
                name="description"
                id="textfield-description"
                label="Description"
                placeholder="Description of the poll"
                multiline
                fullWidth
                onChange={this.handleChange}
                className={classes.description}
                margin="normal"
                variant="outlined"
              />
              
              {/* <TextField
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
              /> */}
            </div>
          </main>
        </DialogContent>
      </Dialog>
    );
  }
}

UploadNewDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

export default withFirebase(withStyles(uploadDialogStyle)(UploadNewDialog));