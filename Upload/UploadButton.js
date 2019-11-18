import React, { Component, Fragment } from "react";

import { withStyles } from '@material-ui/core/styles';
import CloudUpload from "@material-ui/icons/CloudUpload";
import Hidden from "@material-ui/core/Hidden";

import Button from "components/CustomButtons/Button.jsx";
import uploadButtonStyle from '../../assets/jss/material-dashboard-react/components/uploadButtonStyle';

import UploadNewDialog from './UploadNewDialog';
import SignInDialog from '../User/SignInDialog';

import { withFirebase } from '../Firebase';


const INITIAL_STATE = {
  open: false,
  error: null,
};

class UploadButton extends Component {

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  componentDidMount() {
    this.listner = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      }
    )
  }

  componentWillUnmount() {
    this.listner();
  }


  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Button
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-label="Upload"
            className={classes.buttonLink}
            onClick={this.handleClickOpen}
        >
          <CloudUpload className={classes.icons} />
        </Button>
        <SignInDialog
          open={(this.state.authUser === null) && this.state.open}
          onClose={this.handleClose}
        />
        <UploadNewDialog
          open={(this.state.authUser !== null) && this.state.open}
          onClose={this.handleClose} />
      </Fragment>
    );
    
  }
}

export default withFirebase(withStyles(uploadButtonStyle)(UploadButton));