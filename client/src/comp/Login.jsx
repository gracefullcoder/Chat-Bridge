// src/loginoauth/Login.jsx

import React, { useEffect, useState } from 'react';
import { Client, Account } from 'appwrite';

const client = new Client();
const account = new Account(client);

// Set your Appwrite endpoint and project ID
client
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('6700b4a200324d17efa7'); // Replace with your project ID

function Login({ onLogin }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
      if (userData) {
        onLogin(userData.email); // Call the onLogin function with the user's email
      }
    } catch (error) {
      console.error(error);
    }
  };

  const googleLogin = () => {
    account.createOAuth2Session('google', 'http://localhost:5173', 'http://localhost:5173'); // Adjust redirect URIs as needed
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Google Login with Appwrite</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <button onClick={logout} style={{ padding: '10px 20px' }}>
            Logout
          </button>
        </div>
      ) : (
        <button onClick={googleLogin} style={{ padding: '10px 20px' }}>
          Login with Google
        </button>
      )}
    </div>
  );
}

export default Login;
