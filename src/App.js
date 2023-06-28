"use strict";

import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDh8YnaSUyoNoiAXxkzpyLp96_gps0RQV0",
  authDomain: "chat-app-from-tutorial.firebaseapp.com",
  projectId: "chat-app-from-tutorial",
  storageBucket: "chat-app-from-tutorial.appspot.com",
  messagingSenderId: "536310110082",
  appId: "1:536310110082:web:6e4c04c77a309b6cede19b",
  measurementId: "G-R6Q2030SM4",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header"></header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
      <section>
        {/* <ChatRoom /> */}
        {/* <SignIn/> */}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  // console.log(messages);
  const [formValue, setFormValue] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
  };
  return (
    <>
      <div>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />

        <button type="submit">send</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "recieved";

  return (
    <div className={"message ${messageClass}"}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  );
}

export default App;
