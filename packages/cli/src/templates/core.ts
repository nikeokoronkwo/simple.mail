import { defineTemplatePlugin } from "./base";

export const handlebarsTemplate = defineTemplatePlugin({
  /** @todo any more options? */
  async convert(raw, options) {
    const { compile } = await import('handlebars');
    const templ = compile(raw);
    return templ(options);
  },
})