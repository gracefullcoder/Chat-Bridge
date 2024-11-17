import React, { useRef, useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import { io } from 'socket.io-client';

const translatedMessage = async (toLang, messages) => {
  const updatedChats = await Promise.all(
    messages.map(async (message) => {
      console.log(message, toLang);
      if (message.lang != toLang) {
        const apiUrl = `https://api.mymemory.translated.net/get?q=${message.message}&langpair=${message.lang}|${toLang}`;
        const fetchApi = await fetch(apiUrl);
        const response = await fetchApi.json();
        const translatedMessage = response.responseData.translatedText;
        return { ...message, message: translatedMessage };
      } else {

        return message;
      }

    })
  );

  function formatTimestamp(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return updatedChats;
};

function Chat({ specificUser, user }) {
  const [chats, setChats] = useState([]);
  const [currMessage, setCurrMessage] = useState("");
  const [preferLanguage, setPreferLanguage] = useState(user.mainLang);
  const preferLanguageRef = useRef(preferLanguage);

  const socket = useMemo(() => io(`${import.meta.env.VITE_BACKEND_DOMAIN}`), []);
  const [socketId, setSocketId] = useState("");
  
  // const messagesEndRef = useRef(null);

  useEffect(() => {
    preferLanguageRef.current = preferLanguage;
  }, [preferLanguage]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/chat/${specificUser.chatId}`
        );
        const translatedChats = await translatedMessage(user.mainLang, data.messages);
        setChats(translatedChats);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    if (specificUser?.chatId) {
      getChats();
    }
  }, [specificUser.chatId, preferLanguage]);

  useEffect(() => {
    socket.emit("set-email", user.email);

    const handleSocketId = () => {
      console.log("Connected:", socket.id);
      setSocketId(socket.id);
    };

    socket.on("connect", handleSocketId);

    socket.on("recieve-message", async (newMessage) => {
      try {
        console.log("Translating message:", newMessage);
        const toLanguage = preferLanguageRef.current;
        if (toLanguage && toLanguage != newMessage.language) {
          const apiUrl = `https://api.mymemory.translated.net/get?q=${newMessage.message}&langpair=${newMessage.language}|${preferLanguageRef.current}`;
          const fetchApi = await fetch(apiUrl);
          const response = await fetchApi.json();
          const translatedMessage = response.responseData.translatedText;

          setChats((prevChats) => [
            ...prevChats,
            {
              emailId: newMessage.fromUser,
              message: translatedMessage,
              createdAt: newMessage.createdAt,
            },
          ]);
        }else{
          setChats((prevChats) => [
            ...prevChats,
            {
              emailId: newMessage.fromUser,
              message: newMessage.message,
              createdAt: newMessage.createdAt,
            },
          ]);
        }
        
      } catch (error) {
        console.error("Error translating message:", error);
      }
    });

    return () => {
      socket.off("connect", handleSocketId);
      socket.disconnect();
    };
  }, [socket]);

  const handleMessageChange = (event) => {
    setCurrMessage(event.target.value);
  };

  const sendMessage = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/chat`,
        data
      );
      console.log("Message sent:", response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleMessage = async (event) => {
    event.preventDefault();
    const timestamp = new Date().toLocaleString();

    const messageData = {
      message: currMessage,
      fromEmailId: user.email,
      chatId: specificUser.chatId,
      fromId: user.userId,
      toId: specificUser.friend._id,
      lang: preferLanguageRef.current,
    };

    await sendMessage(messageData);

    socket.emit("message", {
      message: currMessage,
      fromUser: user.email,
      toUser: specificUser.friend.emailId,
      language: preferLanguage,
      createdAt: timestamp,
    });

    setChats((prevChats) => [
      ...prevChats,
      { emailId: user.email, message: currMessage, createdAt: timestamp },
    ]);

    setCurrMessage("");
  };

  function getAvatarUrl(username) {
    const userId = username.charCodeAt(0) % 10;
    return `https://avatar.iran.liara.run/public/${userId}`;
  }

  return (
    <div className="chat-window">
      <div className="messages">
        {chats.map((message, index) => (
          <div
            key={index}
            className={`message ${message.emailId === user.email ? "sent" : "received"
              }`}
          >
            <div className="avatar-line">
              <img
                src={getAvatarUrl(message.emailId)}
                alt="avatar"
                className="avatar"
              />
              <strong>{message.from}</strong>
            </div>
            <p>{message.message}</p>
            <p className="timestamp">{new Date(message.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {/* <div ref={messagesEndRef} /> */}
      </div>

      <form onSubmit={handleMessage} className="message-input">
        <input
          type="text"
          value={preferLanguage}
          onChange={(e) => setPreferLanguage(e.target.value)}
          placeholder="Preferred Language"
          className='prefer-lang'
        />
        <input
          type="text"
          value={currMessage}
          onChange={handleMessageChange}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
