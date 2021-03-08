import React, { createContext, useEffect, useState } from "react";
import firebase from "firebase";

const defaultValues: {
  user: firebase.User | undefined;
  signOut: () => void;
} = {
  user: undefined,
  signOut: async () => await firebase.auth().signOut(),
};

export const UserContext = createContext(defaultValues);

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<firebase.User>();

  // Listen to the Firebase Auth state changes so that the context state is updated accordingly.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user: firebase.User | null) => {
        // TODO: What's the convention here? I've read that using undefined everywhere is easier than null
        setUser(user || undefined);
      });

    // Make sure we un-register Firebase observers when the component unmounts.
    return () => unregisterAuthObserver();
  }, []);

  return (
    <UserContext.Provider value={{ user, signOut: defaultValues.signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
