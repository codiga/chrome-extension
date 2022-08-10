import React from "react";
import CloseIcon from "../../assets/CloseIcon";
import { ForChromeWithCodigaText } from "../common/CodigaForChrome";

type HeaderProps = {
  toggleDrawer?: () => void;
};

export default function Header({ toggleDrawer }: HeaderProps) {
  return (
    <header className="codiga-header">
      <ForChromeWithCodigaText />

      {/* We won't show this button in the Popup componenent/window */}
      {toggleDrawer && (
        <button onClick={toggleDrawer} className="codiga-header__close-button">
          <CloseIcon />
        </button>
      )}
    </header>
  );
}
