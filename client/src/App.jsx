import React, { useEffect, useState, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css'; // Import the CSS file

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [socketId, setSocketId] = useState("");
  const [pastMessage, setPastMessage] = useState([]);
  const [currMessage, setCurrMessage] = useState("");
  const [specificUser, setSpecificUser] = useState("");
  const [preferLanguage, setPreferLanguage] = useState("");

  const preferLanguageRef = useRef(preferLanguage);
  const messagesEndRef = useRef(null);
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pastMessage]);


  useEffect(() => {
    preferLanguageRef.current = preferLanguage;
  }, [preferLanguage]);
    
  useEffect(() => {
    const handleSocketId = () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    };

    socket.on("connect", handleSocketId);
    socket.on("recieve-message", async (newMessage) => {
      console.log("translating API is called");
      const language = preferLanguageRef.current || newMessage.language;
      const apiUrl = `https://api.mymemory.translated.net/get?q=${newMessage.message}&langpair=${newMessage.language}|${language}`;
      const fetchApi = await fetch(apiUrl);
      const response = await fetchApi.json();
      const translatedMessage = response.responseData.translatedText;
      const timestamp = new Date().toLocaleString();
      setPastMessage((pastMessages) => [...pastMessages, { from: newMessage.from, message: translatedMessage }]);
    });

    return () => socket.disconnect();
  }, []);

  function handleMessage(event) {
    event.preventDefault();
    const timestamp = new Date().toLocaleString();
    socket.emit("message", { message: currMessage, user: specificUser, language: preferLanguage, timestamp });
    setPastMessage((pastMessages) => [...pastMessages, { from: socket.id, message: currMessage , timestamp}]);
    setCurrMessage("");
  }

  function handleMessageChange(event) {
    setCurrMessage(event.target.value);
  }
  function getAvatarUrl(username) {
    const userId = username.charCodeAt(0) % 10; // Simple logic to get an ID based on the first character of the username
    return `https://avatar.iran.liara.run/public/${userId}`;
  }
  
  return (
    <div className="container">
      <div className="sidebar">
        <h1>Chat App</h1>
        <div>
          <p>Select User</p>
          <input 
            type="text" 
            value={specificUser} 
            onChange={(e) => setSpecificUser(e.target.value)} 
          />
          <p>Preferred Language</p>
          <input 
            type="text" 
            value={preferLanguage} 
            onChange={(e) => setPreferLanguage(e.target.value)} 
          />
          <form onSubmit={handleMessage}>
            <p>Message Box</p>
            <input 
              type="text" 
              value={currMessage} 
              onChange={handleMessageChange} 
            />
            <button type='submit'>Send Message!</button>
          </form>
        </div>
      </div>

      <div className="chat-window">
        <h1>Messages</h1>
        <div className="messages">
          {
            pastMessage.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.from === socket.id ? 'sent' : 'received'}`}
              >
                
                <div className='avatar-line'><img src= {getAvatarUrl(message.from)} alt= 'avatar'className="avatar" /><strong>{message.from}</strong></div>
                <p >{message.message}</p>
                <p className="timestamp">{message.timestamp}</p> {/* Display the stored timestamp */}
              </div>
            ))
          }
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
