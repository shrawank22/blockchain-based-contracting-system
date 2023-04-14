import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { BidService } from "../services/bid.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-bid-detail",
  templateUrl: "./bid-details.component.html",
  styleUrls: ["./bid-details.component.scss"],
})
export class BidDetailsComponent {
  tenderId: any;
  bidId: any;
  href: string = "";
  isEdit: boolean = false;
  partyAddress: any = "";

  bidForm = this.fb.group({
    clause: ["", [Validators.required, Validators.minLength(3)]],
    quoteAmount: [0, [Validators.required, Validators.minLength(1)]],
  });

  get clause() {
    return this.bidForm.get("clause");
  }

  get quoteAmount() {
    return this.bidForm.get("quoteAmount");
  }

  constructor(
    private fb: FormBuilder,
    private bidService: BidService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.href = this.router.url;
    this.isEdit = this.href.split("/").pop() === "edit" ? true : false;
    if (!this.isEdit) this.bidForm.disable();
    this.route.params.subscribe((parameter) => {
      this.tenderId = parameter["tenderId"];
      this.bidId = parameter["bidId"];
    });

    this.partyAddress = localStorage.getItem("WALLETID");

    this.bidService
      .getBidDetails(this.partyAddress, this.tenderId, this.bidId)
      .subscribe((bid) => {
        this.bidForm.setValue({
          clause: bid.BidClause,
          quoteAmount: bid.QuoteAmount,
        });
      });
  }

  onCancel() {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate([`active-tenders`]));
  }

  onSubmit() {
    this.bidService
      .updateBid(this.bidForm.value, this.bidId)
      .subscribe((success) => {
        if (success) {
          Swal.fire({
            icon: "success",
            titleText: "Bid updated successfully",
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
            showCloseButton: true,
          });
        }
      });
  }
}
