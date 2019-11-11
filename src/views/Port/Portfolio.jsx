import React from "react";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Search from "@material-ui/icons/Search";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Button from "../../components/CustomButtons/Button.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Selectbar from "components/SelectBar/Selectbar.jsx";
import TextField from '@material-ui/core/TextField';

import DashboardItem from "./DashboardItem.jsx";

import { withFirebase } from "../../components/Firebase";
import { Select } from "@material-ui/core";

let workArray = [];

class Portfolio extends React.Component {
  state = {
    value: 0,
    type: "all",
    email: "",
    fullname: "",
    loading: true,
    searchKey: "",
    clickSearch: false,
  };

  componentDidMount() {
    workArray = [];


    const db = this.props.firebase.db;

    this.listner = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if(authUser) {
          db.collection("works")
            .where("isRecent", "==", true)
            .where("owner", "==", authUser.uid)
            .get()
            .then(
              function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  let tempdata = doc.data();
                  tempdata.id = doc.id;
                  workArray.push(tempdata);
                  console.log(doc.id, " => ", tempdata);
                });
                this.setState({ loading: false });
              }.bind(this)
            )
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

  handleChange = (e) => {
    this.setState({
      searchKey: e.target.value
    })
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

  onPressSearch = () => {
    console.log(this.state.clickSearch);
    this.setState({clickSearch: true});
  }

  addUser = e => {
    e.preventDefault();
    const db = this.props.firebase.db;
    console.log(db);
    db.settings({
      timestampsInSnapshots: true
    });
    const userRef = db.collection("users").add({
      fullname: this.state.fullname,
      email: this.state.email
    });
    this.setState({
      fullname: "",
      email: ""
    });
  };

  // readExample = e => {
  //   const db = this.props.firebase.db;
  //   db.collection("works")
  //     .where("isRecent", "==", true)
  //     .get()
  //     .then(function(querySnapshot) {
  //       querySnapshot.forEach(function(doc) {
  //         console.log(doc.id, " => ", doc.data());
  //       });
  //     })
  //     .catch(function(error) {
  //       console.log("Error getting documents: ", error);
  //     });
  // };

  render() {
    const { classes } = this.props;
    let tempWorkList = [];

    workArray.map(info => {
      if (info.name.indexOf(this.state.searchKey) > -1) {
        tempWorkList.push(info);
      }
    });

    const workList = tempWorkList.map(info => (
      <DashboardItem
        visibility={this.state.type == "all" || info.type == this.state.type}
        key={info.id}
        info={info}
      />
      ));

    return (
      <div>
        <div />
        {/* 셀렉트바...... */}

        <Selectbar onCreate={this.handleChangeType} />

        {/* <button onClick={this.readExample}>
          클릭하면 데이터베이스에서 읽는다!
        </button> */}
        {/* <div>
          <hr />
          <form onSubmit={this.addUser}>
            <input
              type="text"
              name="fullname"
              placeholder="Full name"
              onChange={this.updateInput}
              value={this.state.fullname}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={this.updateInput}
              value={this.state.email}
            />
            <button type="submit">Submit</button>
          </form>
          <hr />
        </div> */}
        <GridContainer>{workList}</GridContainer>
        <div
          className={classes.searchWrapper}
          style={{
            position: "fixed",
            bottom: "10px",
            right: "40px",
            backgroundColor: "#f2f2f2",
            padding: "20px",
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "20px",
            paddingRight: "15px",
            marginBottom: "1%",
            borderRadius: "10px",
            boxShadow: "0px 0px 20px #c6c6c6"
          }}
        >
          <TextField
            name="searchKey"
            value={this.state.searchKey}
            onChange={this.handleChange}
            
            inputProps={{
              placeholder: "Search",
            
            }}
          />
          <Button color="white" aria-label="edit" justIcon round onClick={this.onPressSearch}>
            <Search />
          </Button>
        </div>
      </div>
    );
  }
}

export default withFirebase(withStyles(dashboardStyle)(Portfolio));
