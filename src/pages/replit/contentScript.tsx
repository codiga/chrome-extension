import Toastify from "toastify-js";
import {
  ADD_CODE_ASSISTANCE,
  CODIGA_API_TOKEN,
  INSTALL_NOTIFICATION_SHOWN,
} from "../../lib/constants";
import ShortcutDropdown from "../../components/ShortcutDropdown";
import { addCodigaPanel } from "../../lib/addCodigaPanel";

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === ADD_CODE_ASSISTANCE) {
    const container = document.querySelector("body");
    if (container) {
      // check if the panel has already been appended
      if (document.getElementById("codiga-app-root")) return;
      addCodigaPanel(container);
      // Remove this to add shortcut functionality
      /*const observer = new MutationObserver(
          mutationsCallback(addCodeMirrorListeners)
        );
        observer.observe(container, { childList: true, subtree: true });*/
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
          "icon_16.png",
        )}'/> Codiga API Token not configured. Get one now.`,
        destination: "https://app.codiga.io/api-tokens",
        newWindow: true,
        stopOnFocus: true,
        escapeMarkup: false,
        duration: 4000,
        style: {
          transform: "translate(0px, 0px)",
          top: "15px",
          position: "absolute",
          right: "15px",
          zIndex: "100000",
          fontSize: "12px",
          lineHeight: "20px",
          fontFamily: "'Open Sans', sans-serif",
          background: "#fff",
          color: "#1a1a1a",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderLeft: "4px solid #FF4A4A",
          borderRadius: "4px",
          height: "48px",
          cursor: "pointer",
        },
      }).showToast();

      chrome.storage.sync.set(
        { [INSTALL_NOTIFICATION_SHOWN]: "true" },
        function () {
          console.log("Updated shown notification flag");
        },
      );
    }
  },
);

// Components register
window.customElements.define("codiga-shortcut-dropdown", ShortcutDropdown);
