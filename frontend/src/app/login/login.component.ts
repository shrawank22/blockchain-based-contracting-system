import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage = "";
  address: string = "";
  web3Provider: any = null;

  loginForm = this.fb.group({
    walletId: ["", [Validators.required, Validators.minLength(1)]],
    password: ["", [Validators.required]]

  })

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  get walletId() {
    return this.loginForm.get('walletId');
  }

  get password() {
    return this.loginForm.get('password');
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
          this.loginForm.controls['walletId'].setValue(this.address);
        });
      } catch (error) {
        // User denied account access...
        this.address = "";
        this.loginForm.controls['walletId'].setValue(this.address);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'User denied account access '
        });
        console.error("User denied account access");
      }
    }
  }

  onSubmit() {
    this.authService.login(
      {
        walletId: this.walletId?.value,
        password: this.password?.value
      }
    )
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = "Incorrect Email/Password entered.";
        }
      });
  }
}
