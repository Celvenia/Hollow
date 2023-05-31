import React, { useEffect } from "react";
// import "./Testing.css";


// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#html_and_css_2
export default function Testing() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
  const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

  const colors = [
    "aqua",
    "azure",
    "beige",
    "bisque",
    "black",
    "blue",
    "brown",
    "chocolate",
    "coral",
  ];

  // Grammar - separated by semi-colons
  // 1: states the format and version used. This always needs to be included first. i.e #JSGF V1.0;
  // 2: The second line indicates a type of term that we want to recognize. public declares that it is a public rule,
  //    the string in angle brackets defines the recognized name for this term (color), and the list of items that
  //    follow the equals sign are the alternative values that will be recognized and accepted as appropriate values
  //    for the term. Note how each is separated by a pipe character.
  const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(
    " | "
  )};`;

  // create new SpeechRecognition and SpeechGrammarList instances
  const recognition = new SpeechRecognition();
  const speechRecognitionList = new SpeechGrammarList();

  // This accepts as parameters the string we want to add, plus optionally a weight value that specifies the importance
  // of this grammar in relation of other grammars available in the list (can be from 0 to 1 inclusive.)
  speechRecognitionList.addFromString(grammar, 1);

  // Methods available to SpeechRecognition class 
  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  useEffect(() => {
    // Starting speech recognition
    const diagnostic = document.querySelector(".output");
    const bg = document.querySelector("html");
    const hints = document.querySelector(".hints");

    let colorHTML = "";
    colors.forEach((color, i) => {
      console.log(color, i);
      colorHTML += `<span style="background-color:${color};"> ${color} </span>`;
    });
    hints.innerHTML = `Tap or click then say a color to change the background color of the app. Try ${colorHTML}.`;

    document.body.onclick = () => {
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
      const color = event.results[0][0].transcript;
      diagnostic.textContent = `Result received: ${color}.`;
      bg.style.backgroundColor = color;
      console.log(`Confidence: ${event.results[0][0].confidence}`);
    };

    // We also use the speechend event to stop the speech recognition service from running
    // (using SpeechRecognition.stop()) once a single word has been recognized and it has finished being spoken:
    recognition.onspeechend = () => {
      recognition.stop();
    };

    // Handling errors and unrecognized speech
    recognition.onnomatch = (event) => {
      diagnostic.textContent = "I didn't recognize that color.";
    };

    recognition.onerror = (event) => {
      diagnostic.textContent = `Error occurred in recognition: ${event.error}`;
    };
  });

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
        console.log("Already Speaking");
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
        <h1>Speech color changer</h1>
        <p>
          Tap/click then say a color to change the background color of the app.
        </p>
        <div>
          <p class="output">
            <em class="hints">…diagnostic messages</em>
          </p>
        </div>
      </div>
    </div>
  );
}
