import * as React from 'react';
import { ColumnModel } from 'tubular-common';
export interface TbListItemProps {
    selectedIndex: number;
    onItemClick(row: any): void;
    row: {};
    rowStyle: any;
    columns: ColumnModel[];
}
export declare const TbListItem: React.FunctionComponent<TbListItemProps>;
