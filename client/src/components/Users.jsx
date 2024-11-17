import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

function Users({ user, setSpecificUser, specificUser }) {
  const [userDetails, setUserDetails] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchStatus, setSearchStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const getUsers = async () => {
      const users = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/user/${user.email}`);
      setUserDetails(users.data);
    };
    getUsers();
  }, [user]);


  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setSearchStatus({ type: '', message: '' });

    if (!searchEmail || !searchEmail.includes('@')) {
      setSearchStatus({ type: 'error', message: 'Please enter a valid email' });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_DOMAIN}/user/request`, {
        emailId: searchEmail,
        userId: user.userId
      });

      setSearchStatus({
        type: response.data.status === 'success' ? 'success' : 'info',
        message: response.data.message
      });

      if (response.data.status === 'success') {
        setUserDetails(prev => { return [...prev, response.data.user] })
      }
      setSearchEmail('');
    } catch (error) {
      setSearchStatus({
        type: 'error',
        message: error.response?.data?.message || 'User not found'
      });
    }
  };

  return (
    <div className="sidebar">
      <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input
              type="email"
              placeholder="Add friend by email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search size={20} />
            </button>
          </div>
          {searchStatus.message && (
            <div className={`search-status ${searchStatus.type}`}>
              {searchStatus.message}
            </div>
          )}
        </form>
      </div>

      <div className="users-list">
        {userDetails.map((userx) => (
          <div
            key={userx.friend._id}
            className={`user-item ${specificUser?.friend?._id === userx.friend._id ? 'active' : ''}`}
            onClick={() => setSpecificUser(userx)}
          >
            <div className="user-avatar">
              <img
                src={userx.friend.picture || user.picture}
                alt={userx.friend.name}
                className="avatar-image"
              />
            </div>
            <div className="user-info">
              <span className="user-name">{userx.friend.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;