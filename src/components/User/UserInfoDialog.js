import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';

import dialogStyle from "assets/jss/material-dashboard-react/components/dialogStyle.js";

import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
  name: "Name",
  email: "Email",
  password: "Password",
};

class UserInfoDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }
  
  componentDidMount() {
    this.listner = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if(authUser) {
          this.props.firebase.getUserInfo(authUser)
            .then((userDoc) => {
              this.setState({
                name: userDoc.name,
                email: userDoc.email,
                password: userDoc.password,
              });
            })
            .catch(() => {
              console.log('Something went wrong!');
            })
        } else {
          this.setState({ authUser: null });
        }
      }
    )
  }
  
  componentWillUnmount() {
    this.listner();
  }

  handleLogout = () => {
    this.props.firebase.doSignOut();
    this.handleClose();
  }

  handleClose = () => {
    this.props.onClose();
  }

  render() {
    const { classes, onClose, ...other } = this.props;
    const { name, email, password } = this.state;

    return (
      <Dialog onClose={this.handleClose} {...other}>
        <div className={classes.main}>
          <CssBaseline />
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="display2">
                Welcome!
              </Typography>
              <TextField
                id="outlined-userinfo-email"
                label="email"
                defaultValue={email}
                className={classes.textField}
                margin="normal"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
              <TextField
                id="outlined-userinfo-password"
                label="password"
                defaultValue={password}
                className={classes.textField}
                margin="normal"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
              <Button
                onClick={this.handleLogout}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Log out
              </Button>

            </Paper>
        </div>
      </Dialog>
    );
  }
}

UserInfoDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

export default withFirebase(withStyles(dialogStyle)(UserInfoDialog));