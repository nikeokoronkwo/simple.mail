export interface DataProcessor<U = unknown> {
    (raw: string, options?: U): Record<string, string>[] | Promise<Record<string, string>[]>;
}

export function defineDataProcessor(processor: DataProcessor): DataProcessor { return processor }
