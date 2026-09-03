import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenService } from './token-service';
import { Router } from '@angular/router';
import { ToastService } from './toast-service';
import { TranslationService } from './translation-service';
import { Helper } from './helper';
import { LoginResponse } from '../models/LoginResponse';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  httpClient = inject(HttpClient);
  tokenService = inject(TokenService)
  router = inject(Router);
  toastService = inject(ToastService);
  translateService = inject(TranslationService);

  login(email: string, password: string){
      this.httpClient.post<LoginResponse>('auth/login', {email: email, password: password})
    .subscribe({
      next: (res: LoginResponse) => {
        this.tokenService.setToken(res.token);
        this.router.navigate(['/fleet-viewer']);
        this.toastService.add({
          id: v4(),
          type: 'success',
          message: this.translateService.translate("SUCCESSFULLY_LOGGED_IN")
        })
        
      },
      error: (err) => {
        this.toastService.add({
          id: v4(),
          type: 'error',
          message: err.error.message
        });
      }
    });
  }

   logout() {
        this.httpClient.post('auth/logout', [])
    .subscribe({
      next: (res) => {
        this.tokenService.clearToken();
         this.toastService.add({
          id: v4(),
          type: 'success',
          message: this.translateService.translate("SUCCESSFULLY_LOGGED_OUT")
        });
        this.router.navigateByUrl('authorization/login');
      },
      error: (err) => {
        this.toastService.add({
          id: v4(),
          type: 'error',
          message: err.error.message
        });
      }
    });
  }

  redirectIfAlreadyLoggedIn() {
    const token = this.tokenService.getToken();
    if(Helper.isNullOrUndefined(token) || Helper.isEmptyString(token)) {
      return;
    }
    
    this.router.navigate(['/fleet-viewer']);
  }
}