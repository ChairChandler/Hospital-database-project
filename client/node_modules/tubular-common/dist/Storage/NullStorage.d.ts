import { ColumnModel } from '../Models';
import { DataGridStorage } from './DataGridStorage';
export declare class NullStorage implements DataGridStorage {
    setTextSearch(textSearch: string): void;
    setPage(page: number): void;
    setColumns(columns: ColumnModel[]): void;
    getTextSearch(): string;
    getPage(): number;
    getColumns(): ColumnModel[];
}
