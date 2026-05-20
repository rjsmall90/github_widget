import React from "react";
import ReactDOM from "react-dom/client";
import GithubWidget from "./components/GithubWidget";
import "./styles/widget.css";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_GRAPHQL_TOKEN;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GithubWidget username="rjsmall90" token={GITHUB_TOKEN} />
  </React.StrictMode>
);
