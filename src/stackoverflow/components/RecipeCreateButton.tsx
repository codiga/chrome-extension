import React from "react";
import ReactShadowRoot from "react-shadow-root";
import { Buffer } from "buffer";
import { BASE_URL } from "../../constants";

type RecipeCreateButtonProps = {
  code: string;
  language: string;
  keywords: string[];
  isDarkMode: boolean;
};
const RecipeCreateButton = ({
  code,
  language,
  keywords,
  isDarkMode,
}: RecipeCreateButtonProps) => {
  const linkStyle = {
    border: "solid 1px transparent",
    background: "none",
    backgroundImage: "linear-gradient(90deg, #F81C9D 0%, #FC8926 100%)",
    backgroundOrigin: "border-box",
    boxShadow: isDarkMode
      ? "0 1000px 0 #1a1a1a inset"
      : "0 1000px 0 white inset",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    color: isDarkMode ? "white" : "black",
    textDecoration: "none",
    marginBottom: ".2rem",
    padding: ".2rem .4rem",
    marginLeft: "auto",
  };

  const blockStyle = { marginBottom: ".3rem", display: "flex" };
  const encodedRecipe = Buffer.from(code).toString("base64");

  return (
    <ReactShadowRoot>
      <div id="codiga-create-snippet" style={blockStyle}>
        {/* The shadow root will be attached to this DIV */}
        <a
          href={`${BASE_URL}/assistant/snippet/create?code=${encodeURIComponent(
            encodedRecipe,
          )}${language ? `&language=${language}` : ""}${
            keywords && keywords.length ? `&keywords=${keywords.join(",")}` : ""
          }`}
          style={linkStyle}
          rel="noreferrer"
          target="_blank"
        >
          <img
            style={{ marginRight: ".4rem" }}
            src={`${chrome.runtime.getURL("icon_16.png")}`}
          />
          + Snippet
        </a>
      </div>
    </ReactShadowRoot>
  );
};

export default RecipeCreateButton;
