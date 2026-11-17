import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { UserLoginResponse, UserLoginsDto, VerifyOtpDto, VerifyOtpResponse } from '../data/eventsDTO.dto';
import { environment } from '../environments/environment';
import { UpdatePasswordDto, VerifyEmailResponse } from '../data/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  baseUrl = environment.baseUrl;
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private readonly http: HttpClient) {}

  login(payload: UserLoginsDto): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(`${this.baseUrl}/user/login`, payload);
  }

  verifyOtp(payload: VerifyOtpDto): Observable<VerifyOtpResponse> {
    return this.http.post<VerifyOtpResponse>(`${this.baseUrl}/user/verify`, payload);
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken');
    }
    return null; // SSR: no localStorage, treat as unauthenticated
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
    }
  }
  verifyEmail(payload:any):Observable<VerifyEmailResponse>{
  return  this.http.post<VerifyEmailResponse>(`${this.baseUrl}/user/verify/email`,payload);
  }
  updatePassword(payload:UpdatePasswordDto):Observable<any>{
return this.http.post<UpdatePasswordDto>(`${this.baseUrl}/user/update-password`, payload)
  }
}
