import { ColumnModel } from '../Models';
import { DataGridStorage } from './DataGridStorage';
export declare class LocalStorage implements DataGridStorage {
    private name?;
    constructor(name?: string);
    setGridName(name: string): void;
    setTextSearch(textSearch: string): void;
    setPage(page: number): void;
    setColumns(columns: ColumnModel[]): void;
    getTextSearch(): string;
    getPage(): number;
    getColumns(): ColumnModel[];
}
