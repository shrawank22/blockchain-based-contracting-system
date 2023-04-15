import { Component, OnInit } from '@angular/core';
import { Column } from '../custom-table/columns';
import { Tender } from 'src/models';
import { TenderService } from '../services/tender.service';
import { Router } from '@angular/router';


// https://jnpiyush.medium.com/how-to-build-reusable-table-component-in-angular-7a7ce79d2754

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit{

  partyAddress : any;
  tenders : Tender[];
  ngOnInit(): void {
    this.partyAddress = localStorage.getItem("WALLETID");
    this.tenderService.getMyTenders(this.partyAddress).subscribe((tenders) => {
        this.tenders = tenders.response;
    });
  }

  constructor(private tenderService : TenderService, private router: Router){}

  tableColumns: Array<Column> =
    [{ columnDef: 'Title', header: 'Title', cell: (element: Record<string, any>) => `${element['Title']}` },
    { columnDef: 'Description', header: 'Description', cell: (element: Record<string, any>) => `${element['Description']}` },
    { columnDef: 'Budget', header: 'Budget', cell: (element: Record<string, any>) => `${element['Budget']}` },
    { columnDef: 'Status', header: 'Status', cell: (element: Record<string, any>) => `${element['Status']}` },
    { columnDef: 'Deadline', header: 'Deadline', cell: (element: Record<string, any>) => `${element['Deadline']}` },
    { columnDef: 'Milestones', header: 'Milestones', cell: (element: Record<string, any>) => `${element['Milestones']}` },
    { columnDef: 'Actions', header: 'Actions', cell: (element: Record<string, any>) => `${element['Actions']}`, isActionsEnabled: true, tenderId: (element: Record<string, any>) => `${element['Id']}`, bidId: (element: Record<string, any>) => `${element['Id']}`,  isDeleteEnabled: true, isEditEnabled: true, isViewBids: true},
    ];

  // tableData: Array<Tender> = [
  //   { Id:0, Status: "OPEN", Title: 'Hydrogen', Budget: 1.0079, Description: 'H', Milestones: 10, Deadline: '4/11/2023', },
  //   { Id:0, Status: "OPEN", Title: 'Helium', Budget: 4.0026, Description: 'He', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Lithium', Budget: 6.941, Description: 'Li', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Beryllium', Budget: 9.0122, Description: 'Be', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Boron', Budget: 10.811, Description: 'B', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Carbon', Budget: 12.0107, Description: 'C', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Nitrogen', Budget: 14.0067, Description: 'N', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Oxygen', Budget: 15.9994, Description: 'O', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Fluorine', Budget: 18.9984, Description: 'F', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Neon', Budget: 20.1797, Description: 'Ne', Milestones: 10, Deadline: '4/11/2023'},
  // ];

  addTender() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([`tenders/add`])
    );
  }

}
