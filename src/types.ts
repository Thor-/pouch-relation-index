
export type Order = { field: string, dir?: 'asc' | 'desc' };
export type Field = { name: string, type?: string, index?: boolean, unique?: boolean };
export type IndexInfo = { name: string, doc_type: string, fields: Field[] }
