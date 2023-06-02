import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
// import Testing from "./components/Testing";
import LandingPage from "./components/LandingPage";
import Notes from "./components/Notes";
import Message from "./components/Message";
import HollowSpeechRecognition from "./components/HollowSpeechRecognition";
import Testing from "./components/Testing";
import Clock from "./components/Clock";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);


  return (
    <div className="app-container">
      <header>
        <HollowSpeechRecognition />
        <Navigation isLoaded={isLoaded} />
      <h2>Welcome to Hollow</h2>
      </header>
      {isLoaded && (
        <main>
          <div className="grid-main">
            <div className="grid-main-item"><Message /></div>
            <div className="grid-main-item"><Clock /></div> 
            <div className="grid-main-item"></div>
            <div className="grid-main-item">
              {isLoaded && (
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/notes/:id">
          <Notes />
        </Route>
        <Route path="/login">
          <LoginFormPage />
        </Route>
        <Route path="/signup">
          <SignupFormPage />
        </Route>
        <Route exact path="/testing">
          <Testing />
        </Route>
      </Switch>
    )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
