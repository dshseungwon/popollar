import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider";
import CommentBoxNoDialog from "../../views/Test/CommentBoxNoDialog.jsx";
import { withFirebase } from "../../components/Firebase";

import ThumbUp from "@material-ui/icons/ThumbUp";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

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
  description_head: {
    textAlign: "left",
    margin: "5%",
    marginBottom: "0px",
    color: "#828282",
    fontSize: "20px",
    fontWeight: "bold"
  },
  description_body: {
    textAlign: "left",
    margin: "5%",
    marginTop: "0px",
    color: "#828282"
  },
  div_title: {
    margin: "5%",
    marginTop: "3%"
  },
  textfieldmargin: {
    width: "90%",
    margin: "5%",
    marginBottom: "0"
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
  addCommentBtn: {
    marginTop: "10px",
    marginRight: "5%"
  }
});

class ResponseItem extends React.Component {
  state = {
  };

  componentDidMount() {
  }

  render() {
    const { classes, answer } = this.props;
    let quesList = [];
    let ansList = [];

    for (const propt in answer){
      console.log(propt + ":" + answer[propt]);
      quesList.push(propt);
      ansList.push(answer[propt]);
    }

    const resContent = quesList.map(
      (ques, i) => (
        <div key = {i}>
          <div className={classes.description_head} style={{margin: "3%"}}>
          {ques}
          </div>
          <div className={classes.description_body} style={{margin: "3%"}}>
          {ansList[i]}
          </div>
        </div>
      )
    );
    return (
          <main className={classes.layout}>
            <React.Fragment>
                {resContent}
            </React.Fragment>
          </main>
    );
  }
}

export default withFirebase(withStyles(styles)(ResponseItem));
