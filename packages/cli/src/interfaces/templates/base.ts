export interface TemplatePlugin<T = any> {
  convert(raw: string, data: Record<string, string>, options?: T): string | Promise<string>;
}

export function defineTemplatePlugin(plugin: TemplatePlugin): TemplatePlugin {
  return plugin;
}