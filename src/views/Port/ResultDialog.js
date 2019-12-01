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

import newCommitDialogStyle from "assets/jss/material-dashboard-react/components/newCommitDialogStyle";

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
  
};


class ResultDialog extends React.Component {

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
    });

  }

  componentWillUnmount() {
    this.listner();
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

                <h3 align="left" className={classes.div_title}>
                  {this.state.name}
                </h3>

                <div className={classes.description_body}>
                  {this.state.description}
                </div>
                </Grid>
              </Grid>
            </div>

            <Divider className={classes.divider}/>

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
            />
            
            
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

            </div>
          </main>
        </DialogContent>
      </Dialog>
    );
  }
}

ResultDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

export default withFirebase(withStyles(newCommitDialogStyle)(ResultDialog));