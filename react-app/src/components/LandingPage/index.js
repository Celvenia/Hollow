import React from 'react';
import './LandingPage.css';

const LandingPage = () => {


  return (
    <div className="landing-page">
      <div className="content-wrapper">
        <h1>Your Personal AI Assistant</h1>
        <h3>Unleash the AI Essence within, as your loyal companion through life. Traverse realms with enlightened guidance. Unveil knowledge beyond imagination. Forge a bond that transcends worlds</h3>
        <img
          src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1685946464/Personal%20Assistant/Screen_Recording_20230604_234149_YouTube_1_yrmu9f.gif"
          alt="Personal Assistant GIF"
          className="gif-image"
        />
      </div>
    </div>
  );
};

export default LandingPage;
