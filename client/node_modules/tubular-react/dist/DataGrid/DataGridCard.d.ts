/// <reference types="react" />
import { ColumnModel } from 'tubular-common';
export interface DataGridCardProps {
    columns: ColumnModel[];
    item: {};
    onClickCallback: (row: any) => void;
}
export declare const DataGridCard: ({ columns, item, onClickCallback }: DataGridCardProps) => JSX.Element;
