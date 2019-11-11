import React from "react";

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {x => <Component {...props} firebase={x} />}
  </FirebaseContext.Consumer>
);



export default FirebaseContext;
