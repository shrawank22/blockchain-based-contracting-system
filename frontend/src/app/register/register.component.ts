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
    factoryDetails: ["", [Validators.required, Validators.minLength(3)]],
    factoryLocation: ["", [Validators.required, Validators.minLength(3)]],
    industryType: ["", [Validators.required, Validators.minLength(3)]],
    employeeId: ["", [Validators.required, Validators.minLength(1), Validators.pattern('[0-9]+')]],
    contact: ["", [Validators.required, Validators.minLength(8), Validators.pattern('[- +()0-9]+')]],
    email: ["", [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]],
    password: ["", [Validators.required,
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
    confirmPassword: ["", [Validators.required,
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
    securityQuestion: ["1", [Validators.required]],
    securityAnswer: ["", [Validators.required]]

  }, {
    validators: this.customvalidator.passwordMatchValidator("password", "confirmPassword")
  })

  constructor(private fb: FormBuilder, private customvalidator: CustomValidationService, private router: Router, private registerService: RegisterService) {

  }

  ngOnInit(): void {

  }

  get factoryDetails() {
    return this.registerForm.get('factoryDetails');
  }

  get factoryLocation() {
    return this.registerForm.get('factoryLocation');
  }
  get industryType() {
    return this.registerForm.get('industryType');
  }

  get employeeId() {
    return this.registerForm.get('employeeId');
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
  } get securityQuestion() {
    return this.registerForm.get('securityQuestion');
  }
  get securityAnswer() {
    return this.registerForm.get('securityAnswer');
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

}