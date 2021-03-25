import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SpeechProvider } from "@speechly/react-client";

ReactDOM.render(
  <SpeechProvider appId={process.env.REACT_APP_SPEECHLY_APPID} language='en-US'>
    <App />
  </SpeechProvider>,
  document.getElementById("root")
);
