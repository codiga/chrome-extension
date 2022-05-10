import { AssistantRecipe } from "../../types";
import React, { useState } from "react";
import { copyToClipboard } from "../../utils";
const Buffer = require("buffer/").Buffer;
import ReactMarkdown from "react-markdown";

const SnippetCard = ({ snippet }: { snippet: AssistantRecipe }) => {
  const [isCopied, setCopied] = useState<boolean>(false);

  const code = Buffer.from(snippet.presentableFormat, "base64").toString(
    "utf8"
  );

  const copyButtonStyle = {
    backgroundImage: "linear-gradient(90deg, #F81C9D 0%, #FC8926 100%)",
    backgroundOrigin: "border-box",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    color: "white",
    padding: ".2rem .4rem",
    fontWeigth: "bold",
    border: "none",
    cursor: "pointer",
    minWidth: "max-content",
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
          <h2>{snippet.name}</h2>
          {isCopied && (
            <button
              style={copyButtonStyle}
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
              style={copyButtonStyle}
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
        <div style={{ margin: "1rem" }}>
          <pre
            style={{
              margin: 0,
              paddingTop: "0.5em",
              paddingBottom: "0.5em",
              paddingLeft: "1em",
              paddingRight: "1em",
              overflow: "auto",
              border: "1px solid gray",
            }}
          >
            <code>{code}</code>
          </pre>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <ReactMarkdown>{snippet.description}</ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default SnippetCard;
