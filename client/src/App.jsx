import React, { useEffect, useState, useMemo, useRef } from 'react'
import { io } from 'Socket.io-client'

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [socketId, setSocketId] = useState("");
  const [pastMessage, setPastMessage] = useState([]);
  const [currMessage, setCurrMessage] = useState("");
  const [specificUser, setSpecificUser] = useState("");
  const [preferLanguage, setPreferLanguage] = useState("");

  const preferLanguageRef = useRef(preferLanguage);

  useEffect(() => {
    preferLanguageRef.current = preferLanguage;
  }, [preferLanguage]);

  useEffect(() => {
    const handleSocketId = () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    }

    socket.on("connect", handleSocketId);
    socket.on("recieve-message", async (newMessage) => {
      console.log("translating API is called");
      const language = preferLanguageRef.current || newMessage.language;
      console.log(newMessage, language);
      const apiUrl = `https://api.mymemory.translated.net/get?q=${newMessage.message}&langpair=${newMessage.language}|${language}`;
      console.log(apiUrl);
      const fetchApi = await fetch(apiUrl);
      const response = await fetchApi.json();
      console.log(response);
      const translatedMessage = response.responseData.translatedText;
      setPastMessage((pastMessages) => [...pastMessages, { from: newMessage.from, message: translatedMessage }]);
    });

    return () => socket.disconnect();
  }, []);

  function handleMessage(event) {
    event.preventDefault();
    socket.emit("message", { message: currMessage, user: specificUser, language: preferLanguage });
    setPastMessage((pastMessages) => [...pastMessages, { from: socket.id, message: currMessage }]);
    setCurrMessage("");
  }

  function handleMessageChange(event) {
    setCurrMessage(event.target.value);
  }

  return (
    <div style={{ margin: "1rem", display: "grid", placeItems: "center", maxWidth: "80%" }}>
      <h1>Chat App</h1>
      <p>{socketId}</p>
      <p>Select User</p>
      <input type="text" style={{ height: "2rem", width: "20rem" }} value={specificUser} onChange={(e) => setSpecificUser(e.target.value)} />
      <p>Preferred Language</p>
      <input type="text" style={{ height: "2rem", width: "20rem" }} value={preferLanguage} onChange={(e) => setPreferLanguage(e.target.value)} />
      <br />
      <form action="" onSubmit={handleMessage}>
        <p>Message Box</p>
        <input type="text" style={{ height: "4rem", width: "20rem" }} value={currMessage} onChange={handleMessageChange} />
        <br />
        <br />
        <button type='submit' onClick={handleMessage}>Send Message!</button>
      </form>

      <div>
        <h1>Messages</h1>
        {
          pastMessage.map((message, index) => (
            <div 
           style={message.from === socket.id ? ({display:"flex", gap:"2rem",flexDirection: "row-reverse"}) : ({display:"flex", gap:"2rem"})}
            key={index}>
              <p>{message.from}</p>
              <p>{message.message}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App;
