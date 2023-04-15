import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { config } from '../config';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Bid, BidResponse } from 'src/models';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  data: any;

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      if (error.status === 400) {
        if (error.error.hasOwnProperty('message')) {
          Swal.fire({
            icon: 'error',
            titleText: error.error.message,
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

  createBid(bid: any, tenderId: any): Observable<any> {
    this.data = {
      "tenderId": tenderId,
      "clause": bid.clause,
      "quoteAmount": bid.quoteAmount,
      "bidderAddress": localStorage.getItem("WALLETID"),
    }
    return this.http.post<any>(`${config.apiUrl}/active-tenders/add-bid`, this.data)
      .pipe(
        catchError(this.handleError))
  }

  updateBid(bid: any, bidId: any): Observable<any> {
    this.data = {
      "bidId": bidId,
      "clause": bid.clause,
      "quoteAmount": bid.quoteAmount,
      "bidderAddress": localStorage.getItem("WALLETID"),
    }
    return this.http.post<any>(`${config.apiUrl}/my-bids/edit-bid`, this.data)
      .pipe(
        catchError(this.handleError))

  }

  getMyBids(address: string): Observable<BidResponse>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("address",address);
    return this.http.get<BidResponse>(`${config.apiUrl}/my-bids`, {params:queryParams})
      .pipe(
        catchError(this.handleError)
      )
  }

  getBidDetails(address: string, tenderId: string, bidId: string): Observable<Bid>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("address",address);
    queryParams = queryParams.append("tenderId",tenderId);
    queryParams = queryParams.append("bidId",bidId);
    return this.http.get<any>(`${config.apiUrl}/tenders/bid-details`, {params:queryParams})
      .pipe(
        map(x => x.response),
        catchError(this.handleError)
      )
  }

  getTenderBids(address: string, tenderId: string):  Observable<BidResponse>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("address",address);
    queryParams = queryParams.append("tenderId",tenderId);
    return this.http.get<BidResponse>(`${config.apiUrl}/tenders/bids`, {params:queryParams})
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteBid(tenderId: any, bidId: any):  Observable<any>{
    let queryParams = new HttpParams();
    const walletId:any = localStorage.getItem("WALLETID");
    queryParams = queryParams.append("tenderId",tenderId);
    queryParams = queryParams.append("address", walletId);
    queryParams = queryParams.append("bidId", bidId);
    return this.http.delete<any>(`${config.apiUrl}/my-bids`, {params:queryParams})
      .pipe(
        catchError(this.handleError)
      )
  }
  
}
