import * as React from 'react';
import { ColumnModel, DataGridStorage, TubularHttpClientAbstract } from 'tubular-common';
import { TbRowProps } from '../BareBones/TbRow';
import DetailComponet from '../DataGridInterfaces/DetailComponent';
import { ToolbarOptions } from '../Toolbar/ToolbarOptions';
export interface DataGridProps {
    columns: ColumnModel[];
    dataSource: {}[] | string | Request | TubularHttpClientAbstract;
    deps?: any[];
    detailComponent?: React.ReactElement<DetailComponet>;
    gridName: string;
    storage?: DataGridStorage;
    toolbarOptions?: ToolbarOptions;
    mobileBreakpointWidth?: number;
    rowComponent?: React.FunctionComponent<TbRowProps>;
    rowMobileComponent?: React.FunctionComponent<TbRowProps>;
    footerComponent?: React.FunctionComponent<any>;
    onError?(err: string): void;
    onRowClick?(row: {}): void;
}
export declare const DataGrid: React.FunctionComponent<DataGridProps>;
