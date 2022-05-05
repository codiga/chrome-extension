import {
    ADD_CODE_ASSISTANCE,
    BASE_URL,
    CODIGA_API_TOKEN,
    CREATE_RECIPE_FROM_SELECTION,
    INSTALL_NOTIFICATION_SHOWN,
  } from "../constants";
  import Toastify from "toastify-js";
  import {
    addCodeMirrorListeners,
  } from "./containerLogic";
  import { mutationsCallback } from "../utils";
  import ShortcutDropdown from "../components/ShortcutDropdown";
  
  const Buffer = require("buffer/").Buffer;
  
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === ADD_CODE_ASSISTANCE) {
      const container = document.querySelector("body");
      if (container) {
        const observer = new MutationObserver(
          mutationsCallback(addCodeMirrorListeners)
        );
        observer.observe(container, { childList: true, subtree: true });
      }
    }
  });
  
  chrome.storage.sync.get(
    [CODIGA_API_TOKEN, INSTALL_NOTIFICATION_SHOWN],
    async function (obj) {
      const token = obj[CODIGA_API_TOKEN];
      const installedNotificationShown = obj[INSTALL_NOTIFICATION_SHOWN];
  
      if (!token && !installedNotificationShown) {
        Toastify({
          text: `<img src='${chrome.runtime.getURL(
            "icon16.png"
          )}'/><br/> We invite you to add your Codiga token`,
          destination: "https://app.codiga.io/api-tokens",
          newWindow: true,
          close: true,
          stopOnFocus: true,
          escapeMarkup: false,
          duration: 5000,
          style: {
            background: "#300623",
            color: "white",
            fontSize: "0.8rem",
            transform: "translate(0px, 0px)",
            top: "15px",
            position: "absolute",
            right: "15px",
            zIndex: "100000",
            padding: "1rem",
          },
        }).showToast();
  
        chrome.storage.sync.set(
          { [INSTALL_NOTIFICATION_SHOWN]: "true" },
          function () {
            console.log("Updated shown notification flag");
          }
        );
      }
    }
  );
  
  // Components register
  window.customElements.define("codiga-shortcut-dropdown", ShortcutDropdown);