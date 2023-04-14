import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tender } from 'src/models';
import { TenderService } from '../services/tender.service';

@Component({
  selector: 'app-tender-detail',
  templateUrl: './tender-detail.component.html',
  styleUrls: ['./tender-detail.component.scss']
})
export class TenderDetailComponent implements OnInit{

  tender: Tender; 
  partyAddress : any;
  public tenderId: string;

  constructor(private route: ActivatedRoute, private  tenderService: TenderService) {
  } 

  ngOnInit(): void {
    this.partyAddress = localStorage.getItem("WALLETID");
    this.route.params.subscribe(parameter => {
      this.tenderId = parameter['id'];   
    });
    this.tenderService.getTenderDetails(this.partyAddress, this.tenderId).subscribe((tender) => {
        this.tender = tender;
    });
  }

}
