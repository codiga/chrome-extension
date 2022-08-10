import React from "react";
import * as ReactDOM from "react-dom/client";
import Panel from "../components/panel";

/**
 * Panel to search for snippets easily
 */
export const addCodigaPanel = (container: HTMLElement) => {
  const mountPoint = document.createElement("div");
  mountPoint.id = "codiga-app-root";
  const newStyle = document.createElement("style");
  newStyle.appendChild(
    document.createTextNode(`
      @font-face {
        font-family: "Open Sans";
        font-weight: 400;
        src: url(${chrome.runtime.getURL("OpenSans-Regular.ttf")})
            format("truetype");
      }
      @font-face {
        font-family: "Outfit";
        font-weight: 700;
        src: url(${chrome.runtime.getURL("Outfit-Bold.ttf")})
            format("truetype");
      }
  `),
  );
  document.head.appendChild(newStyle);
  const root = ReactDOM.createRoot(mountPoint);
  root.render(<Panel />);

  container.append(mountPoint);
};
