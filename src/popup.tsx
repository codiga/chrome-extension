import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CodigaLogo } from "./components/CodigaLogo";
import { PopUpCheck } from "./components/PopUpCheck";
import { CODIGA_API_TOKEN } from "./constants";

const Popup = () => {
  const [codigaToken, setGitHubToken] = useState("");
  const [storedCodigaToken, setStoredCodigaToken] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(CODIGA_API_TOKEN, function (obj) {
        setStoredCodigaToken(obj[CODIGA_API_TOKEN] || "");
    });
  }, []);

  const saveGitHubToken = async (gitHubToken: string) => {
    if (!gitHubToken.length) {
      setInputError("Required");
      return;
    }

    chrome.storage.sync.set({ [CODIGA_API_TOKEN]: gitHubToken }, function () {
      console.log("Updated GitHub API Token");
      setStoredCodigaToken(gitHubToken);
    });
  };

  const restartInformation = () => {
    setStoredCodigaToken("");
    setGitHubToken("");
    chrome.storage.sync.remove(CODIGA_API_TOKEN, function () {
      console.log("Cleared GitHub API Token");
    });
  };

  const onTokenInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGitHubToken(event.target.value);
    setInputError("");
  };

  return (
    <>
      <div id="popup">
        <div id="popup-header">
          <CodigaLogo />
        </div>
        {!(storedCodigaToken.length === 0) && (
          <div id="popup-body" className="flex column align-center text-center">
            <div>
              <PopUpCheck />
            </div>
            <div id="good-news-text">
              Good news! You already set your Codiga API Token.
            </div>
            <button
              onClick={() => restartInformation()}
              className="side-margin-auto"
            >
              {" "}
              Reset Token{" "}
            </button>
          </div>
        )}
        {storedCodigaToken.length === 0 && (
          <div id="popup-body" className="flex column">
            {/*globalError.length > 0 && (
              <div className="error-block">{globalError}</div>
            )*/}
            <span className="flex">
              Set your{" "}
              <a href="https://app.codiga.io/api-tokens" target="_blank" rel="noreferrer">
                Codiga API Token
              </a>
              :
            </span>
            <ol>
              <li>It&apos;s used to search your private snippets from the browser</li>
              <li>It will only be stored in your local storage</li>
            </ol>
            <input
              className={`${inputError.length ? "error-input" : ""}`}
              placeholder="API Token..."
              value={codigaToken}
              onChange={(event) => onTokenInput(event)}
            />
            {inputError.length > 0 && (
              <span className="error-text">{inputError}</span>
            )}
            <button
              onClick={() => saveGitHubToken(codigaToken)}
              className="top-bottom-margin-1 side-margin-auto"
            >
              {" "}
              Set Token
            </button>
          </div>
        )}
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
