import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tender } from 'src/models';

@Component({
  selector: 'app-tender-detail',
  templateUrl: './tender-detail.component.html',
  styleUrls: ['./tender-detail.component.scss']
})
export class TenderDetailComponent implements OnInit{

  tender: Tender; 

  public tenderId: string;

  constructor(route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.tenderId = params["id"];
      console.log(this.tenderId);
    });
  }

  ngOnInit(): void {
    // call get tenders api here using tenderId
    this.tender = {
      Title: "new",
      Description: "d",
      Budget: 12,
      Status: "s",
      Milestones: 1,
      Deadline: "sdsd",
      Id: 1,
    }
  }

}
