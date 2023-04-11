export interface Column {
    columnDef: string;
    header: string;
    cell: Function;
    isLink?: boolean;
    url?: string;
  }