import React, { useState } from "react";
import ReactShadowRoot from "react-shadow-root";

const RecipeSearchForm = () => {
  const style = ``;

  const [isOpen, setIsOpen] = useState(false);

  const innerStyle = {
    display: isOpen ? "block" : "none",
    marginBottom: "1rem",
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ReactShadowRoot>
      <div id="codiga-search-bar">
        {/* The shadow root will be attached to this DIV */}
        <button type="button" onClick={toggle}>
          🔍 Search Recipe
        </button>
        <div style={innerStyle}>
          <input
            onClick={(e) => {
              console.log(e);
              e.stopPropagation();
            }}
            type="text"
            placeholder="Search by name"
          ></input>
        </div>
      </div>
    </ReactShadowRoot>
  );
};

export default RecipeSearchForm;
