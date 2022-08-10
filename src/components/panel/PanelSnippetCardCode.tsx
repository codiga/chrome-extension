import React from "react";
import {
  Prism as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import oneDark from "./PanelSnippetCardCode.styles";

type PanelSnippetCardCodeProps = SyntaxHighlighterProps;

function getLanguageAlias(language?: string) {
  switch (language) {
    case "javascript":
    case "Javascript":
      return "jsx";
    case "typescript":
    case "Typescript":
      return "tsx";
    case "terraform":
    case "Terraform":
      return "hcl";
    case "visual":
    case "Visual":
      return "vb";

    default:
      return language.toLowerCase();
  }
}

export default function PanelSnippetCardCode({
  children,
  language,
  ...props
}: PanelSnippetCardCodeProps) {
  return (
    <SyntaxHighlighter
      {...props}
      style={oneDark}
      customStyle={{ borderRadius: "4px", margin: 0, padding: "8px" }}
      language={getLanguageAlias(language)}
    >
      {children}
    </SyntaxHighlighter>
  );
}
