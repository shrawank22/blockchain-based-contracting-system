import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage = "";

  loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]],
    password: ["", [Validators.required]]

  })

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    // this.securityQuestion
    // this.authService.login(
    //   {
    //     email: this.email?.value,
    //     password: this.password?.value
    //   }
    // )
    //   .subscribe(success => {
    //     if (success) {
    //       this.router.navigate(['/dashboard']);
    //     } else {
    //       this.errorMessage = "Incorrect Email/Password entered.";
    //     }
    //   });
  }
}
