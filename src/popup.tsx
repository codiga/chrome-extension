import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const GITHUB_KEY = 'codiga-github-key';

const Popup = () => {
  const [gitHubKey, setGitHubKey] = useState("");
  const [storedGitHubKey, setStoredGitHubKey] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(GITHUB_KEY, function(obj) {
      setStoredGitHubKey(obj[GITHUB_KEY] || "");
    });
  }, [])

  const saveGitHubKey = (gitHubKey: string) => {
    chrome.storage.sync.set({[GITHUB_KEY]: gitHubKey}, function() {
      console.log("Updated GitHub API Key");
      setStoredGitHubKey(gitHubKey);
    });
  }

  const restartInformation = () => {
    setStoredGitHubKey("");
  }

  
  return (
    <>
      <div id="popup">
        <div id="popup-header">
          <img src="icon48.png" /> <span id="codiga">Codiga</span> <span id="for-chrome">for chrome</span>
        </div>
        {!(storedGitHubKey.length === 0) && <div id="popup-body">
          Good news! You already set your GitHub API Key.
          <button onClick={() => restartInformation()}> Update key </button>
        </div>}
        {(storedGitHubKey.length === 0) && <div id="popup-body">
          <span className="flex">Set your <a href="https://github.com/settings/tokens" target="_blank">GitHub API Key</a>:</span>
          <ol>
            <li>It's used to do code reviews in your private repositories</li> 
            <li>It should only have <b>read access</b></li> 
            <li>It will only be stored in your local storage</li>
          </ol>
          <input placeholder="API Key..." value={gitHubKey} onChange={(event) => setGitHubKey(event.target.value)}></input>
          <button disabled={gitHubKey.length < 10} onClick={() => saveGitHubKey(gitHubKey)}> Set key</button>
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