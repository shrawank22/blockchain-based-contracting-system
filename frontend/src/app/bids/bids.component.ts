import { Component } from '@angular/core';
import { Bid } from 'src/models';
import { Column } from '../custom-table/columns';
import { BidService } from '../services/bid.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bids',
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.scss']
})
export class BidsComponent {

  partyAddress : any;
  tenderId: any;
  bids : Bid[];

  constructor(private bidService: BidService, private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.partyAddress = localStorage.getItem("WALLETID");
    this.route.params.subscribe(parameter => {
      this.tenderId = parameter['id'];   
    });
    this.bidService.getTenderBids(this.partyAddress, this.tenderId).subscribe((bids) => {
        this.bids = bids.response;
    });
  }

  tableColumns: Array<Column> =
    [{ columnDef: 'Bid Clause', header: 'BidClause', cell: (element: Record<string, any>) => `${element['BidClause']}` },
    { columnDef: 'Quote Amount', header: 'QuoteAmount', cell: (element: Record<string, any>) => `${element['QuoteAmount']}` },
    { columnDef: 'Bid Status', header: 'Status', cell: (element: Record<string, any>) => `${element['Status']}` },
    ];

  // tableData: Array<Bid> = [
  //   { Status: "PENDING", "QuoteAmount": 23400, BidClause:"my bid" },
  //   { Status: "PENDING", "QuoteAmount": 23400, BidClause:"my bid" },
  // ];
  
}
