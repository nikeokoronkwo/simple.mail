import { defineDataProcessor } from "./base";

export const csvProcessor = defineDataProcessor(
    async (raw, _opts) => {
        const { parse } = await import("@std/csv/parse")
        return parse(raw, { skipFirstRow: true })
    }
)

export const jsonProcessor = defineDataProcessor(
    async (raw, _opts) => {
        // use native json parser
        return JSON.parse(raw)
    }
)

export const yamlProcessor = defineDataProcessor(
    async (raw, _opts) => {
        const { parse } = await import("@std/yaml/parse")
        return parse(raw) as Record<string, string>[];
    }
)

