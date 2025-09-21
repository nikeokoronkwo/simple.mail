export interface Converter {
  base: 'text' | 'html';
  /**
   * The content type of the source, which can be used
   * for rendering alternative displays of mail text
   */
  contentType?: string;
  convert(raw: string): string | Promise<string>;
}

export function defineConverter(conv: Converter): Converter { return conv; }