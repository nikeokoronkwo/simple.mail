import { Argument, Command, Option } from "commander";
import { templateEngineKinds, transformMergeFile } from "./_shared";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createMerge } from "../merge";
import { join } from "node:path";
import { cwd } from "node:process";

/**
 * @todo Add support for custom template engines
 * @todo Add support for custom template data files
 * @todo stdin support
 */
export default new Command("merge")
  .alias("mail-merge")
  .summary("Perform a mail-merge on a given template with the given data file")
  .description(
    "The given command performs a mail-merge on a given template given a data file. The generated files are output to a given directory",
  )
  .addArgument(
    new Argument(
      "<template>",
      "The template file to perform merge on",
    ).argRequired(),
  )
  .addOption(
    new Option(
      "--template-engine <engine>",
      "Template format for the body of the email in order to perform mail merge.",
    )
      .choices(templateEngineKinds)
      .default("handlebars"),
  )
  .addOption(
    new Option("--output -o <dir>", "The output directory to write to").default(
      cwd(),
    ),
  )
  .addOption(
    new Option(
      "--data -d <file>",
      "The data file to populate the template with",
    )
      .argParser(transformMergeFile)
      .makeOptionMandatory(),
  )
  .action(async (template, options, command) => {
    const {
      templateEngine: engine,
      data: { file: dataFile, format: dataFormat },
      output,
    } = options;

    const results = await createMerge(
      await readFile(template, { encoding: "utf8" }),
      await readFile(dataFile, { encoding: "utf8" }),
      {
        engine,
        dataFormat,
        filename: template,
      },
    );

    await mkdir(output, { recursive: true });

    for (const { result: contents, index: name } of results) {
      await writeFile(join(output, name), contents);
    }
  });
