import { Component } from '@angular/core';
import { Column } from '../custom-table/columns';
import { Tender } from 'src/models';


@Component({
  selector: 'app-active-tenders',
  templateUrl: './active-tenders.component.html',
  styleUrls: ['./active-tenders.component.scss']
})
export class ActiveTendersComponent {

  tableColumns: Array<Column> =
    [{ columnDef: 'Title', header: 'Title', cell: (element: Record<string, any>) => `${element['Title']}` },
    { columnDef: 'Description', header: 'Description', cell: (element: Record<string, any>) => `${element['Description']}` },
    { columnDef: 'Budget', header: 'Budget', cell: (element: Record<string, any>) => `${element['Budget']}` },
    { columnDef: 'Status', header: 'Status', cell: (element: Record<string, any>) => `${element['Status']}` },
    { columnDef: 'Deadline', header: 'Deadline', cell: (element: Record<string, any>) => `${element['Deadline']}` },
    { columnDef: 'Milestones', header: 'Milestones', cell: (element: Record<string, any>) => `${element['Milestones']}` },
    { columnDef: 'Actions', header: 'Actions', cell: (element: Record<string, any>) => `${element['Actions']}`, isActionsEnabled: true, isAddBid: true},
    ];

  tableData: Array<Tender> = [
    { Status: "ONGOING", Title: 'Hydrogen', Budget: 1.0079, Description: 'H', Milestones: 10, Deadline: '4/11/2023' },
    { Status: "ONGOING", Title: 'Helium', Budget: 4.0026, Description: 'He', Milestones: 10, Deadline: '4/11/2023' },
    { Status: "ONGOING", Title: 'Lithium', Budget: 6.941, Description: 'Li', Milestones: 10, Deadline: '4/11/2023' },
  ];

}
