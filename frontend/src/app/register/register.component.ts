import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from '../services/custom-validation.service';
import { RegisterService } from '../services/register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm = this.fb.group({
    userDetails: ["", [Validators.required, Validators.minLength(3)]],
    walletId: ["", [Validators.required, Validators.minLength(1)]],
    contact: ["", [Validators.required, Validators.minLength(8), Validators.pattern('[- +()0-9]+')]],
    email: ["", [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]],
    password: ["", [Validators.required,
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
    confirmPassword: ["", [Validators.required,
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
  }, {
    validators: this.customvalidator.passwordMatchValidator("password", "confirmPassword")
  })

  web3Provider: any = null;
  address: string = "";
  constructor(private fb: FormBuilder, private customvalidator: CustomValidationService,
    private router: Router, private registerService: RegisterService) {

  }

  ngOnInit(): void {

  }

  get userDetails() {
    return this.registerForm.get('userDetails');
  }

  get walletId() {
    return this.registerForm.get('walletId');
  }
  get contact() {
    return this.registerForm.get('contact');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  } 

  onSubmit() {
    this.registerService.register(this.registerForm.value)
      .subscribe(success => {
        if (success) {
          Swal.fire({
            icon: 'success',
            titleText: 'User registered Successfully',
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
            cursor: pointer;" href="/login">Login</a> `,
            showConfirmButton: false,
            showCloseButton: true
          })
        }
      });
  }
  loginPage() {
    this.router.navigateByUrl('/login');
  }

  getAddress() {
    let ethereum = (window as { [key: string]: any })['ethereum'];
    if (typeof ethereum !== 'undefined') {
      this.address = "";
    }
    if (ethereum) {
      this.web3Provider = ethereum;
      try {
        // Request account access
        ethereum.request({ method: 'eth_requestAccounts' }).then((address: any) => {
          this.address = address[0];
          this.registerForm.controls['walletId'].setValue(this.address);
        });
      } catch (error) {
        // User denied account access...
        this.address = "";
        this.registerForm.controls['walletId'].setValue(this.address);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'User denied account access '
        });
        console.error("User denied account access");
      }
    }
  }
}
