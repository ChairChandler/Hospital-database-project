import * as React from 'react';
import { ColumnModel } from 'tubular-common';
export interface ExportButtonProps {
    type: string;
    gridName: string;
    filteredRecordCount: number;
    toolTip?: string;
    exportTo: (allRows: boolean, exportFunc: (payload: {}[], columns: ColumnModel[]) => void) => void;
}
export declare const ExportButton: React.FunctionComponent<ExportButtonProps>;
