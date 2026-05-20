import React from "react";
import ReactDOM from "react-dom/client";
import GithubWidget from "./components/GithubWidget";
import "./styles/widget.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GithubWidget username="rjsmall90" />
  </React.StrictMode>
);
