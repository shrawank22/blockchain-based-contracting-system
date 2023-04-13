import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { config } from '../config';
import { Observable, catchError, mapTo, throwError } from 'rxjs';
import { Tender, TenderResponse } from 'src/models';

@Injectable({
  providedIn: 'root'
})
export class TenderService {
  data: any

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      if (error.status === 400) {
        if (error.error.hasOwnProperty('message')) {
          Swal.fire({
            icon: 'error',
            titleText: 'Party already exists please login',
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

  createTender(tender: any): Observable<any> {
    this.data = {
      "title": tender.title,
      "description": tender.description,
      "budget": tender.budget,
      "issuerAddress": tender.issuerAddress,
      "deadline": tender.deadline,
      "totalMilestones": tender.totalMilestones,
    }
    return this.http.post<any>(`${config.apiUrl}/tenders`, this.data)
      .pipe(
        catchError(this.handleError))
  }

  getMyTenders(address: string):  Observable<TenderResponse>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("address",address);
    return this.http.get<TenderResponse>(`${config.apiUrl}/tenders`, {params:queryParams})
      .pipe(
        catchError(this.handleError)
      )
  }

  getActiveTenders(address: string):  Observable<TenderResponse>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("address",address);
    return this.http.get<TenderResponse>(`${config.apiUrl}/tenders`, {params:queryParams})
      .pipe(
        catchError(this.handleError)
      )
  }

}
