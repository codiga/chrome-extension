export type Violation = {
  line: number;
  group: {
    category: string;
    description: string;
  }[];
};

export type ValidateCodeInformation = { code: string; language: string; filename: string; id: string };

export type ValidateCodeResult = {errors: Record<string, unknown>, violations: Violation[]};

export type Position = { x: number, y: number }

export type Dimensions = {
  width: number,
  height: number
}