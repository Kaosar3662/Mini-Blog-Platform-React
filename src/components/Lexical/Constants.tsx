import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
} from "lucide-react";

export const RichTextAction = {
  Bold: "bold",
  Italics: "italics",
  Underline: "underline",
  Strikethrough: "strikethrough",
  Code: "code",
  LeftAlign: "leftAlign",
  CenterAlign: "centerAlign",
  RightAlign: "rightAlign",
  JustifyAlign: "justifyAlign",
  Divider: "divider",
  Undo: "undo",
  Redo: "redo",
};

export const RICH_TEXT_OPTIONS = [
  { id: RichTextAction.Bold, label: "Bold", icon: Bold },
  { id: RichTextAction.Italics, label: "Italics", icon: Italic },
  { id: RichTextAction.Underline, label: "Underline", icon: Underline },
  { id: RichTextAction.Divider },
  {
    id: RichTextAction.Strikethrough,
    label: "Strikethrough",
    icon: Strikethrough,
  },
  {
    id: RichTextAction.Code,
    label: "Code",
    icon: Code,
  },
  { id: RichTextAction.Divider },
  {
    id: RichTextAction.LeftAlign,
    label: "Align Left",
    icon: AlignLeft,
  },
  {
    id: RichTextAction.CenterAlign,
    label: "Align Center",
    icon: AlignCenter,
  },
  {
    id: RichTextAction.RightAlign,
    label: "Align Right",
    icon: AlignRight,
  },
  {
    id: RichTextAction.JustifyAlign,
    label: "Align Justify",
    icon: AlignJustify,
  },
  { id: RichTextAction.Divider },
  {
    id: RichTextAction.Undo,
    label: "Undo",
    icon: Undo,
  },
  {
    id: RichTextAction.Redo,
    label: "Redo",
    icon: Redo,
  },
];

export const LOW_PRIORIRTY = 1;
export const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];