import React from 'react'

function Profile() {
    return (
        <div className="profile-container">
            <img src={user.picture} alt="User Avatar" className="profile-avatar" />
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
            <h1>Chat Bridge App</h1>
            <div>
                <p>Select User</p>
                <input
                    type="text"
                    value={specificUser}
                    onChange={(e) => setSpecificUser(e.target.value)}
                    placeholder="Receiver"
                />
                <p>Preferred Language</p>
                <input
                    type="text"
                    value={preferLanguage}
                    onChange={(e) => setPreferLanguage(e.target.value)}
                    placeholder="Language"
                />
            </div>
        </div>)

}

export default Profile