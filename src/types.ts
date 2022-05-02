export type Position = { x: number; y: number };

export type Dimensions = {
  width: number;
  height: number;
};

export type AssistantRecipe = {
  shortcut: string;
  code: string;
  presentableFormat: string;
};

export type ShortcutContext = {
  code: string;
  recipes: AssistantRecipe[];
  activeLineIndex: number
};
