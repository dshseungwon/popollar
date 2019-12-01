import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider";
import CommentBox from "../../views/Test/CommentBox.jsx";
import { withFirebase } from "../../components/Firebase";

import ThumbUp from "@material-ui/icons/ThumbUp";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

import * as Survey from "survey-react";

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

class WorkInfo extends React.Component {
  state = {
    url: "",
    imageFiles: [],
    isLiked: false,
    isAnswered: false
  };
  formCss = {
    matrix: {
        root: "table table-striped"
    },
    navigationButton: "button btn-lg"
  };

  onComplete =(survey, options) => {

    // upload it to DB
    if (this.state.authUser === false) {
      // User does not logged in
      alert("Please try again after logging in");
    }
    else {
        let ansList = this.props.info.answeredUsers;
        if (ansList.indexOf(this.state.authUser.email) !== -1) {
            // This User already sended their answer.
            alert("You have already submitted answers");
            // Need to Change this part to update their answers
            // Or Display 'Already Answered Survey'
        }
        else {
            // First answering by this user
            this.setState({
              isAnswered: true
            });
            const ansUser = this.props.info.answeredUsers;
            ansUser.push(this.state.authUser.email);
            const list = this.props.info.answers;
            list.push(survey.data);
            const ansRef = this.props.firebase.db.collection("works").doc(this.props.info.id);
            return ansRef.update({
              answers: list,
              answeredUsers: ansUser
            });
            console.log("uploaded into db");
        }
    }
  };
  

  componentDidMount() {
    Survey
    .StylesManager
    .applyTheme("bootstrap");

    this.props.firebase.storage
      .refFromURL(this.props.info.thumbnail)
      .getDownloadURL()
      .then(
        function(url) {
          this.setState({
            url
          });
        }.bind(this)
      )
      .catch(function(error) {
        // Handle any errors
        console.log(error);
      });

    // if (
    //   this.props.info.type === "Drawing" ||
    //   this.props.info.type === "Photo" ||
    //   this.props.info.type === "Design"
    // ) {
    //   this.props.info.files.map(file => {
    //     this.props.firebase.storage
    //       .refFromURL(file)
    //       .getDownloadURL()
    //       .then(
    //         function(url) {
    //           let joined = this.state.imageFiles.concat(url);
    //           this.setState({
    //             imageFiles: joined
    //           });
    //         }.bind(this)
    //       )
    //       .catch(function(error) {
    //         console.log(error);
    //       });
    //   });
    // }

    this.listner = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser }, () => {
            let likedList = this.props.info.likedUsers;
            if (likedList.indexOf(this.state.authUser.email) !== -1) {
              this.setState({
                isLiked: true
              });
            }
            let ansList = this.props.info.answeredUsers;
            if (ansList.indexOf(this.state.authUser.email) !== -1) {
                this.setState({
                    isAnswered: true
                });
            }
          })
        : this.setState({ authUser: null });
    });
  }

  handleLikeClick = () => {
    if (this.state.authUser === false) {
      alert("Please try again after logging in");
    }
    this.setState({
      isLiked: true
    });
    // db에다가 추가해야됨
    const prevList = this.props.info.likedUsers;
    prevList.push(this.state.authUser.email);
    const prevLikes = this.props.info.like + 1;
    const db = this.props.firebase.db;
    const likedRef = db.collection("works").doc(this.props.info.id);
    return likedRef.update({
      likedUsers: prevList,
      like: prevLikes
    });
  };

  handleClose = () => {
    this.props.load();
    this.props.onClose();
  };

  render() {
    const { classes, info } = this.props;
    let i = 0;
    let likeChip;
    let bigContent;
    var model = new Survey.Model(info.files[0]);
    // if (
    //   info.type === "Photo" ||
    //   info.type === "Design" ||
    //   info.type === "Drawing"
    // ) {
    //   bigContent = this.state.imageFiles.map(file => (
    //     <div align="center" key={i++}>
    //       <img width="90%" src={file} alt={file} />
    //     </div>
    //   ));
    // }
      bigContent = (
        <div align="left" style={{margin: "2%", paddingBottom: "4%", color: "black", border: "4px dashed #bcbcbc"}}>
          <Survey.Survey model={model} formCss={this.formCss} onComplete={this.onComplete} />
        </div>
      );

    if (this.state.authUser !== null) {
      if (this.state.isLiked === false) {
        likeChip = (
          <Chip
            avatar={
              <Avatar>
                <ThumbUp />
              </Avatar>
            }
            label="Like this Poll!"
            className={classes.chip}
            onClick={this.handleLikeClick}
            color="primary"
          />
        );
      } else {
        likeChip = (
          <Chip
            avatar={
              <Avatar>
                <ThumbUp />
              </Avatar>
            }
            label="You already liked this work"
            className={classes.chip}
          />
        );
      }
    } else {
      likeChip = (
        <Chip
          avatar={
            <Avatar>
              <ThumbUp />
            </Avatar>
          }
          label="Please Log In"
          className={classes.chip}
        />
      );
    }
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleClose}
        maxWidth={false}
      >
        <DialogContent>
          <main className={classes.layout}>
            {/* <Paper className={classes.paper}> */}
            <p align="left" className={classes.div_title}>
              Work of <b>{info.ownerName}</b>
            </p>
            <Divider />
            <h3 align="left" className={classes.div_title}>
              {info.name}
            </h3>
            <div className={classes.description_body}>
                {info.description}
            </div>
            {bigContent}
            <React.Fragment>
              {/* <div className={classes.description_body} style={{marginTop: "2%"}}>{info.description}</div> */}
            </React.Fragment>
            <Divider />
            <div align="right" style={{ marginRight: "5%", marginTop: "2%" }}>
              {likeChip}
            </div>
            <CommentBox info={info} />
            {/* </Paper> */}
          </main>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withFirebase(withStyles(styles)(WorkInfo));
