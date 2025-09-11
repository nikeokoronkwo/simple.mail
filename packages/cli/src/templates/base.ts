export interface TemplatePlugin {
  convert<T = object>(raw: string, options: T): string | Promise<string>;
}

export function defineTemplatePlugin(plugin: TemplatePlugin): TemplatePlugin {
  return plugin;
}