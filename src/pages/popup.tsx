import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import Header from "../components/header";
import Button from "../components/common/Button";
import CheckCircleIcon from "../components/common/CheckCircleIcon";
import { CODIGA_API_TOKEN } from "../lib/constants";

const Popup = () => {
  const [newCodigaTokenValue, setNewCodigaTokenValue] = useState("");
  const [storedCodigaToken, setStoredCodigaToken] = useState("");
  const [inputError, setInputError] = useState("");

  // check storage for an API token on load
  useEffect(() => {
    chrome.storage.sync.get(CODIGA_API_TOKEN, function (obj) {
      setStoredCodigaToken(obj[CODIGA_API_TOKEN] || "");
    });
  }, []);

  const saveGitHubToken = async (gitHubToken: string) => {
    if (!gitHubToken.length) {
      setInputError("An API token is required");
      return;
    }

    chrome.storage.sync.set({ [CODIGA_API_TOKEN]: gitHubToken }, function () {
      console.log("Updated GitHub API Token");
      setStoredCodigaToken(gitHubToken);
    });
  };

  const restartInformation = () => {
    setStoredCodigaToken("");
    setNewCodigaTokenValue("");
    chrome.storage.sync.remove(CODIGA_API_TOKEN, function () {
      console.log("Cleared GitHub API Token");
    });
  };

  const onTokenInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCodigaTokenValue(event.target.value);
    setInputError("");
  };

  return (
    <div className="popup">
      {/* Popup Header */}
      <Header />

      {/* Popup Body */}
      <div className="popup__body">
        {storedCodigaToken.length === 0 ? (
          // No Token State
          <>
            <p>
              Get and set a{" "}
              <a
                href="https://app.codiga.io/api-tokens"
                target="_blank"
                rel="noreferrer"
                className="color-rose"
              >
                Codiga API Token
              </a>
              . This token is used to fetch your private and favorite snippets.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveGitHubToken(newCodigaTokenValue);
              }}
            >
              <div>
                <input
                  required
                  id="api-token-input"
                  placeholder="Codiga API Token..."
                  value={newCodigaTokenValue}
                  onChange={(event) => onTokenInput(event)}
                />
                <span className="error-text">{inputError || ""}</span>
              </div>

              <Button type="submit" variant="primary" shape="pill">
                Set Token
              </Button>
            </form>
          </>
        ) : (
          // Valid Token State
          <>
            <CheckCircleIcon />
            <p
              style={{
                textAlign: "center",
                color: "#000",
                fontFamily: "Open Sans, sans-serif",
                fontWeight: "400",
                fontSize: "12px",
                lineHeight: "20px",
                margin: 0,
              }}
            >
              Your Codiga API token has been set!
            </p>
            <Button
              variant="secondary"
              shape="pill"
              onClick={() => restartInformation()}
            >
              Update Token
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const container = document.getElementById("codiga-popup-root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
