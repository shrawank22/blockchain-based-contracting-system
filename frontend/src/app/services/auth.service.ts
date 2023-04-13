import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
// import jwt_decode from "jwt-decode";
import { config } from '../config';
import { Tokens } from '../models/token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN: string = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN: string = 'REFRESH_TOKEN';
  private loggedUser: string | null = "";

  constructor(private http: HttpClient, private route: Router) { }

  login(user: { walletId: any, password: any }): Observable<boolean> {
    return this.http.post<any>(`${config.apiUrl}/login/`, user)
      .pipe(
        tap(res => this.doLoginUser(user.walletId, res.name)),
        mapTo(true),
        catchError(error => {
          // alert(error.error);
          return of(false);
        }));
  }

  logout() {
    this.doLogoutUser();
    this.route.navigate(['/login']);
    // return this.http.post<any>(`${config.apiUrl}/logout`, {
    //   'refreshToken': this.getRefreshToken()
    // }).pipe(
    //   tap(() => this.doLogoutUser()),
    //   mapTo(true),
    //   catchError(error => {
    //     alert(error.error);
    //     return of(false);
    //   }));
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.http.post<any>(`${config.apiUrl}/login/refresh/`, {
      'refresh': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.access);
    }));
  }

  getJwtToken(): string {
    let jwtTokenReturned = localStorage.getItem(this.JWT_TOKEN);
    let jwtToken: string = "";
    if (jwtTokenReturned != null)
      jwtToken = jwtTokenReturned;

    return jwtToken;
  }

  private doLoginUser(walletId: string, name: any) {
    this.loggedUser = walletId;
    // this.storeTokens(tokens);
    localStorage.setItem("WALLETID", walletId);
    localStorage.setItem("NAME", name);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.access);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh);
    let decoded_token: any = this.decodeToken(tokens.access);
    localStorage.setItem("UID", decoded_token.uid);
    localStorage.setItem("TOKEN_EXPIRY", decoded_token.exp);
  }

  private decodeToken(token: string) {
    // let decoded_token = jwt_decode(token);
    return token;
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem("WALLETID");
    localStorage.removeItem("TOKEN_EXPIRY");
    localStorage.removeItem("UID");
  }
}
