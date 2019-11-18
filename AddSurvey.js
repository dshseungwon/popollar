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


class AddSurvey extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      survey: ['example', 'time'],
      query: '',
      textBox: [
        {label: "Question1", placeholder: "Stop!!!!!!!!!!", text: "Hello"},
      ],
      text: '',
      Jtext: '',
    };

    this.TextBoxChange = this.TextBoxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddText = this.handleAddText.bind(this);
    this.handleDeleteText = this.handleDeleteText.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleShowText = this.handleShowText.bind(this);
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
      placeholder: "Stop!!!!!!!!!!", 
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
      placeholder: "Stop!!!!!!!!!!", 
      text: this.state.text,
    };
    this.state.textBox[index] = newText;

    this.setState({
      textBox: this.state.textBox
    });
  }

  handleShowText = (text, index) => {
    console.log(index)
    console.log(this.state.textBox.length)
    console.log(this.state.text)
    console.log(this.state.textBox[index])
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
         "name": ' + this.state.textBox[ind].label + '\
         "value": ' + this.state.textBox[ind].text + '\
        }\
      ';
      if(ind !== this.state.textBox.length - 1){
        newText += ',\n';
      }
    }
    const tempText = boardFront + commentBox + ',\n' + checkBox + boardBack;
    this.state.Jtext = boardFront + newText + boardBack;;
    this.setState({
      Jtext: this.state.Jtext
    });
  }

  render() {
    return (
      <div className="component-wrapper">
        <button onClick={this.handleAddText} className="addTextButton">
          addText
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
                <button onClick={() => this.handleShowText(text, index)} className="showButton">
                  show
                </button>
              </li>)
            }
          )}
        </ul> 
        <ul>
          {this.state.Jtext}
          <button onClick={this.handleChangeToJSON} className="JSONButton">
            Text to JSON
          </button>
        </ul>
      </div>

    );
  };
}

ReactDOM.render(
  <AddSurvey />,
  document.getElementById('root')
);

export default AddSurvey;