export interface Column {
    id?: Function;
    columnDef: string;
    header: string;
    cell: Function;
    isActionsEnabled?: boolean;
    isEditEnabled?:boolean;
    isDeleteEnabled?:boolean,
    isViewBids?: boolean;
    isAddBid?: boolean;
    isViewTender?: boolean;
  }