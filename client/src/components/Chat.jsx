import React,{useRef,useState,useEffect} from 'react'

function Chat({messages}) {
  const [chats,setChats] = useState({});
  const [currMessage, setCurrMessage] = useState("");

  const me = "vaibhavgupta10987@gmail.com"
  
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    const userId = username.charCodeAt(0) % 10; 
    return `https://avatar.iran.liara.run/public/${userId}`;
  }


  return (
    <div className="chat-window">
        <div className="messages">
          {
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.emailId === me ? 'sent' : 'received'}`}
              >
                <div className='avatar-line'><img src={getAvatarUrl(message.emailId)} alt='avatar' className="avatar" /><strong>{message.from}</strong></div>
                <p>{message.message}</p>
                <p className="timestamp">{message.timestamp}</p>
              </div>
            ))
          }
          {/* <div ref={messagesEndRef} /> */}
        </div>

        <form onSubmit={handleMessage} className="message-input">
          <input 
            type="text" 
            value={currMessage} 
            onChange={handleMessageChange} 
            placeholder="Type a message" 
          />
          <button type="submit">Send</button>
        </form>
      </div>
  )
}

export default Chat