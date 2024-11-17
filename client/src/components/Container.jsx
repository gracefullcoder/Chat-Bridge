import React, { useEffect, useState, useMemo, useRef } from 'react'
import Users from './Users';
import Chat from './Chat';
import { io } from 'socket.io-client';
import axios from 'axios';


function Container({user}) {
    console.log(user);
    const [specificUser, setSpecificUser] = useState({});
    const messagesEndRef = useRef(null);

    return (
        <div className="container">
            <Users specificUser={specificUser} setSpecificUser={setSpecificUser} user={user}/>
            <Chat specificUser={specificUser} user={user}/>
        </div>
    )
}

export default Container