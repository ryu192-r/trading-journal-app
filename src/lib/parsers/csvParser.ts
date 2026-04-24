import { parse } from 'csv-parse/sync';

export function parseCSV(content: string): Record<string, string>[] {
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  return records;
}
