import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BidService } from '../services/bid.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bid-add',
  templateUrl: './bid-add.component.html',
  styleUrls: ['./bid-add.component.scss']
})
export class BidAddComponent {
  tenderId: any; 

  bidForm = this.fb.group({
    clause: ["", [Validators.required, Validators.minLength(3)]],
    quoteAmount: ["", [Validators.required, Validators.minLength(1)]],
  })

  get clause() {
    return this.bidForm.get('clause');
  }

  get quoteAmount() {
    return this.bidForm.get('quoteAmount');
  }

  constructor(private fb: FormBuilder, private bidService: BidService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(parameter => {
      this.tenderId = parameter['id'];   
    });
  }

  onCancel() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([`active-tenders`])
    );
  }

  onSubmit() {
    this.bidService.createBid(this.bidForm.value, this.tenderId)
      .subscribe(success => {
        if (success) {
          Swal.fire({
            icon: 'success',
            titleText: 'Bid created successfully',
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
            cursor: pointer; `,
            showConfirmButton: false,
            showCloseButton: true
          })
        }
      });
  }

}
