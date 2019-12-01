import React from 'react';
import ReactDOM from 'react-dom';

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

var json = '';

class AddSurvey extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      textBox: [
        {label: "Question 1", placeholder: "Content", text: "Click 'Modify' to erase the question"},
      ],
      text: '',
      Jtext: '',
    };

    this.TextBoxChange = this.TextBoxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddText = this.handleAddText.bind(this);
    this.handleDeleteText = this.handleDeleteText.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChangeToJSON = this.handleChangeToJSON.bind(this);
  }

  TextBoxChange = (index, event) => {
    if(event.target.value === ""){
      return;
    }
    this.state.textBox[index].text = event.target.value;
    
    this.setState({
      textBox: this.state.textBox
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onCreate(this.state);
    this.setState({
      text: '',
    })
  }

  handleAddText = () => {
    const newText = {
      label: "Question " + (this.state.textBox.length + 1), 
      placeholder: "Content", 
      text: this.state.text,
    };

    this.setState({
      textBox: this.state.textBox.concat(newText)
    });
  }

  handleDeleteText = (text, index) => {  
    for(let i = index; i < this.state.textBox.length - 1; i++){
      this.state.textBox[i] = this.state.textBox[i + 1];
    };
    this.state.textBox.splice(this.state.textBox.length - 1, 1);

    this.setState({
      textBox: this.state.textBox
    });
  }

  handleChangeText = (text, index) => {
    const newText = {
      label: "Question " + (index + 1), 
      placeholder: "Content", 
      text: this.state.text,
    };
    this.state.textBox[index] = newText;

    this.setState({
      textBox: this.state.textBox
    });
  }

  handleChangeToJSON = () => {
    const boardFront = '\
      {\
       "pages": [\
        {\
         "name": "page1",\
         "elements": [\
    ';
    const boardBack = '\
         ]\
        }\
       ]\
      }\
    ';
    const commentBox = '\
      {\
       "type": "comment",\
       "name": "name",\
       "value": "value"\
      }\
    ';
    const checkBox = '\
      {\
       "type": "checkbox",\
       "name": "question3",\
       "choices": [\
        "item1",\
        "item2",\
        "item3"\
       ]\
      }\
    ';
    var newText = '';

    for(let ind = 0; ind < this.state.textBox.length; ind++){
      newText += '\
        {\
         "type": "comment",\
         "name": "' + this.state.textBox[ind].label + '",\
         "title": "' + this.state.textBox[ind].label + '",\
         "description": "' + this.state.textBox[ind].text + '"\
        }\
      ';
      if(ind !== this.state.textBox.length - 1){
        newText += ',';
      }
    }
    const tempText = boardFront + commentBox + ',\n' + checkBox + boardBack;
    this.state.Jtext = boardFront + newText + boardBack;;
    this.setState({
      Jtext: this.state.Jtext
    });
    json = this.state.Jtext;
  }

  render() {
    return (
      <div className="component-wrapper">
        <button onClick={this.handleAddText} className="addTextButton">
          add
        </button>
        <ul>
          {this.state.textBox.map(
            (text, index) => {
              return(<li key = {index}>
                <TextField 
                  id="filled-secondary"
                  label={this.state.textBox[index].label}
                  placeholder={this.state.textBox[index].placeholder}
                  value={this.state.textBox[index].text}
                  defaultValue={this.props.defaultValue}
                  multiline
                  fullWidth
                  rows="8"
                  onChange={this.TextBoxChange.bind(this, index)}
                  margin="normal"
                  variant="outlined">
                </TextField> 
                <button onClick={() => this.handleChangeText(text, index)} className="changeButton">
                  modify
                </button>
                <button onClick={() => this.handleDeleteText(text, index)} className="deleteButton">
                  delete
                </button>
              </li>)
            }
          )}
        </ul> 
        <ul>
          <button onClick={this.handleChangeToJSON} className="JSONButton">
            Save
          </button>
        </ul>
      </div>

    );
  };
}


const INITIAL_STATE = {
  title: "",
  type: "",
  description: "",
  commitMessage: "",
  fileArray: [],
  uploading: false,
  email: "",
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

    const isInvalid1 =
      this.state.title === '' ||
      this.state.description === '';

    const isInvalid2 = 
      json === '';

    if(isInvalid1) {
      alert("모든 필드에 정보를 입력해 주세요");
      return;
    }

    if(isInvalid2) {
      alert("Text to JSON 버튼을 클릭해 주세요");
      return;
    }

    this.setState({ uploading: true });

    let userRef = this.props.firebase.user(this.state.authUser.uid);
    let workRef = this.props.firebase.db.collection('works');
  
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
          files: [json],
          answeredUsers: [],
          answers: [],
        })
        .then(()=>{
          console.log('Work add success!');
          userRef.update({
            collections: this.props.firebase.FieldValue.arrayUnion(docRef.id)
          })
          .then(()=>{
            console.log('User collection update success!');
            this.handleClose();
            window.location.reload();
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

            <Grid container>
              <Grid item xs={11}>
                <AddSurvey />
              </Grid>
            </Grid>

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

ReactDOM.render(
  <AddSurvey />,
  document.getElementById('root')
);

export default withFirebase(withStyles(uploadDialogStyle)(UploadNewDialog));
