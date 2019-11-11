import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FilledInput from "@material-ui/core/FilledInput";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

class Selectbar extends React.Component {
  state = {
    type: "",
    labelWidth: 0
  };

//   componentDidMount() {
//     this.setState({
//       labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
//     });
//   }

  handleChange = event => {
    this.props.onCreate(event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="selectbar_type">Type</InputLabel>
          <Select
            value={this.state.type}
            onChange={this.handleChange}
            inputProps={{
              name: 'type',
              id: 'selectbar_type',
            }}
          >
            <MenuItem value={"all"}>
              <em>All</em>
            </MenuItem>
            <MenuItem value={"Writing"}>Writing</MenuItem>
            <MenuItem value={"Drawing"}>Drawing</MenuItem>
            <MenuItem value={"Photo"}>Photo</MenuItem>
            <MenuItem value={"Photo"}>Design</MenuItem>
          </Select>
        </FormControl>
      </form>
    );
  }
}

Selectbar.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Selectbar);
