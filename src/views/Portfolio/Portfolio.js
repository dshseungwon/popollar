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
import Selectbar from "components/SelectBar/Selectbar.jsx";

import WorkItem from "./WorkItem";

import { withFirebase } from "../../components/Firebase";

let workArray = [];

class Portfolio extends React.Component {

  state = {
    value: 0,
    type: "all",
    email: "",
    fullname: "",
    loading: true,
  };

  componentDidMount() {

    workArray = [];

    this.setState({ loading: true });
    
    this.listner = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if(authUser) {

          this.props.firebase.db.collection("works")
            .where("isRecent", "==", true)
            .where("owner", "==", authUser.uid)
            .get()
            .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                let tempdata = doc.data();
                tempdata.id = doc.id;
                workArray.push(tempdata);
              });
              this.setState({ loading: false, });
            }.bind(this))
            .catch(function(error) {
              console.log("Error getting documents: ", error);
            });

        } else {
          workArray = [];
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

    const workList = workArray.map(
      info => (<WorkItem
                  visibility={ this.state.type == "all"
                    || info.type == this.state.type }
                  data={info}
                  key={info.id}
                />)
    );

    return (
      <div>
        <Selectbar onCreate={this.handleChangeType} />

        <hr/>
        
        <GridContainer>
          { workList }
        </GridContainer>
        
      </div>
    );
  }
}

export default withFirebase(withStyles(dashboardStyle)(Portfolio));
