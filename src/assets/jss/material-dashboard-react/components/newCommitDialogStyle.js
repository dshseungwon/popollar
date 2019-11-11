const newCommitDialogStyle = theme => ({
  layout: {
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
  typeSelect: {
    margin : theme.spacing.unit,
  },
  type: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  uploadTitle: {
    margin: theme.spacing.unit,
    width: "100%",
  },
  uploadButton: {
    margin: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 14,
  },
  uploadButtonIcon: {
    marginLeft: theme.spacing.unit,
  },
  progress: {
    marginLeft: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit
  },
  writing: {
    // marginBottom: theme.spacing.unit * 2,
  },
  branchName: {
    
  },
  description: {
    marginBottom: theme.spacing.unit * 2,
  },
  commitMessage: {
  },
  description_head: {
    textAlign: "left",
    margin: "5%",
    color: "#828282",
    fontSize: "20px",
    fontWeight: "bold"
  },
  description_body: {
    textAlign: "left",
    margin: "5%",
    color: "#828282"
  },
  div_title: {
    textAlign: "left",
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
  },
  margin: {
    margin: theme.spacing.unit,
  },
});

export default newCommitDialogStyle;