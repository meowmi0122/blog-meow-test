import homeSettingsRaw from "../../public/settings.json";
import homeMarkdownRaw from "../../public/index.md?raw";

export type HomeMode = "blog" | "markdown";

export interface HomeSettings {
  homeMode: HomeMode;
  navFolder: string;
  siteName: string;
  brandName: string;
}

const s = homeSettingsRaw as Partial<HomeSettings> & Record<string, unknown>;

export const homeSettings: HomeSettings = {
  homeMode: s.homeMode === "markdown" ? "markdown" : "blog",
  navFolder: s.navFolder || "pages",
  siteName: (s.siteName as string) || "Blog Meow",
  brandName: (s.brandName as string) || "Blog Meow",
};

export const homeMarkdown: string = homeMarkdownRaw;
