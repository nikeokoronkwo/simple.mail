/**
 * @file merge.ts
 * @fileoverview Utility functions for performing mail merge
 */

import { extname } from "node:path";
import { DataFileFormat, TemplateEngine } from "./cmd/_shared";
import {
  csvProcessor,
  jsonProcessor,
  yamlProcessor,
} from "./interfaces/data/core";
import { TemplatePlugin } from "./interfaces/templates/base";
import { handlebarsTemplate } from "./interfaces/templates/core";

export async function extractDataForMerge(
  data: string,
  format: DataFileFormat,
) {
  let dataResult: Record<string, string>[];

  switch (format) {
    case "csv":
      dataResult = await csvProcessor(data);
      break;
    case "json":
      dataResult = await jsonProcessor(data);
      break;
    case "yaml":
      dataResult = await yamlProcessor(data);
      break;
    case "other":
      throw new Error("Unsupported Data File Format");
  }

  return dataResult;
}

export async function createMergeFromData(
  template: string,
  data: Record<string, string>[],
  options: {
    engine: TemplateEngine;
    filename: string;
  },
) {
  let converter: TemplatePlugin;

  switch (options.engine) {
    case "handlebars":
      converter = handlebarsTemplate;
      break;
    case "other":
      throw new Error("Unsupported Data File Format");
  }

  const currentExtension = extname(options.filename);
  const newFileName = options.filename.replace(currentExtension, "");
  const newExtension = newFileName.split(".").slice(1).join(".");

  const results: {
    result: string;
    index: string;
  }[] = [];
  for (const [index, entry] of Object.entries(data)) {
    const values = Object.values(entry);
    results.push({
      result: await converter.convert(template, entry),
      index: values.length === 0 ? index : `${values[0]}.${newExtension}`,
    });
  }
  return results;
}

export async function createMerge(
  template: string,
  data: string,
  options: {
    engine: TemplateEngine;
    dataFormat: DataFileFormat;
    filename: string;
  },
) {
  // parse data file
  let dataResult = await extractDataForMerge(data, options.dataFormat);

  return await createMergeFromData(template, dataResult, options);
}
