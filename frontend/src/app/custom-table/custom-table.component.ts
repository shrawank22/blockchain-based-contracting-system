import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from './columns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent<T> {
  @Input()
  tableColumns: Array<Column> = [];

  @Input()
  tableData: Array<T> = [];

  displayedColumns: Array<string> = [];
  dataSource: MatTableDataSource<T> = new MatTableDataSource();

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  ngOnChanges(): void {
        this.dataSource = new MatTableDataSource(this.tableData);
  }

  viewTender(tenderId: any) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([`my-bids/tender-detail/${tenderId}`])
    );
  }

  viewTenderBids(tenderId:any) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([`tenders/${tenderId}/bids-details`])
    );
  }

  placeBid(tenderId: any) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([`active-tenders/${tenderId}/add`])
    );
  }
}
