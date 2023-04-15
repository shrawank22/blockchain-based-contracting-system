import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TenderService } from '../services/tender.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common'

@Component({
  selector: 'app-tender-detail',
  templateUrl: './tender-detail.component.html',
  styleUrls: ['./tender-detail.component.scss']
})
export class TenderDetailComponent implements OnInit{

  partyAddress : any;
  public tenderId: string;
  href : string = "";
  isEdit : boolean = false;

  constructor(private route: ActivatedRoute, private  tenderService: TenderService, private fb: FormBuilder, private router: Router) {
  } 

  tenderForm = this.fb.group({
    title: ["", [Validators.required, Validators.minLength(3)]],
    description: ["", [Validators.required, Validators.minLength(1)]],
    deadline:[ "", [Validators.required, Validators.minLength(1)]],
    totalMilestones: [0, [Validators.required, Validators.minLength(1)]],
    budget: [0, [Validators.required, Validators.minLength(1)]],
  })

  get title() {
    return this.tenderForm.get('title');
  }

  get description() {
    return this.tenderForm.get('description');
  }

  get deadline() {
    return this.tenderForm.get('deadline');
  }

  get totalMilestones() {
    return this.tenderForm.get('totalMilestones');
  }

  get budget() {
    return this.tenderForm.get('budget');
  }

  ngOnInit(): void {
    this.href = this.router.url;
    this.isEdit = this.href.split("/").pop() === "edit" ? true : false;
    if(!this.isEdit)
      this.tenderForm.disable();
    this.partyAddress = localStorage.getItem("WALLETID");
    this.route.params.subscribe(parameter => {
      this.tenderId = parameter['id'];   
    });

    this.tenderService.getTenderDetails(this.partyAddress, this.tenderId).subscribe((tender) => {
        this.tenderForm.setValue({
          title: tender.Title,
          description: tender.Description,
          deadline: formatDate(tender.Deadline,'yyyy-MM-dd','en'),
          totalMilestones: tender.Milestones,
          budget: tender.Budget,
        });
    });
  }

  onCancel() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([`tenders`])
    );
  }

  onSubmit() {
    this.tenderService.updateTender(this.tenderForm.value, this.tenderId)
      .subscribe(success => {
        if (success) {
          Swal.fire({
            icon: 'success',
            titleText: 'Tender updated successfully',
            html: `<a type="button" style="
            margin-top: 10%;
            border: none;
            border-radius: 1.5rem;
            padding: 7px;
            background: #11101D;
            color: #fff;
            text-decoration: none;
            font-weight: 600;
            width: 150px;
            cursor: pointer;" href="/tenders">Tenders</a> `,
            showConfirmButton: false,
            showCloseButton: true
          })
        }
      });
  }

}
