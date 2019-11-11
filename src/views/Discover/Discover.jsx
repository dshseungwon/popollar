import React from "react";
// @material-ui/core
import ReactSwipe from "react-swipe";
import SwipeableViews from 'react-swipeable-views';
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import { withFirebase } from "../../components/Firebase";
import { Select } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import WorkInfoNoDialog from "../../components/WorkInfo/WorkInfoNoDialog";
import { autoPlay } from 'react-swipeable-views-utils';

let workArray = [];

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = theme => ({
  left: {
    float: "left",
    width: "5%",
    border: "1px solid black"
  },
  right: {
    float: "left",
    width: "5%",
    border: "1px solid black"
  },
  center: {
    float: "left",
    width: "80%",
    border: "1px solid black",
    marginRight: "0px"
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class Discover extends React.Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    workArray = [];
    const db = this.props.firebase.db;
    db.collection("works")
      .where("isRecent", "==", true)
      .get()
      .then(
        function(querySnapshot) {
          querySnapshot.forEach((doc) => {
            let tempdata = doc.data();
            tempdata.id = doc.id;
            workArray.push(tempdata);
            console.log(doc.id, " => ", tempdata);
            this.setState({ loading: false });
          });
          // this.setState({ loading: false });
        }.bind(this)
      )
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    console.log(workArray);
  }

  render() {
    const { classes } = this.props;
    let reactSwipeEl;
    const workList = workArray.map(info => (
      <div key={info.id}> 
        <WorkInfoNoDialog
          info={info}
          key={info.id}
        />
      </div>
    ));

    return (
      <div>
        <div className={classes.root}>
          <Grid container spacing={24}>
            <Grid item xs={2}>
              {/* <Paper className={classes.paper}>
                <button onClick={() => reactSwipeEl.prev()}>Prev</button>
              </Paper> */}
            </Grid>
            <Grid item xs={8}>
              <Paper className={classes.paper}>

              <AutoPlaySwipeableViews interval={5000}>
                { workList }
              </AutoPlaySwipeableViews>
                {/* <ReactSwipe
                  className="carousel"
                  swipeOptions={{ continuous: false }}
                  ref={el => (reactSwipeEl = el)}
                >
                <div>
                { workList }
                </div>
                </ReactSwipe> */}
              </Paper>
            </Grid>
            <Grid item xs={2}>
              {/* <Paper className={classes.paper}>
                <button onClick={() => reactSwipeEl.next()}>Next</button>
              </Paper> */}
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withFirebase(withStyles(styles)(Discover));
