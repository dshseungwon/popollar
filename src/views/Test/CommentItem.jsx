import React from "react";
import Button from "@material-ui/core/Button";

import withStyles from "@material-ui/core/styles/withStyles";

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
  commentBox: {
    // border: "solid 1px black",
    width: "90%",
    margin: "5%",
    marginBottom: "4%",
    marginTop: "2%",
    textAlign: "left"
  },
  commentname: {
    fontWeight: "bold",
    fontSize: "14px"
  },
  commentTime: {
    color: "#828282",
    fontSize: "11px",
    marginLeft: "7px"
  },
  commentbody: {
    fontSize: "14px",
    marginTop: "0"
  },
  commentTopInfo: {
    marginBottom: "5px"
  },
});

class CommentItem extends React.Component {
  render() {
    const { classes, comment, name, time } = this.props;
    return (
      <div>
        <main className={classes.layout}>
          <div className={classes.commentBox}>
            <div className={classes.commentTopInfo}>
              <span className={classes.commentname}>{name}</span>
              <span className={classes.commentTime}>{time}</span>
            </div>
            <div className={classes.commentbody}>
              {comment}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default withFirebase(withStyles(styles)(CommentItem));
