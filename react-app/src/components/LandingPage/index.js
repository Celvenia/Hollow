import React from 'react';
import './LandingPage.css';

const LandingPage = () => {


  return (
    <div className="landing-page">
      <div className="content-wrapper">
        <h1>Welcome to Hollow, Your Personal AI Assistant</h1>
        <h3>Access the limitless power of AI, right inside Hollow. Work faster. Write better. Think bigger.</h3>
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
