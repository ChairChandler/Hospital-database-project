import * as React from 'react';
export interface AdvancePaginationActionsProps {
    count: number;
    isAdvanced: boolean;
    isLoading: boolean;
    page: number;
    rowsPerPage: number;
    onChangePage(event: React.MouseEvent<HTMLElement>, page: number): void;
}
export declare const AdvancePaginationActions: React.FunctionComponent<AdvancePaginationActionsProps>;
