import * as React from 'react';
import { ITbTableInstance } from 'tubular-react-common';
import DetailComponent from '../DataGridInterfaces/DetailComponent';
export interface GridHeaderProps {
    tbTableInstance: ITbTableInstance;
    detailComponent?: React.ReactElement<DetailComponent>;
}
export declare const GridHeader: React.FunctionComponent<GridHeaderProps>;
