import { icons, createElement } from "lucide";
import { isBrowser } from "../utils/environment";

const toSvg = (icon: any) => {
  if (isBrowser()) {
    const svg = createElement(icon);
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    return svg.outerHTML;
  } else {
    return "";
  }
};

export const bold = toSvg(icons.Bold);
export const italic = toSvg(icons.Italic);
export const strikethrough = toSvg(icons.Strikethrough);
export const code = toSvg(icons.Code);
export const math = toSvg(icons.Sigma);
export const link = toSvg(icons.Link);
export const quote = toSvg(icons.Quote);
export const sparkle = toSvg(icons.Sparkles);
export const spinner = toSvg(icons.Loader2);
export const wand = toSvg(icons.WandSparkles);
export const messageSquare = toSvg(icons.MessageSquareText);
export const smile = toSvg(icons.Smile);
export const listPlus = toSvg(icons.ListPlus);
export const listMinus = toSvg(icons.ListMinus);
export const spellCheck = toSvg(icons.SpellCheck);
export const penLine = toSvg(icons.PenLine);
export const settings = toSvg(icons.Settings);
export const penTool = toSvg(icons.PenTool);
export const fileText = toSvg(icons.FileText);
export const helpCircle = toSvg(icons.HelpCircle);
export const send = toSvg(icons.ArrowRight);
export const stop = toSvg(icons.X);
