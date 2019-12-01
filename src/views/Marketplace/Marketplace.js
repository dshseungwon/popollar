import React from "react";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

import { withFirebase } from "../../components/Firebase";
import reactImg from 'react-image';

let itemArray = [];

class Marketplace extends React.Component {

  state = {
    value: 0,
    type: "all",
    email: "",
    fullname: "",
    loading: true,
  };

  componentDidMount() {

    itemArray = [];

    this.setState({ loading: true });
    
    this.listner = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if(authUser) {

          this.props.firebase.db.collection("market")
            .where("isRecent", "==", true)
            .where("owner", "==", authUser.uid)
            .get()
            .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                let tempdata = doc.data();
                tempdata.id = doc.id;
                itemArray.push(tempdata);
              });
              this.setState({ loading: false, });
            }.bind(this))
            .catch(function(error) {
              console.log("Error getting documents: ", error);
            });

        } else {
          itemArray = [];
          this.setState({
            authUser: null,
          });
        }
      }
    );
      
  }

  componentWillUnmount() {
    this.listner();
  }


  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleChangeType = type_select => {
    this.setState({ type: type_select });
  };

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };


  render() {
    const { classes } = this.props;

    
    return (
      <div>
        
        <hr/>
        
        <GridContainer>
        <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item>
            <ButtonBase className={classes.image}>
            <img className={classes.img} alt="pictures" src="https://pmcvariety.files.wordpress.com/2019/02/netflix-logo-originals.jpg?w=640" />
            </ButtonBase>
         </Grid>
          <Grid item xs={13} sm container>
            <Grid item xs container direction="column" spacing={3}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  Netflix Substription
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Valid period : 2019/12/1 - 2020/3/1
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ID: 1030114
                </Typography>
              </Grid>
             </Grid>
            <Grid item>
              <Typography variant="subtitle1">3 Months</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </GridContainer>
       
  </div>
    );
  }
}

export default withFirebase(withStyles(dashboardStyle)(Marketplace));
