import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { of, Observable, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { config } from '../config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  data: any
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      if (error.status === 400) {
        if (error.error.hasOwnProperty('email')) {
          Swal.fire({
            icon: 'error',
            titleText: 'User already exists please login',
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
        if (error.error.hasOwnProperty('non_field_errors')) {
          Swal.fire({
            icon: 'error',
            titleText: 'factory name and employee id already exists please login',
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
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! try again',
          showCloseButton: true
        })
      }
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
  constructor(private http: HttpClient) { }

  register(user: any): Observable<boolean> {
    this.data = {
      "email": user.email,
      "password": user.password,
      "factory_name": user.factoryDetails,
      "employee_id": user.employeeId,
      "factory_location": user.factoryLocation,
      "industry_type": user.industryType,
      "phone_number": user.contact,
      "security_question": user.securityQuestion,
      "answer": user.securityAnswer
    }
    return this.http.post<any>(`${config.apiUrl}/user/register/`, this.data)
      .pipe(
        mapTo(true),
        catchError(this.handleError))
  }

}