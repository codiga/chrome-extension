export type Position = { x: number; y: number };

export type Dimensions = {
  width: number;
  height: number;
};

export type AssistantRecipe = {
  id: number;
  shortcut: string;
  code: string;
  presentableFormat: string;
  name: string;
  description: string;
  isPublic: boolean;
  owner: {
    username: string;
    accountType: string;
  };
};

export type ShortcutContext = {
  code: string;
  recipes: AssistantRecipe[];
  activeLineIndex: number;
};
