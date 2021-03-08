import React from "react";
import { useQuery } from "react-query";
import fire from "./lib/fire";
import "./App.css";

interface Message {
  message: string;
  nextSendAt: string;
  lastSendAt: string;
  lastSendStatus: string;
}

const db = fire.firestore();

const fetchMessages = async () => {
  try {
    const snapshot = await db.collection("messages").get();
    return snapshot.docs.map((doc) => doc.data() as Message);
  } catch (err) {
    throw new Error(err);
  }
};

function App() {
  const { data: messages, isLoading } = useQuery("messages", fetchMessages);

  return (
    <div>
      <header>Bethink</header>

      {isLoading && <div>Loading...</div>}

      <ul>
        {!isLoading &&
          messages &&
          messages.map((message, index) => (
            <li key={index}>{message.message}</li>
          ))}
      </ul>
    </div>
  );
}

export default App;
