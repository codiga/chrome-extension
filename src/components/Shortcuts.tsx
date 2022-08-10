import React from "react";
import { Buffer } from "buffer";
import { ShortcutContext } from "../lib/types";

type PropsType = {
  context: ShortcutContext;
};

const Shortcuts = (props: PropsType) => {
  const { context } = props;

  return (
    <div>
      {context.recipes.map((shortcut) => (
        <button
          key={shortcut.shortcut}
          onClick={() => {
            const content = document.querySelector(".cm-content");
            const splitCode = context.code.split("\n");
            const shortcutCode = Buffer.from(
              shortcut.presentableFormat,
              "base64",
            ).toString("utf8");

            const topCode = splitCode
              .slice(0, context.activeLineIndex)
              .join("\n");

            const bottomCode = splitCode
              .slice(context.activeLineIndex)
              .join("\n");

            const codeToInsert = `${
              topCode ? `${topCode}\n` : ""
            }${shortcutCode}${bottomCode ? `${bottomCode}` : ""}`;

            content.innerHTML = codeToInsert;
          }}
        >
          {shortcut.shortcut}
        </button>
      ))}
    </div>
  );
};
export default Shortcuts;
