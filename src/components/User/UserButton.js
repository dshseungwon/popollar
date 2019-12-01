import React, { Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Person from "@material-ui/icons/Person";
import Hidden from "@material-ui/core/Hidden";

import SignInDialog from './SignInDialog';
import UserInfoDialog from './UserInfoDialog';

import Button from "components/CustomButtons/Button.jsx";
import userButtonStyle from '../../assets/jss/material-dashboard-react/components/userButtonStyle';
import { withFirebase } from '../Firebase';


const INITIAL_STATE = {
  open: false,
  email: "",
  password: "",
  remember: false,
  error: null,
};

class UserButton extends React.Component {

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
          aria-label="Person"
          className={classes.buttonLink}
          onClick={this.handleClickOpen}
          >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <SignInDialog
          open={(this.state.authUser === null) && this.state.open}
          onClose={this.handleClose}
        />
        <UserInfoDialog
          open={(this.state.authUser !== null) && this.state.open}
          onClose={this.handleClose}
        />
      </Fragment>
    );
  }
}

export default withFirebase(withStyles(userButtonStyle)(UserButton));