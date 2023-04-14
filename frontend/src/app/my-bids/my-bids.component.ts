import { Component } from '@angular/core';
import { Column } from '../custom-table/columns';
import { Bid } from 'src/models';

@Component({
  selector: 'app-my-bids',
  templateUrl: './my-bids.component.html',
  styleUrls: ['./my-bids.component.scss']
})
export class MyBidsComponent {
  tableColumns: Array<Column> =
    [{ columnDef: 'Bid Clause', header: 'BidClause', cell: (element: Record<string, any>) => `${element['BidClause']}` },
    { columnDef: 'Quote Amount', header: 'QuoteAmount', cell: (element: Record<string, any>) => `${element['QuoteAmount']}` },
    { columnDef: 'Bid Status', header: 'Status', cell: (element: Record<string, any>) => `${element['Status']}` },
    { columnDef: 'Actions', header: 'Actions', cell: (element: Record<string, any>) => `${element['Actions']}`, isActionsEnabled: true, id: (element: Record<string, any>) => `${element['Id']}`, isDeleteEnabled: true, isEditEnabled: true, isViewTender: true}
    ];

  tableData: Array<Bid> = [
    { Status: "PENDING", "QuoteAmount": 23400, BidClause:"my bid" },
    { Status: "PENDING", "QuoteAmount": 23400, BidClause:"my bid" },
  ];
  
}
