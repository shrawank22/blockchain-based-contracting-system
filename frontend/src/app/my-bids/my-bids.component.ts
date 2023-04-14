import { Component } from '@angular/core';
import { Column } from '../custom-table/columns';
import { Bid } from 'src/models';
import { BidService } from '../services/bid.service';

@Component({
  selector: 'app-my-bids',
  templateUrl: './my-bids.component.html',
  styleUrls: ['./my-bids.component.scss']
})
export class MyBidsComponent {

  partyAddress : any;
  bids : Bid[];

  constructor(private bidService: BidService){
  }

  ngOnInit(): void {
    this.partyAddress = localStorage.getItem("WALLETID");
    this.bidService.getMyBids(this.partyAddress).subscribe((bids) => {
        this.bids = bids.response;
    });
  }
  tableColumns: Array<Column> =
    [{ columnDef: 'Bid Clause', header: 'BidClause', cell: (element: Record<string, any>) => `${element['BidClause']}` },
    { columnDef: 'Quote Amount', header: 'QuoteAmount', cell: (element: Record<string, any>) => `${element['QuoteAmount']}` },
    { columnDef: 'Bid Status', header: 'Status', cell: (element: Record<string, any>) => `${element['Status']}` },
    { columnDef: 'Actions', header: 'Actions', cell: (element: Record<string, any>) => `${element['Actions']}`, 
        isActionsEnabled: true, 
        tenderId: (element: Record<string, any>) => `${element['TenderId']}`, 
        bidId: (element: Record<string, any>) => `${element['BidId']}`,
        isDeleteEnabled: true, 
        isEditEnabled: true, 
        isViewTender: true}
    ];

  // tableData: Array<Bid> = [
  //   { Status: "PENDING", "QuoteAmount": 23400, BidClause:"my bid" , BidId: 1, TenderId: 3 },
  //   { Status: "PENDING", "QuoteAmount": 23400, BidClause:"my bid" , BidId: 1, TenderId: 7 },
  // ];
  
}
