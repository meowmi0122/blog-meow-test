import homeSettingsRaw from "../../public/settings.json";
import homeMarkdownRaw from "../../public/index.md?raw";

export type HomeMode = "blog" | "markdown";

export interface HomeSettings {
  homeMode: HomeMode;
  navFolder: string;
}

const s = homeSettingsRaw as Partial<HomeSettings>;

export const homeSettings: HomeSettings = {
  homeMode: s.homeMode === "markdown" ? "markdown" : "blog",
  navFolder: s.navFolder || "pages",
};

export const homeMarkdown: string = homeMarkdownRaw;
