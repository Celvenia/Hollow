import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { postMessage } from "../../store/message";
import { getNotes } from "../../store/note";

// import "./HollowSpeechRecognition.css";

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#html_and_css_2
export default function HollowSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
  const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

  const [spoken, setSpoken] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const messagesObj = useSelector((state) => state.messageReducer);
  const messagesArr = Object.values(messagesObj);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [diagnosticText, setDiagnosticText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [active, setActive] = useState(false);

  // init SpeechSynth api
  const synth = window.speechSynthesis;

  useEffect(() => {
    const handleVoicesChanged = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0]);
    };

    synth.addEventListener("voiceschanged", handleVoicesChanged);

    return () => {
      synth.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, [selectedVoice]);

  useEffect(() => {
    const voiceSelect = document.getElementById("voice-select");

    let voices = [];

    const getVoices = () => {
      // populate voices array
      voices = synth.getVoices();
      // loop through voices array and create an option for each one
      voices.forEach((voice) => {
        // create option element to fill select
        const option = document.createElement("option");
        // fill option with voice and language
        option.textContent = `${voice.name} / ${voice.lang}`;
        // set needed options attributes
        option.setAttribute("data-lang", voice.lang);
        option.setAttribute("data-name", voice.name);
        voiceSelect.appendChild(option);
      });
    };

    getVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = getVoices;
    }
  });

  const hollowStart = async (e) => {
    e.preventDefault();
    // create new SpeechRecognition and SpeechGrammarList instances
    const hollow = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    setActive(true);

    const keyWords = ["stop listening", "Hollow"];

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
    setSpoken("started listening");
    console.log("started listening");

    // results event returns SpeechRecognitionResultList object containing SpeechRecognitionResult objects
    // it has a getter enabling list/array access
    // SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual recognized words.
    // We then return its transcript property to get a string containing the individual recognized result as a string,

    //   const result = event.results;
    // Receiving and Handling Results
    hollow.onresult = (event) => {
      let timeout;
      const queries = [
        "Hollow who is",
        "Hollow what is",
        "Hollow where is",
        "Hollow how is",
        "Hollow when is",
        "Hollow who are",
        "Hollow what are",
        "Hollow where are",
        "Hollow how are",
        "Hollow when are",
      ];

      const tabs = [
        "notes",
        "messages",
        "reminders",
        "alarms",
        "testing",
        "home",
      ];

      const speak = (spoken) => {
        if (synth.speaking) {
          return;
        }
        if (spoken !== "") {
          // speak text
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
          speakText.rate = 1;
          speakText.pitch = 1;

          // speak
          synth.speak(speakText);
        }
      };

      const processResult = (spoken) => {
        setDiagnosticText("");
        if (spoken.includes("stop listening")) {
          hollow.stop();
        } else if (spoken.includes("ignore")) {
          clearTimeout(timeout);
          spoken = "";
          console.log(spoken);
        } else if (queries.some((query) => spoken.includes(query))) {
          let spokenAfter = spoken.split("Hollow")[1];
          speak(spokenAfter);
          dispatch(postMessage(spokenAfter.toString())).then((result) =>
            speak(result.ai_response)
          );
        } else if (spoken.includes("navigate".toLowerCase())) {
          let page = spoken.split("navigate to ")[1];
          if (tabs.includes(page)) {
            if (page === "home") {
              page = "";
              speak(`navigating to home`);
            }
            if (page !== "home") {
              speak(`navigating to ${page}`);
            }
            history.push(`/${page}`);
          }
        }
      };

      for (let i = 0; i < event.results.length; i++) {
        let spoken = event.results[i][0].transcript;
        // clear previous timeout
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          setSpoken(spoken);
          processResult(spoken);
          //   speak(messagesArr ? messagesArr[messagesArr.length - 1]?.ai_response : "")
        }, 2000);
      }
    };

    // We also use the speechend event to stop the speech recognition service from running
    // (using SpeechRecognition.stop()) after delay and it has finished being spoken:
    hollow.onspeechend = () => {
      hollow.stop();
      setActive(false);
      setSpoken("");
      console.log(active);
      return;
    };

    hollow.onnomatch = (event) => {
      setDiagnosticText("I didn't recognize that.");
    };

    hollow.onerror = (event) => {
      setDiagnosticText(`Error occurred in recognition: ${event.error}`);
    };
    return () => {
      hollow.abort();
    };
  };

  useEffect(() => {
    dispatch(getNotes());
  }, [dispatch]);

  return (
    <div className="flex-column-center">
      <select
        id="voice-select"
        onChange={(e) => setSelectedVoice(voices[e.target.value])}
      >
        {voices.map((voice, index) => (
          <option key={index} value={index}>
            {voice.name} / {voice.lang}
          </option>
        ))}
      </select>

      <button onClick={hollowStart}> Hollow </button>
      <p>{spoken && `You said ${spoken}`}</p>
      <p>
        {messagesArr ? messagesArr[messagesArr.length - 1]?.ai_response : ""}
      </p>
      <p id="diagnostic">{diagnosticText}</p>
      <p>Active: {active.toString()}</p>
    </div>
  );
}
