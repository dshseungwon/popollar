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

class WorkInfoNoDialog extends React.Component {
  state = {
    url: "",
    imageFiles: [],
    isLiked: false
  };

  componentDidMount() {
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

    if (
      this.props.info.type === "Drawing" ||
      this.props.info.type === "Photo" ||
      this.props.info.type === "Design"
    ) {
      this.props.info.files.map(file => {
        this.props.firebase.storage
          .refFromURL(file)
          .getDownloadURL()
          .then(
            function(url) {
              let joined = this.state.imageFiles.concat(url);
              this.setState({
                imageFiles: joined
              });
            }.bind(this)
          )
          .catch(function(error) {
            console.log(error);
          });
      });
    }

    this.listner = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser }, () => {
            let likedList = this.props.info.likedUsers;
            if (likedList.indexOf(this.state.authUser.email) !== -1) {
              this.setState({
                isLiked: true
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

  render() {
    const { classes, info } = this.props;
    let i = 0;
    let likeChip;
    let bigContent = <div />;
    if (
      info.type === "Photo" ||
      info.type === "Design" ||
      info.type === "Drawing"
    ) {
      bigContent = this.state.imageFiles.map(file => (
        <div align="center" key={i++}>
          <img width="90%" src={file} alt={file} />
        </div>
      ));
    } else if (info.type === "Writing") {
      console.log("info.type: ", info.type);
      bigContent = (
        <div align="left" style={{margin: "5%", color: "black"}}>
          {info.files[0]}
        </div>
      );
    }

    if (this.state.authUser !== null) {
      if (this.state.isLiked === false) {
        likeChip = (
          <Chip
            avatar={
              <Avatar>
                <ThumbUp />
              </Avatar>
            }
            label="Like this Work!"
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
          <main className={classes.layout}>
            {/* <Paper className={classes.paper}> */}
            <p align="left" className={classes.div_title}>
              Work of <b>{info.ownerName}</b>
            </p>
            <Divider />
            <h3 align="left" className={classes.div_title}>
              {info.name}
            </h3>
            {bigContent}
            <React.Fragment>
              <div className={classes.description_head} style={{marginBottom: "0px"}}>
                {info.commitMessage}
              </div>
              <div className={classes.description_body} style={{marginTop: "2%"}}>{info.description}</div>
            </React.Fragment>
            <Divider />
            <div align="right" style={{ marginRight: "5%", marginTop: "2%" }}>
              {likeChip}
            </div>
            {/* <CommentBoxNoDialog info={info} /> */}
            {/* </Paper> */}
          </main>
    );
  }
}

export default withFirebase(withStyles(styles)(WorkInfoNoDialog));
