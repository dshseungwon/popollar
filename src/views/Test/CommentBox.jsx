import React from "react";
import Button from "@material-ui/core/Button";

import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";

import CommentItem from "./CommentItem";
import { withFirebase } from "../../components/Firebase";

const styles = theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(800 + theme.spacing.unit * 2 * 2)]: {
      width: 800,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(800 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3
    }
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit
  },
  textfieldmargin: {
    width: "90%",
    margin: "5%",
    marginBottom: "0"
  },

  addCommentBtn: {
    marginTop: "10px",
    marginRight: "5%"
  }
});
class CommentBox extends React.Component {
  state = {
    commentInput: "",
    commentEmail: ""
  };
  componentDidMount() {
    this.listner = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
  }

  componentWillUnmount() {
    this.listner();
  }

  addComment = e => {
      e.preventDefault();
    if (this.state.authUser === null) {
      alert("Please try again after logging in");
    } else {
      const db = this.props.firebase.db;
      var dayNames = ['(Sun)', '(Mon)', '(Tue)', '(Wed)', '(Thu)', '(Fri)', '(Sat)'];
      let today = new Date();
      let day = dayNames[today.getDay()];
      let year   = today.getFullYear();
      let month  = today.getMonth() + 1;
      let date   = today.getDate();
      let hour   = today.getHours();
      let minute = today.getMinutes();
      let second = today.getSeconds();
      let ampm   = hour >= 12 ? 'PM' : 'AM';
      // 12시간제로 변경
      hour = hour % 12;
      hour = hour ? hour : 12; // 0 => 12
      // 10미만인 분과 초를 2자리로 변경
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;
      let now = year + '. ' + month + '. ' + date + ' ' + day + ' ' + hour + ':' + minute + ':' + second + ' ' + ampm;

      let tempData = {comment: this.state.commentInput, name: this.state.authUser.email, time: now};
      let tempDataFull = this.props.info.comments;
      tempDataFull.push(tempData);
      this.setState({
        commentInput: "",
        email: ""
      });
      const commentRef = db.collection("works").doc(this.props.info.id);
      return commentRef.update({
          comments: tempDataFull
      });
    }
  };

  updateInput = e => {
      this.setState({
          commentInput: e.target.value
      });
  };

  render() {
    const { classes, info } = this.props;
    let i = 0;
    const commentList = info.comments.map(info => (
      <CommentItem key={i++} comment={info.comment} name={info.name} time={info.time} />
    ));
    return (
      <div>
        <main className={classes.layout}>
          <p
            align="left"
            style={{
              marginLeft: "5%",
              marginBottom: "0",
              marginTop: "0"
            }}
          >
            Comments
          </p>
          <TextField
            className={classes.textfieldmargin}
            id="outlined-full-width"
            label="Comment"
            // style={{ margin: 8 }}
            placeholder="Add a Comment!"
            multiline
            // margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
            onChange={this.updateInput}
            value={this.state.commentInput}
          />
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={this.addComment}
              variant="outlined"
              className={classes.addCommentBtn}
            >
              Add Comment
            </Button>
          </div>
          {commentList}
        </main>
      </div>
    );
  }
}

export default withFirebase(withStyles(styles)(CommentBox));
