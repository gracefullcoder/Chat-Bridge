import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./Profile";
import "../assets/styles/Navbar.css";

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
  const [showProfile, setShowProfile] = useState(false);

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
          {showProfile && (
            <div className="dropdown">
              <button onClick={() => setShowProfile(false)} className="dropdown-item">
                Close
              </button>
              <Profile user={user} />
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="dropdown-item"
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
