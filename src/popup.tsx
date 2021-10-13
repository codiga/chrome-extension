import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CodigaLogo } from './CodigaLogo';
import { PopUpCheck } from './components/PopUpCheck';
import { validateGitHubToken } from './validateGitHubToken';

const GITHUB_KEY = 'codiga-github-key';

const Popup = () => {
  const [gitHubToken, setGitHubToken] = useState("");
  const [storedGitHubToken, setStoredGitHubToken] = useState("");
  const [inputError, setInputError] = useState("");
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(GITHUB_KEY, function(obj) {
      setStoredGitHubToken(obj[GITHUB_KEY] || "");
    });
  }, [])

  const saveGitHubToken = async (gitHubToken: string) => {
    if(!gitHubToken.length){
      setInputError("Required");
    }

    const isTokenValid = await validateGitHubToken(gitHubToken);

    if(isTokenValid){
      chrome.storage.sync.set({[GITHUB_KEY]: gitHubToken}, function() {
        console.log("Updated GitHub API Token");
        setStoredGitHubToken(gitHubToken);
      });
    } else {
      setGlobalError("Invalid Token");
      setGitHubToken("");
      setInputError("");
    }
  }

  const restartInformation = () => {
    setStoredGitHubToken("");
  }

  const onTokenInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGitHubToken(event.target.value);
    setInputError("");
  }

  return (
    <>
      <div id="popup">
        <div id="popup-header">
          <CodigaLogo /> <span id="for-chrome">for chrome</span>
        </div>
        
        {!(storedGitHubToken.length === 0) && <div id="popup-body" className="flex column align-center text-center">
          <div><PopUpCheck /></div>
          <div id="good-news-text">Good news! You already set your GitHub API Token.</div>
          <button onClick={() => restartInformation()} className="side-margin-auto"> Update Token </button>
        </div>}
        {(storedGitHubToken.length === 0) && <div id="popup-body" className="flex column">
          {globalError.length > 0 && (<div className="error-block">
            {globalError}
          </div>)}
          <span className="flex">Set your <a href="https://github.com/settings/tokens" target="_blank">GitHub API Token</a>:</span>
          <ol>
            <li>It's used to do code reviews in your private repositories</li> 
            <li>It should only have <b>read access</b></li> 
            <li>It will only be stored in your local storage</li>
          </ol>
          <input 
            className={`${inputError.length?'error-input':''}`} 
            placeholder="API Token..." 
            value={gitHubToken} 
            onChange={(event) => onTokenInput(event)} />
          { inputError.length > 0 && (<span className="error-text">
            {inputError}
          </span>)}
          <button onClick={() => saveGitHubToken(gitHubToken)} className="top-bottom-margin-1 side-margin-auto"> Set Token</button>
        </div>}
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