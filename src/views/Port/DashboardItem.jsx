// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import React, { Component, Fragment } from "react";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import WorkInfo from "../../components/WorkInfo/WorkInfo.jsx";
import Divider from "@material-ui/core/Divider";
import NewCommitDialog from "./NewCommitDialog";
import { withFirebase } from "../../components/Firebase";
import { Button } from "@material-ui/core";

class DashboardItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      workInfoOpen: false,
      loading: true,
      dialogOpen: false,
    };
  }

  handleLoad = () => {
    this.setState({
      loading: !this.state.loading,
    })
  }

  handleWorkInfoOpen = () => {
    this.setState({
      workInfoOpen: true,
    });
  }

  handleWorkInfoClose = () => {
    this.setState({
      workInfoOpen: false,
    });
  }

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
  }

  openDialog = () => {
    this.setState({
      dialogOpen: true,
    })
  }

  closeDialog = () => {
    this.setState({
      dialogOpen: false,
    })
  }
  

  render() {
    const { classes, visibility, info } = this.props;
    if (visibility == true) {
      return (
        <Fragment>
          <GridItem xs={12} sm={6} md={3} >
            <Card>
              <CardBody onClick={this.handleWorkInfoOpen}>
                <img src={this.state.url} width="100%" alt="" />
                <div style={{fontSize: "20px", marginTop: "2%"}}>{info.name}</div>
                <div style={{marginBottom: "2%"}} className={classes.cardCategory}>{info.commitMessage}</div>
                <Divider />
                <div style={{fontSize: "11px"}} className={classes.cardCategory}>{info.comments.length} Comments, {info.like} Likes </div>
              </CardBody>
              <Button style={{fontSize: 10, color: "#5b5b5b"}} onClick={this.openDialog}>Commit</Button>
            </Card>
            
          </GridItem>
          
          {this.state.workInfoOpen ?
          <WorkInfo
            load={this.handleLoad}
            open={this.state.workInfoOpen}
            onClose={this.handleWorkInfoClose}
            info={info}
            />
          : null
          }

          {
            this.state.dialogOpen ?
            <NewCommitDialog
            open={this.state.dialogOpen}
            onClose={this.closeDialog}
            data={info}/> :
            null
          }
        </Fragment>
      );
    } else {
      return null;
    }
  }
}

export default withFirebase(withStyles(dashboardStyle)(DashboardItem));
