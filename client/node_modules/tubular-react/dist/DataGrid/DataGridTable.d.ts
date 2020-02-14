import * as React from 'react';
import { ITbTableInstance } from 'tubular-react-common';
import { TbRowProps } from '../BareBones/TbRow';
import DetailComponent from '../DataGridInterfaces/DetailComponent';
export interface DataGridTableProps {
    tbTableInstance: ITbTableInstance;
    rowComponent: React.FunctionComponent<TbRowProps>;
    footerComponent: React.FunctionComponent<any>;
    detailComponent?: React.ReactElement<DetailComponent>;
    onRowClick?(row: {}): void;
}
export declare const DataGridTable: React.FunctionComponent<DataGridTableProps>;
