import { Component } from '@angular/core';
import { Tender } from 'src/models';

@Component({
  selector: 'app-tender-detail',
  templateUrl: './tender-detail.component.html',
  styleUrls: ['./tender-detail.component.scss']
})
export class TenderDetailComponent {

  tender: Tender;

}
