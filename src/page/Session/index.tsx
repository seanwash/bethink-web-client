import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";

// TODO: Move config to a config folder.
const uiConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
};

const SignUp = () => (
  <div>
    <h1>Bethink</h1>
    <p>Please sign-in:</p>

    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  </div>
);

export default SignUp;
