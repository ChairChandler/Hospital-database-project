import * as React from 'react';
import { ColumnModel } from 'tubular-common';
import DetailComponent from '../DataGridInterfaces/DetailComponent';
export interface MasterDetailRowProps {
    detail: React.ReactElement<DetailComponent>;
    renderCells: any;
    style: React.CSSProperties;
    clickEvent: (ev: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void;
    rowData: {};
    columns: ColumnModel[];
}
export declare const MasterDetailRow: React.FunctionComponent<MasterDetailRowProps>;
export default MasterDetailRow;
