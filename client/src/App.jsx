import React, { useEffect, useState, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css'; // Import the CSS file
import axios from 'axios'
import { LoginButton, LogoutButton } from "./components/Login"
import { useAuth0 } from '@auth0/auth0-react';
import Chat from './components/Chat';
import Navbar from './components/Navbar';

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [socketId, setSocketId] = useState("");
  const [pastMessage, setPastMessage] = useState([]);

  const [specificUser, setSpecificUser] = useState("");
  const [preferLanguage, setPreferLanguage] = useState("");
  const { user, isAuthenticated, isLoading } = useAuth0();
  console.log(user);

  const preferLanguageRef = useRef(preferLanguage);
  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pastMessage]);

  useEffect(() => {
    const getChats = async () => {
      const data = await axios.get("http://localhost:3000/chat/6717b94a6593dc0c8fd45024");
      console.log(data.data.messages)
      setPastMessage(data.data.messages);
    }

    getChats();
  }, []);


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
      setPastMessage((pastMessages) => [...pastMessages, { from: newMessage.from, message: translatedMessage, timestamp }]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">

        <div className="sidebar">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae temporibus est fugiat, in consequatur minus voluptas soluta minima voluptatem sunt, velit eveniet tenetur consectetur enim vero suscipit unde porro ad.
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat commodi tempora quas necessitatibus nesciunt maxime. Odit dolor, quia quisquam qui perferendis aspernatur consequuntur quae, unde exercitationem odio fugit recusandae? Neque!
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid facilis officia pariatur, provident enim delectus sequi rerum mollitia vitae atque vero distinctio quo eaque optio id, asperiores error excepturi cumque?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium omnis eius incidunt, molestiae, necessitatibus placeat dignissimos excepturi corporis doloribus error aspernatur magni animi, atque id harum culpa iste doloremque.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo blanditiis dolorum animi praesentium ex eius obcaecati voluptas aut corporis, placeat eum commodi numquam, beatae est iusto soluta totam molestiae illum!
        </div>

        <Chat messages={pastMessage} />
      </div>
    </>
  );
}

export default App;
