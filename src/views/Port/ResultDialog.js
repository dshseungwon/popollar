import React from 'react';

import Typography from '@material-ui/core/Typography';

import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

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
import ResponseItem from './ResponseItem';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

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

    this.setState({
      ...this.props.data,
    });
  }

  componentWillUnmount() {
    this.listner();
  }

  render() {
    const { classes, onClose, data, ...other } = this.props;

    const answerList = data.answers.map(response => (
      <div key={response.id}>
        <ResponseItem
          answer={response}
          key={response.id}
        />
      </div>
    ));

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
                <div className={classes.description_body}>
                  * Swipe to check individual responses
                </div>
                </Grid>
              </Grid>
            </div>

            <Divider className={classes.divider}/>
            
            {/* <AutoPlaySwipeableViews interval={5000}>
              { answerList }
            </AutoPlaySwipeableViews> */}
              <SwipeableViews enableMouseEvents>
                { answerList }
              </SwipeableViews>

            <Divider className={classes.divider}/>
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