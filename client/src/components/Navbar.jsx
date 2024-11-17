import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./Profile";
import "../assets/styles/Navbar.css";
import { toastMessage } from "../HelperFunction";
import axios from "axios";

const Navbar = ({user,setUserDetails,setStatus}) => {
  const { isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (user) {
      const registerUser = async () => {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_DOMAIN}/user/signup`, user);
        console.log(response);
        await setUserDetails(response.data.userDetails);
        await setStatus(response.data.userDetails.paymentId ? 2 : 1);
        toastMessage(response.data);
      }

      registerUser();
    }
  }, [user])

  if (isLoading) return <div>Loading...</div>;

  return (
    <nav className="navbar">
      <div className="navbar-title">ChatBridge</div>
      {isAuthenticated ? (
        <div className="profile-menu">
          <img
            src={user.picture}
            alt="Profile"
            className="profile-logo"
            onClick={() => setShowProfile(!showProfile)}
          />
          <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="auth-button"
              >
                Log Out
              </button>
          {showProfile && (
            <div className="dropdown">
              <button onClick={() => setShowProfile(false)} className="dropdown-item">
                Close
              </button>
              <Profile user={user} />
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="auth-button"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={loginWithRedirect} className="auth-button">
          Log In
        </button>
      )}
    </nav>
  );
};

export default Navbar;
