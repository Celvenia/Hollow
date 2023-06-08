import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { authenticate } from "./store/session";

import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import HollowSpeechRecognition from "./components/HollowSpeechRecognition";
import Notes from "./components/Notes";
import Conversation from "./components/Conversation";
import Clock from "./components/Clock";
import Calendar from "./components/Calendar";
import Reminders from "./components/Reminders";

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
                    <Route path="/notes">
                      <Notes />
                    </Route>
                    <Route path="/reminders">
                      <Reminders />
                    </Route>
                  </Switch>
                )}
              </div>
              <div className="grid-main-item"> <Clock /></div>
              <div className="grid-main-item">
               <Calendar />
              </div>
            </div>
          </main>
        )}
      </div>

  );
}

export default App;
