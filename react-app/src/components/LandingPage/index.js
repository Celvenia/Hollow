import React from 'react';
import './LandingPage.css';

const LandingPage = () => {


  return (
    <div className="landing-page">
      <div className="content-wrapper">
        <h1>Your Personal AI Assistant</h1>
        <h3>Unleash the AI Essence within, as your loyal companion through life. Traverse realms with enlightened guidance. Unveil knowledge beyond imagination. Forge a bond that transcends worlds</h3>
        <img
          src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1685522234/Personal%20Assistant/132022715fed869b2067b59919f7f9f9_etyssg.gif"
          alt="Personal Assistant GIF"
          className="gif-image"
        />
      </div>
    </div>
  );
};

export default LandingPage;
