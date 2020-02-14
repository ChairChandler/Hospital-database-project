import * as React from 'react';
import { ITbListInstance } from 'tubular-react-common';
export interface TbListProps {
    tbInstance: ITbListInstance;
    listItemComponent?: React.FunctionComponent<any>;
    onItemClick?(row: {}): void;
}
export declare const TbList: React.FunctionComponent<TbListProps>;
