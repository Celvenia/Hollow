import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import "./Testing.css";

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#html_and_css_2
export default function Testing() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
  const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

  const [spoken, setSpoken] = useState("");
  const dispatch = useDispatch()

  // create new SpeechRecognition instances
  const recognition = new SpeechRecognition();

  // Methods available to SpeechRecognition class
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  useEffect(() => {
    // Starting speech recognition
    const diagnostic = document.querySelector(".output");
    const bg = document.querySelector("html");
    const hints = document.querySelector(".hints");

    document.getElementById("tap").onclick = () => {
      recognition.start();
      console.log("Ready to receive a color command.");
    };

    // Receiving and handling results
    recognition.onresult = (event) => {
      // results event returns SpeechRecognitionResultList object containing SpeechRecognitionResult objects
      // it has a getter enabling list/array access
      // SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual recognized words.
      // We then return its transcript property to get a string containing the individual recognized result as a string,
      // set the background color to that color, and report the color recognized as a diagnostic message in the UI.
      const result = event.results;
      // console.log(result)
      const speechInput = event.results[0][0].transcript;
      setSpoken(speechInput)
      diagnostic.textContent = `Result received: ${speechInput}.`;
      // bg.style.backgroundColor = color;
      console.log(`Confidence: ${event.results[0][0].confidence}`);
    };

    // We also use the speechend event to stop the speech recognition service from running
    // (using SpeechRecognition.stop()) once a single word has been recognized and it has finished being spoken:
    recognition.onspeechend = () => {
      recognition.stop();
    };

    // Handling errors and unrecognized speech
    recognition.onnomatch = (event) => {
      diagnostic.textContent = "I didn't recognize that.";
    };

    recognition.onerror = (event) => {
      diagnostic.textContent = `Error occurred in recognition: ${event.error}`;
    };
    return () => {
      recognition.abort();
    };
  }, []);

  // init SpeechSynth api
  const synth = window.speechSynthesis;

  useEffect(() => {
    const textForm = document.getElementById("text-form");
    const textInput = document.getElementById("text-input");
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

    const speak = () => {
      if (synth.speaking) {
        return;
      }
      if (textInput.value !== "") {
        // speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        // speak end
        speakText.onend = (e) => {
          console.log("Done Speaking");
        };
        // speak error
        speakText.onerror = (e) => {
          console.error("Something went wrong");
        };

        // selected voice
        const selectedVoice =
          voiceSelect.selectedOptions[0].getAttribute("data-name");

        // loop through voices
        voices.forEach((voice) => {
          if (voice.name === selectedVoice) {
            speakText.voice = voice;
            console.log(speakText, 'speak Text')
            console.log(voice, 'speakText voice?')
          }
        });

        // set rate and pitch
        speakText.rate = 1;
        speakText.pitch = 1;

        // speak
        synth.speak(speakText);
      }
    };
    textForm.addEventListener("submit", (e) => {
      e.preventDefault();
      speak();
      textInput.blur();
    });

    // voice select change
    voiceSelect.addEventListener("change", (e) => speak());
  }, []);



  return (
    <div className="flex-column-center">
      <h1>Testing</h1>
      <form className="flex-column-center" id="text-form">
        <textarea id="text-input"></textarea>
        <select id="voice-select"></select>
        <button type="submit"> Speak </button>
      </form>

      <div>
        <button>Testing</button>
        <h1>Speech</h1>
        <button id="tap">
          Listen
        </button>
        <div>
          <p className="output">
          </p>
        </div>
      </div>
    </div>
  );
}
