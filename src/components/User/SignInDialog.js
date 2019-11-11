import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';

import dialogStyle from "assets/jss/material-dashboard-react/components/dialogStyle.js";

import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: ""
};

class SignInDialog extends React.Component {

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

  handleSignUp = (e) => {
    e.preventDefault();

    const { email, password } = this.state;
    
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        this.props.firebase
          .doRecordUser(authUser, email, password);
        this.handleClose();
      })
      .catch(error => {
        console.log(error);
        this.setState({ error })
      })
      
  };

  handleSignIn = (e) => {
    e.preventDefault();

    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        this.handleClose();
      })
      .catch(error => {
        console.log(error);
        this.setState({ error });
      })

      
  };

  render() {
    const { classes, onClose, ...other } = this.props;

    const isInvalid =
      this.state.email === '' ||
      this.state.password === '' ||
      this.state.email.indexOf('@') < 0 ||
      this.state.email.indexOf('.') < this.state.email.indexOf('@');

    return (
      <Dialog onClose={this.handleClose} {...other}>
        <div className={classes.main}>
          <CssBaseline />
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="display2">
                Sign in
              </Typography>

              <form className={classes.form}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">Email Address</InputLabel>
                  <Input onChange={this.handleChange} id="email" name="email" autoComplete="email" autoFocus />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input onChange={this.handleChange} name="password" type="password" id="password" autoComplete="current-password" />
                </FormControl>

                <Typography component="h1" color="error">
                  {this.state.error ? this.state.error.message : "" }
                </Typography>
          
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  onClick={this.handleSignUp}
                  color="secondary"
                  className={classes.buttonSignUp}
                >
                  Sign up
                </Button>
                
                <Button
                  type="submit"
                  onClick={this.handleSignIn}
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isInvalid}
                  className={classes.submit}
                >
                  Sign in
                </Button>
              </form>

            </Paper>
        </div>
      </Dialog>
    );
  }
}

SignInDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

export default withFirebase(withStyles(dialogStyle)(SignInDialog));