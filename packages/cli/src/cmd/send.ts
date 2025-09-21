import { Command, Option } from "commander";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { templateEngineKinds, transformMergeFile } from "./_shared";

const formats = ["markdown", "html", "text", 'other'] as const;
type BodyFormat = (typeof formats)[number];

/**
 * @todo Add support for custom file formats
 * @todo Add support for custom merge template formats
 * @todo Launch app TUI if body is not given
 * @todo Add support for Reply-To
 * @todo Image embed
 * @todo Stream emails as EML/access via EML
 * @todo Questionnaire if `from` is not sent
 */
export default new Command("send")
  .description("Send an email!")
  .addOption(new Option("--launch -l", "Launches the TUI").hideHelp())
  .optionsGroup("Basic Email Options")
  .addOption(new Option("--to -t <recipients...>", "The email recipients").makeOptionMandatory())
  .option("--cc <recipients...>", "Email CC recipients")
  .option("--bcc <recipients...>", "Email BCC recipients")
  .option("--subject -s <subject>", "The subject of the email")
  .option('--from -f <sender>', 'The email to send it from. If you have more than one email logged onto, then use this option to specify which one. If only one email is logged onto, then that email is selected')
  .option(
    "--body -b <file>",
    "The file containing the contents of the email. Inferred as markdown by default unless specified",
  )
  .option(
    '--attachment -a <attachments...>',
    'Attachments for the given email to send'
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
  .optionsGroup('Other Options')
  .addOption(new Option("--smtp-host <host>").env("SMTP_HOST").hideHelp())
  .addOption(new Option("--smtp-port <port>").env("SMTP_PORT").hideHelp())
  .addOption(new Option("--smtp-user <email>").env("SMTP_USER").hideHelp())
  .addOption(new Option("--smtp-pass <password>").env("SMTP_PASS").hideHelp())
  .option('--eml <eml>', 'Pass a raw EML file to send an email using the given file')
  .action(async (options, command) => {
    // get contents
    console.log(options);
    const { smtpPort, smtpHost, smtpUser, smtpPass } = options;
    
    /** @todo extract from user */
    
    const { body, to, cc, bcc, subject, format: bodyFormat, eml, merge } = options;
    
    if (eml) {
      // send eml file instead
      // return await sendEMLEmail()
    }
    
    if (!body) {
      /** @todo open dialog */
      throw new Error("Body of email must be provided")
    } else if (!existsSync(body)) {
      throw new Error(`Could not find given body file: ${body}`)
    }
    
    // transform body via template
    const bodyContents = await readFile(body, { encoding: 'utf8' })
  
  });
