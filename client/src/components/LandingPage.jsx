import React from 'react';
import { MessageSquare, Globe, Users, Zap } from 'lucide-react';
import "../assets/styles/landingPage.css";

const LandingPage = ({loginWithRedirect,setMakePay,status}) => {

  const handleGetStarted = async () => {
    if(status == 0){
      loginWithRedirect();
    }else{
      setMakePay(true);
    }
  }
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          Chat Across Languages
          <span> Instantly</span>
        </h1>
        <p className="hero-description">
          Break language barriers with real-time chat translation. Connect with anyone, anywhere, in your preferred language.
        </p>
        <button className="hero-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>

      {/* Features Grid */}
      <div className="features-container">
        <div className="features-grid">
          <FeatureCard 
            icon={<MessageSquare />}
            title="Real-Time Translation"
            description="Messages are instantly translated to your preferred language, enabling seamless conversations with anyone."
          />
          <FeatureCard 
            icon={<Globe />}
            title="Multiple Languages"
            description="Support for numerous languages, allowing you to chat comfortably in your native tongue."
          />
          <FeatureCard 
            icon={<Users />}
            title="Global Community"
            description="Connect with people worldwide without worrying about language differences."
          />
          <FeatureCard 
            icon={<Zap />}
            title="Lightning Fast"
            description="High-performance translation engine ensures your conversations flow naturally without delays."
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <div className="how-it-works-container">
          <h2 className="how-it-works-title">
            How It Works
          </h2>
          <div className="steps-container">
            <Step 
              number="1"
              title="Sign Up"
              description="Create your account and select your preferred language"
            />
            <Step 
              number="2"
              title="Start Chatting"
              description="Begin conversations with other users in any language"
            />
            <Step 
              number="3"
              title="Automatic Translation"
              description="Messages are automatically translated to your preferred language"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

const Step = ({ number, title, description }) => (
  <div className="step">
    <div className="step-number">{number}</div>
    <div className="step-content">
      <h3 className="step-title">{title}</h3>
      <p className="step-description">{description}</p>
    </div>
  </div>
);

export default LandingPage;