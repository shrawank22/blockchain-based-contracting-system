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
    ];

  tableData: Array<Tender> = [
    { Status: 1, Title: 'Hydrogen', Budget: 1.0079, Description: 'H', Milestones: 10, Deadline: '4/11/2023' },
    { Status: 2, Title: 'Helium', Budget: 4.0026, Description: 'He', Milestones: 10, Deadline: '4/11/2023' },
    { Status: 3, Title: 'Lithium', Budget: 6.941, Description: 'Li', Milestones: 10, Deadline: '4/11/2023' },
    { Status: 4, Title: 'Beryllium', Budget: 9.0122, Description: 'Be', Milestones: 10, Deadline: '4/11/2023' },
    { Status: 5, Title: 'Boron', Budget: 10.811, Description: 'B', Milestones: 10, Deadline: '4/11/2023' },
    { Status: 6, Title: 'Carbon', Budget: 12.0107, Description: 'C', Milestones: 10, Deadline: '4/11/2023' },
    { Status: 7, Title: 'Nitrogen', Budget: 14.0067, Description: 'N', Milestones: 10, Deadline: '4/11/2023' },
    { Status: 8, Title: 'Oxygen', Budget: 15.9994, Description: 'O', Milestones: 10, Deadline: '4/11/2023' },
    { Status: 9, Title: 'Fluorine', Budget: 18.9984, Description: 'F', Milestones: 10, Deadline: '4/11/2023' },
    { Status: 10, Title: 'Neon', Budget: 20.1797, Description: 'Ne', Milestones: 10, Deadline: '4/11/2023' },
  ];

}
