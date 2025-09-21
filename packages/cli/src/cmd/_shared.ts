import { extname } from "node:path";

export const templateEngineKinds = ["handlebars", 'other'] as const;
export type TemplateEngine = typeof templateEngineKinds[number];
export const dataFileFormats = ["csv", "json", "yaml", "other"] as const;
export type DataFileFormat = (typeof dataFileFormats)[number];


export function transformMergeFile(file: string): {
  file: string;
  format: DataFileFormat;
} {
  switch (extname(file)) {
    case ".csv":
      return {
        file,
        format: "csv",
      };
    case ".json":
      return {
        file,
        format: "json",
      };
    case ".yaml":
    case ".yml":
      return {
        file,
        format: "yaml",
      };
    default:
      return {
        file,
        format: "other",
      };
  }
}
