import React, { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./Profile";
import "../assets/styles/Navbar.css";
import { toastMessage } from "../HelperFunction";
import axios from "axios";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ur', name: 'Urdu' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' }
].sort((a, b) => a.name.localeCompare(b.name));

const Navbar = ({ user, setUserDetails, setStatus }) => {
  const { isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();
  const [showProfile, setShowProfile] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const dropdownRef = useRef(null);

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
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_DOMAIN}/user/language`, {
        emailId: user.email,
        languageCode: selectedLanguage
      });
      
      toastMessage({ status:"success",message: `Language preference updated to ${languages.find(lang => lang.code === selectedLanguage).name}` });
      setShowProfile(false);
    } catch (error) {
      console.error('Error updating language:', error);
      toastMessage({ message: 'Failed to update language preference', type: 'error' });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <nav className="navbar">
      <div className="navbar-title">ChatBridge</div>
      {isAuthenticated ? (
        <div className="profile-menu" ref={dropdownRef}>
          <img
            src={user.picture}
            alt="Profile"
            className="profile-logo"
            onClick={() => setShowProfile(!showProfile)}
          />
          {showProfile && (
            <div className="dropdown-menu">
              <form onSubmit={handleSubmit} className="dropdown-form">
                <label htmlFor="language-select" className="dropdown-label">
                  Select Language
                </label>
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="dropdown-select"
                >
                  {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className="dropdown-submit">
                  Save Language
                </button>
              </form>
            </div>
          )}
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="auth-button"
          >
            Log Out
          </button>
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