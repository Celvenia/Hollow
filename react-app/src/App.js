import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import Note from "./components/Note";
import Message from "./components/Message";
import HollowSpeechRecognition from "./components/HollowSpeechRecognition";
import Notes from "./components/Notes";
import Conversation from "./components/Conversation";
import Clock, { TimeContext } from "./components/Clock";
import { getConversation } from "./store/conversation";

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user)
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
        {!currentUser && (
          <LandingPage />
        )} 
        {isLoaded && currentUser && (
          <main>
            <div className="grid-main">
              <div className="grid-main-item">
                <Conversation />
              </div>
              <div className="grid-main-item">
                {" "}
                {isLoaded && (
                  <Switch>
                    <Route exact path="/">
                      {/* Calendar for Reminders? */}
                      <Notes />
                    </Route>
                    <Route path="/login">
                      <LoginFormPage />
                    </Route>
                    <Route path="/signup">
                      <SignupFormPage />
                    </Route>
                  </Switch>
                )}
              </div>
              <div className="grid-main-item"> <Clock /></div>
              <div className="grid-main-item">
               
              </div>
            </div>
          </main>
        )}
      </div>

  );
}

export default App;
