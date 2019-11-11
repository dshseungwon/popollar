import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkfJ6oMTv2Ac09uALBL7nWxR2YFEikOac",
  authDomain: "popollar-ku.firebaseapp.com",
  databaseURL: "https://popollar-ku.firebaseio.com",
  projectId: "popollar-ku",
  storageBucket: "popollar-ku.appspot.com",
  messagingSenderId: "890505125706",
  appId: "1:890505125706:web:fc84e7768ca52d1a6b2bb3",
  measurementId: "G-7G7F85DF7T"
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
    this.FieldValue = app.firestore.FieldValue;
  }

  // Auth API

  doCreateUserWithEmailAndPassword = (email, password) => 
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) => 
    this.auth.signInWithEmailAndPassword(email, password);
  
  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // User API
  user = uid => this.db.collection('users').doc(uid);
  users = () => this.db.collection('users');

  doRecordUser = (authUser, email, password) => 
    this.user(authUser.user.uid)
        .set({
          email,
          password,
        })
        .then(()=>{
          console.log('New user added to database!');
        })
        .catch((error)=>{
          console.log(error);
        });

  getUserInfo = (authUser) => new Promise((resolve, reject) => {
    this.user(authUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve(doc.data())
        } else {
            // doc.data() will be undefined in this case
          console.log("No such document!");
          reject();
        }
      })
      .catch((error) => {
        console.log(error);
        reject();
      });
  });
    

}

export default Firebase;
