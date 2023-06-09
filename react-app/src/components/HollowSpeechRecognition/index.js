import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { postMessage } from "../../store/message";

import "./HollowSpeechRecognition.css";
import { getConversations } from "../../store/conversation";

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#html_and_css_2
export default function HollowSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
  // const SpeechRecognitionEvent =
  //   window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

  const [message, setMessage] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const [diagnosticText, setDiagnosticText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [active, setActive] = useState(false);

  // init SpeechSynth api
  const synth = window.speechSynthesis;

  const handleVoiceChange = (value) => {
    voices.forEach((voice) => {
      if (voice.name === value) {
        setSelectedVoice(voice);
      }
    });
  };

  useEffect(() => {
    const availableVoices = synth.getVoices();
    setVoices(availableVoices);
  }, []);

  useEffect(() => {
    getConversations();
  }, [dispatch]);

  const hollowStart = async (e) => {
    e.preventDefault();

    // create new SpeechRecognition and SpeechGrammarList instances
    const hollow = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    setActive(true);

    const keyWords = ["stop listening", "hey Hollow"];

    // Grammar - separated by semi-colons
    // 1: states the format and version used. This always needs to be included first. i.e #JSGF V1.0;
    // 2: The second line indicates a type of term that we want to recognize. public declares that it is a public rule,
    //    the string in angle brackets defines the recognized name for this term (color), and the list of items that
    //    follow the equals sign are the alternative values that will be recognized and accepted as appropriate values
    //    for the term. Note how each is separated by a pipe character.
    const grammar = `#JSGF V1.0; grammar keyWords; public <keyWord> = ${keyWords.join(
      " | "
    )};`;

    // This accepts as parameters the string we want to add, plus optionally a weight value that specifies the importance
    // of this grammar in relation of other grammars available in the list (can be from 0 to 1 inclusive.)
    speechRecognitionList.addFromString(grammar, 1);

    // Methods available to SpeechRecognition class
    hollow.grammars = speechRecognitionList;
    hollow.continuous = true;
    hollow.lang = "en-US";
    hollow.interimResults = false;
    hollow.maxAlternatives = 1;

    hollow.start();
    setMessage("started listening");
    // results event returns SpeechRecognitionResultList object containing SpeechRecognitionResult objects
    // it has a getter enabling list/array access
    // SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual recognized words.
    // We then return its transcript property to get a string containing the individual recognized result as a string,

    // const result = event.results;
    // Receiving and Handling Results
    hollow.onresult = (event) => {
      let timeout;

      const tabs = [
        "notes",
        "messages",
        "reminders",
        "alarms",
        "testing",
        "home",
      ];

      const date = new Date();

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      const alarmTime = document.getElementById("alarm-time");
      let speaking = document.getElementById("user-display-text");
      let aiSpeaking = document.getElementById("ai-display-text");

      const displayText = (text) => {
        const delay = 500;
        let index = 0;
        const words = text.split(" ");

        const interval = setInterval(() => {
          if (index < words.length) {
            aiSpeaking.innerText += words[index] + " ";
            index++;
          } else {
            clearInterval(interval);
          }
        }, delay);
      };

      const speak = (spoken) => {
        // was preventing ai_response
        // if (synth.speaking) {
        //   return;
        // }

        // speak text
        if (!currentUser) {
          const speakText = new SpeechSynthesisUtterance(spoken);
          speakText.voice = selectedVoice;
          hollow.abort();
        }

        if (spoken !== "") {
          const speakText = new SpeechSynthesisUtterance(spoken);

          speakText.voice = selectedVoice;

          // speak end
          speakText.onend = (e) => {
            console.log("Done Speaking");
          };
          // speak error
          speakText.onerror = (e) => {
            console.error("Something went wrong");
          };

          // set rate and pitch
          speakText.rate = 1.2;
          speakText.pitch = 1;

          // speak
          synth.speak(speakText);
        }
      };

      const processResult = (spoken) => {
        const conversation = {
          conversation_id: 6,
          message: "",
        };

        speaking.innerText = spoken;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          speaking.innerText = "";
          aiSpeaking.innerText = "";
        }, 15000);
        if (!currentUser) {
          speak(
            "Greetings weary traveler! I am Hollow, the guardian of this realm. To embark on your journey, seek passage by logging in"
          );
        } else if (spoken.includes("stop listening")) {
          speak("farewell");
          hollow.stop();
        } else if (spoken.includes("ignore")) {
          clearTimeout(timeout);
          spoken = "";
        } else if (spoken.includes("the current time")) {
          speak(`the current time is ${new Date().toLocaleTimeString()}`);
        } else if (spoken.includes("the current date")) {
          const formattedDate = date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
          speak(`the current date is ${formattedDate}`);
        } else if (spoken.includes("when is my next alarm")) {
          // HH:mm
          // alarmTime.value = "05:06";
          console.log(alarmTime.value);
          // } else if (queries.some((query) => spoken.includes(query))) {
        } else if (spoken.includes("hey Hollow")) {
          let spokenAfter = spoken.split("Hollow")[1];
          conversation.message = spokenAfter.toString();
          dispatch(postMessage(conversation)).then((result) => {
            if (result) {
              speak(result.ai_response);
              displayText(result.ai_response);
            }
          });
        } else if (spoken.includes("navigate to".toLowerCase())) {
          let page = spoken.split("navigate to ")[1];
          if (tabs.includes(page)) {
            if (page === "home") {
              page = "";
              speak(`navigating to home`);
              displayText(`navigating to home`);
            } else if (page !== "home") {
              speak(`navigating to ${page}`);
              displayText(`navigating to ${page}`);
            }
            history.push(`/${page}`);
          } else {
            speak("4 oh 4 page not found");
            displayText("404 page not found");
          }
        }
      };

      for (let i = 0; i < event.results.length; i++) {
        let spoken = event.results[i][0].transcript;

        // clear previous timeout
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          processResult(spoken);
        }, 2000);
      }
    };

    // We also use the speechend event to stop the speech recognition service from running
    // (using SpeechRecognition.stop()) after delay and it has finished being spoken:
    hollow.onspeechend = () => {
      hollow.stop();
      setActive(false);
      let speaking = document.getElementById("user-display-text");
      if (speaking) {
        speaking.innerText = "";
      }
      let aiSpeaking = document.getElementById("ai-display-text");
      if (aiSpeaking) {
        speaking.innerText = "";
      }
      return;
    };

    hollow.onnomatch = (event) => {
      setDiagnosticText("I didn't recognize that.");
      setActive(false);
      return () => {
        hollow.abort();
      };
    };

    hollow.onerror = (event) => {
      setDiagnosticText(`Error occurred in recognition: ${event.error}`);
      setActive(false);
      return () => {
        hollow.abort();
      };
    };

    return () => {
      hollow.abort();
    };
  };

  useEffect(() => {}, [dispatch]);

  return (
    <div className={`hollow-banner-${active}`}>
      <div className="flex-column-center">
        <button
          disabled={active}
          title="start hollow"
          id={`hollow-button-${active}`}
          onClick={hollowStart}
        >
          .
        </button>
        <select
          id="voice-select"
          title="choose voice"
          onChange={(e) => handleVoiceChange(e.target.value)}
        >
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
              {voice.name} / {voice.lang}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-row">
        <p
          id="diagnostic"
          onClick={(e) => setDiagnosticText((e.target.value = ""))}
        >
          {diagnosticText}
        </p>
      </div>
    </div>
  );
}
