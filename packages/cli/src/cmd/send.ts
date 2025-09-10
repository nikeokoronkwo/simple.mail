import { Command, Option } from "commander";
import { extname } from "node:path";

const formats = ["markdown", "html", "text"] as const;
const templateEngineKinds = ["handlebars"] as const;
const dataFileFormats = ["csv", "json", "yaml", "other"] as const;
type DataFileFormat = (typeof dataFileFormats)[number];
type BodyFormat = (typeof formats)[number];

function transformMergeFile(file: string): {
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

/**
 * @todo Add support for custom file formats
 * @todo Add support for custom merge template formats
 * @todo Launch app TUI if body is not given
 */
export default new Command("send")
  .description("Send an email!")
  .addOption(new Option("--launch -l", "Launches the TUI").hideHelp())
  .optionsGroup("Basic Email Options")
  .requiredOption("--to -t <recipients...>", "The email recipients")
  .option("--cc <recipients...>", "Email CC recipients")
  .option("--bcc <recipients...>", "Email BCC recipients")
  .option("--subject -s <subject>", "The subject of the email")
  .option(
    "--body -b <file>",
    "The file containing the contents of the email. Inferred as markdown by default unless specified",
  )
  .optionsGroup("More Email Features")
  .option(
    "--merge <file>",
    "Perform mail-merge by using the given data file to merge into templates in the body. Supports CSV, JSON, YAML",
    transformMergeFile,
  )
  .addOption(
    new Option(
      "--merge-template-engine <engine>",
      "Template format for the body of the email in order to perform mail merge.",
    )
      .choices(templateEngineKinds)
      .default("handlebars"),
  )
  .optionsGroup("Email Configurations")
  .addOption(
    new Option("--format", "The file format to be used for sending the email")
      .choices(formats)
      .default("markdown", "Markdown Format"),
  )
  .option(
    "--stylesheet",
    "The CSS/SCSS/SASS Stylesheet to use to style the document, where possible",
  )
  .addOption(new Option("--smtp-host <host>").env("SMTP_HOST").hideHelp())
  .addOption(new Option("--smtp-port <port>").env("SMTP_PORT").hideHelp())
  .addOption(new Option("--smtp-user <email>").env("SMTP_USER").hideHelp())
  .addOption(new Option("--smtp-pass <password>").env("SMTP_PASS").hideHelp())
  .action((options, command) => {
    console.log(options);
  });
