// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

import React, { Component, Fragment } from "react";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";

import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import { withFirebase } from "../../components/Firebase";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import NewCommitDialog from "./NewCommitDialog";

class WorkItem extends Component {

  state = {
    url: "",
    dialogOpen: false,
  };

  componentDidMount() {
    const {firebase, data} = this.props;

    firebase.storage
      .refFromURL(data.thumbnail)
      .getDownloadURL()
      .then(function(url) {

        this.setState({
          url,
        });

    }.bind(this))
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
    const { classes, visibility } = this.props;
    const { name, date, description } = this.props.data;

    if (visibility) {
      return (
        <Fragment>
          <GridItem xs={12} sm={6} md={3} onClick={this.openDialog}>
            <Card>
              <CardBody>
                <img src={this.state.url} width="100%" alt="" />
                <h4 className={classes.cartTitle}>{name}</h4>
                <p className={classes.cardCategory}>
                  {description}
                </p>
              </CardBody>
              <CardFooter>
                <div className={classes.stats}>{date}</div>
              </CardFooter>
            </Card>
          </GridItem>
          {
            this.state.dialogOpen ?
            <NewCommitDialog
            open={this.state.dialogOpen}
            onClose={this.closeDialog}
            data={this.props.data}/> :
            null
          }
          </Fragment>
            
      );
    } else {
    return null;
    }
  }
}

export default withFirebase(withStyles(dashboardStyle)(WorkItem));
