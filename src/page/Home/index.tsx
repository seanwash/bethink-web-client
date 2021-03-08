import React, { FormEvent, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import firebase from "firebase";
import fire from "../../lib/fire";
import { UserContext } from "../../context/user";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  userId: string;
  message: string;
  nextSendAt: firebase.firestore.FieldValue;
  lastSendAt: string | null;
  lastSendStatus: string | null;
}

interface MessagePayload {
  userId: string;
  message: string;
  nextSendAt: firebase.firestore.FieldValue;
  lastSendAt: string | null;
  lastSendStatus: string | null;
}

const db = fire.firestore();

const fetchMessages = async (user: firebase.User | undefined) => {
  try {
    const id = user ? user.uid : "";
    const snapshot = await db
      .collection("messages")
      .where("userId", "==", id)
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Message)
    );
  } catch (err) {
    throw new Error(err);
  }
};

const createMessage = async (message: MessagePayload) => {
  try {
    return await db.collection("messages").add(message);
  } catch (err) {
    throw new Error(err);
  }
};

const deleteMessage = async (message: Message) => {
  try {
    return await db.collection("messages").doc(message.id).delete();
  } catch (err) {
    throw new Error(err);
  }
};

function Home() {
  const { user, signOut } = useContext(UserContext);
  const [message, setMessage] = useState<string>("");
  const [nextSendAt, setNextSendAt] = useState<string>("");
  const queryClient = useQueryClient();
  const { data: messages, isLoading: fetchLoading } = useQuery(
    "messages",
    () => fetchMessages(user),
    { enabled: !!user }
  );
  const {
    mutate: createMessageMutation,
    isLoading: mutateLoading,
  } = useMutation(createMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries("messages");
      setMessage("");
    },
  });
  const {
    mutate: deleteMessageMutation,
    isLoading: deleteMutationLoading,
  } = useMutation(deleteMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries("messages");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!user) return;

    event.preventDefault();
    createMessageMutation({
      userId: user.uid,
      message: message,
      nextSendAt: firebase.firestore.Timestamp.fromDate(new Date(nextSendAt)),
      lastSendAt: null,
      lastSendStatus: null,
    });
  };

  const handleDelete = (message: Message) => {
    deleteMessageMutation(message);
  };

  return (
    <div>
      <header>Bethink</header>

      {user && (
        <div>
          {user.email}{" "}
          <button type="button" onClick={signOut}>
            Sign Out
          </button>
        </div>
      )}
      {!user && (
        <div>
          <Link to="/sessions">Sign In</Link>
        </div>
      )}

      {user && (
        <form className="mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="block" htmlFor="message">
              Label
            </label>
            <input
              className="block border"
              name="message"
              type="text"
              disabled={mutateLoading}
              onChange={(e) => setMessage(e.currentTarget.value)}
              value={message}
            />
          </div>
          <div>
            <label className="block" htmlFor="nextSendAt">
              Send At
            </label>
            <input
              className="block border"
              type="datetime-local"
              id="nextSendAt"
              name="nextSendAt"
              disabled={mutateLoading}
              onChange={(e) => setNextSendAt(e.currentTarget.value)}
              value={nextSendAt}
            />
          </div>
          <div>
            <input
              className="p-2"
              type="submit"
              value="Create"
              disabled={mutateLoading}
            />
          </div>
        </form>
      )}

      {fetchLoading && <div>Loading...</div>}

      {user && (
        <ul className="mt-4">
          {!fetchLoading &&
            messages &&
            messages.map((message) => (
              <li key={message.id}>
                {message.message}{" "}
                <button
                  type="button"
                  disabled={deleteMutationLoading}
                  onClick={() => handleDelete(message)}
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
