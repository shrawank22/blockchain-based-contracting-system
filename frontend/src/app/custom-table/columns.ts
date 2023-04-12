export interface Column {
    columnDef: string;
    header: string;
    cell: Function;
    isActionsEnabled?: boolean;
    isViewBids?: boolean;
  }