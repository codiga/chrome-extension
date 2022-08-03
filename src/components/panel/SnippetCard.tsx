import { AssistantRecipe } from "../../types";
import React, { useState } from "react";
import { copyToClipboard } from "../../utils";
const Buffer = require("buffer/").Buffer;
import ReactMarkdown from "react-markdown";

const SnippetCard = ({ snippet }: { snippet: AssistantRecipe }) => {
  const [isCopied, setCopied] = useState<boolean>(false);

  const code = Buffer.from(snippet.presentableFormat, "base64").toString(
    "utf8",
  );

  const copyButtonStyle = (isCopied: boolean) => {
    return {
      backgroundImage: isCopied
        ? "none"
        : "linear-gradient(90deg, #F81C9D 0%, #FC8926 100%)",
      backgroundColor: isCopied ? "#383838" : "none",
      backgroundOrigin: "border-box",
      borderRadius: "15px",
      display: "flex",
      alignItems: "center",
      maxHeight: "1.2rem",
      fontSize: "15px",
      color: "white",
      padding: "1rem",
      fontWeigth: "bold",
      border: isCopied ? "1px solid #bc267a" : "none",
      cursor: "pointer",
      minWidth: "max-content",
    };
  };

  return (
    <>
      <div
        style={{
          padding: "1rem",
          background: "#ebeced",
          margin: "1rem 0.3rem",
          overflow: "scroll",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "1.7rem", color: "black" }}>{snippet.name}</h2>
          {isCopied && (
            <button
              style={copyButtonStyle(isCopied)}
              onClick={() => {
                setCopied(true);
                copyToClipboard(code);
              }}
            >
              Snippet copied to clipboard
            </button>
          )}
          {!isCopied && (
            <button
              style={copyButtonStyle(isCopied)}
              onClick={() => {
                setCopied(true);
                copyToClipboard(code);
              }}
            >
              Copy snippet to clipboard
            </button>
          )}
        </div>
        <div style={{ display: "flex" }}>
          <b>Owner:</b>{" "}
          <a
            target="_blank"
            style={{ marginLeft: "0.5rem" }}
            rel="noreferrer"
            href={`https://app.codiga.io/hub/user/${snippet.owner.accountType.toLowerCase()}/${snippet.owner.username.toLowerCase()}/assistant`}
          >
            {snippet.owner.username.toLowerCase()}
          </a>
        </div>
        <div style={{ margin: "1rem", padding: "0.5rem" }}>
          <pre
            style={{
              margin: 0,
              overflow: "auto",
              padding: "0.8rem",
              border: "1px solid gray",
              backgroundColor: "#282c34",
              color: "white",
            }}
          >
            <code style={{ backgroundColor: "transparent" }}>{code}</code>
          </pre>
        </div>
        <div style={{ marginTop: "1rem", fontSize: "1rem" }}>
          <ReactMarkdown>{snippet.description}</ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default SnippetCard;
