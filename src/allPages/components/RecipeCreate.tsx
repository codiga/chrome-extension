import React from "react";
import ReactShadowRoot from "react-shadow-root";
import { BASE_URL } from "../../constants";
const Buffer = require("buffer/").Buffer;

const RecipeCreateForm = ({ code, language }) => {
  const linkStyle = {
    background: "linear-gradient(90deg, #F81C9D 0%, #FC8926 100%)",
    borderRadius: "3px",
    color: "white",
    textDecoration: "none",
    marginBottom: ".5rem",
    padding: ".5rem .7rem"
  };

  const blockStyle = { marginBottom: ".3rem" }
  const encodedRecipe = Buffer.from(code).toString("base64");

  return (
    <ReactShadowRoot>
      <div id="codiga-create-recipe" style={blockStyle}>
        {/* The shadow root will be attached to this DIV */}
        <a
          href={`${BASE_URL}/assistant/recipe/create?code=${encodeURIComponent(
            encodedRecipe
          )}${language?`&language=${language}`:''}`}
          style={linkStyle}
          rel="noreferrer"
          target="_blank"
          type="button"
        >
          Create Codiga recipe
        </a>
      </div>
    </ReactShadowRoot>
  );
};

export default RecipeCreateForm;
