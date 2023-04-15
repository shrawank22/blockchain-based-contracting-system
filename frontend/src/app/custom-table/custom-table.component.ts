import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from './columns';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TenderService } from '../services/tender.service';
import { BidService } from '../services/bid.service';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],

})
export class CustomTableComponent<T> {
  @Input()
  tableColumns: Array<Column> = [];

  @Input()
  tableData: Array<T> = [];

  @Input() page: any;

  displayedColumns: Array<string> = [];
  dataSource: MatTableDataSource<T> = new MatTableDataSource();

  constructor(private router: Router,  private tenderService: TenderService, private bidService: BidService) { }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  redirectTo(id: any) {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate([`my-bids/tender-detail/${id}`]));
  }

  onDelete(tenderId: any, bidId: any = null) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.page === "tenders"){
          this.tenderService
          .deleteTender(tenderId)
          .subscribe((tenders) => {
            Swal.fire("Deleted!", "Your tender has been deleted.", "success");
          });
        }
        else if(this.page === "bids"){
          this.bidService
          .deleteBid(tenderId, bidId)
          .subscribe((bid) => {
            Swal.fire("Deleted!", "Your bid has been deleted.", "success");
          })
        }
      }
    });
  }
  
  viewTender(tenderId: any) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([`my-bids/tender-detail/${tenderId}/view`])
    );
  }

  viewTenderBids(tenderId:any) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([`tenders/${tenderId}/bids`])
    );
  }

  placeBid(tenderId: any) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([`active-tenders/${tenderId}/bid/add`])
    );
  }

  onEditTender(tenderId: any, bidId: any = null) {
    if(this.page === 'tenders'){
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
          this.router.navigate([`tender-detail/${tenderId}/edit`])
      );
    } 
    else if(this.page === 'bids'){
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
        this.router.navigate([`active-tenders/${tenderId}/bid/${bidId}/edit`])
      );
    }
  }
}
