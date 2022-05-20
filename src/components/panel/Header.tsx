import React from "react";
import { CloseIcon } from "../CloseIcon";
import { CodigaLogo } from "../CodigaLogo";

const CodigaHeader = (props: { toggleDrawer: () => void }) => {
  const { toggleDrawer } = props;

  const headerStyles = {
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    padding: "8px 16px",
    background: "#300623",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const buttonStyles = {
    padding: "1rem",
    background: "none",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  };

  return (
    <>
      <div style={headerStyles}>
        <CodigaLogo />
        <button onClick={toggleDrawer} style={buttonStyles}>
          <CloseIcon />
        </button>
      </div>
    </>
  );
};

export default CodigaHeader;
