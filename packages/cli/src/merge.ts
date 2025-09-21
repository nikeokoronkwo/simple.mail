import { extname } from "node:path";
import { DataFileFormat, TemplateEngine } from "./cmd/_shared";
import { csvProcessor, jsonProcessor, yamlProcessor } from "./interfaces/data/core";
import { TemplatePlugin } from "./interfaces/templates/base";
import { handlebarsTemplate } from "./interfaces/templates/core";


export async function createMerge(template: string, data: string, options: {
    engine: TemplateEngine,
    dataFormat: DataFileFormat,
    filename: string
}) {
    // parse data file
    let dataResult: Record<string, string>[];

    switch (options.dataFormat) {
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
            throw new Error("Unsupported Data File Format")
    }

    let converter: TemplatePlugin

    switch (options.engine) {
        case "handlebars":
            converter = handlebarsTemplate;
            break;
        case "other":
            throw new Error("Unsupported Data File Format")
    }

    const currentExtension = extname(options.filename);
    const newFileName = options.filename.replace(currentExtension, '');
    const newExtension = newFileName.split('.').slice(1).join('.')

    const results: {
        result: string;
        index: string;
    }[] = [];
    for (const [index, entry] of Object.entries(dataResult)) {
        const values = Object.values(entry);
        results.push({
            result: await converter.convert(template, entry),
            index: values.length === 0 ? index : `${values[0]}.${newExtension}`
        });
    }
    return results;
}