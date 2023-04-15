import { Component, OnInit } from "@angular/core";
import { Column } from "../custom-table/columns";
import { Tender } from "src/models";
import { TenderService } from "../services/tender.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  partyAddress: any;
  tenders: Tender[];
  ngOnInit(): void {
    this.partyAddress = localStorage.getItem("WALLETID");
    this.tenderService
      .getTendersToValidate(this.partyAddress)
      .subscribe((tenders) => {
        this.tenders = tenders.response;
      });
  }

  constructor(private tenderService: TenderService, private router: Router) {}

  tableColumns: Array<Column> = [
    {
      columnDef: "Title",
      header: "Title",
      cell: (element: Record<string, any>) => `${element["Title"]}`,
    },
    {
      columnDef: "Description",
      header: "Description",
      cell: (element: Record<string, any>) => `${element["Description"]}`,
    },
    {
      columnDef: "Budget",
      header: "Budget",
      cell: (element: Record<string, any>) => `${element["Budget"]}`,
    },
    {
      columnDef: "Status",
      header: "Status",
      cell: (element: Record<string, any>) => `${element["Status"]}`,
    },
    {
      columnDef: "Deadline",
      header: "Deadline",
      cell: (element: Record<string, any>) => `${element["Deadline"]}`,
    },
    {
      columnDef: "Milestones",
      header: "Milestones",
      cell: (element: Record<string, any>) => `${element["Milestones"]}`,
    },
    {
      columnDef: "Actions",
      header: "Actions",
      cell: (element: Record<string, any>) => `${element["Actions"]}`,
      isActionsEnabled: true,
      tenderId: (element: Record<string, any>) => `${element["Id"]}`,
      isViewBids: true,
      isValidateTender: true,
    },
  ];
}
