import React, { useEffect, useState, useMemo, useRef } from 'react'
import Users from './Users';
import Chat from './Chat';

function Container({user}) {
    console.log(user);
    const [specificUser, setSpecificUser] = useState({});

    return (
        <div className="container">
            <Users specificUser={specificUser} setSpecificUser={setSpecificUser} user={user}/>
            <Chat specificUser={specificUser} user={user}/>
        </div>
    )
}

export default Container