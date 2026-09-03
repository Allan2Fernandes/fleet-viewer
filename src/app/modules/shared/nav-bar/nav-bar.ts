import { Component, inject, OnInit } from '@angular/core';
import { Button } from "../button/button";
import { Router } from '@angular/router';
import { ICONS } from '../../../constants/icons';
import { TokenService } from '../../../services/token-service';
import { AuthorizationService } from '../../../services/authorization-service';
import { TranslatePipe } from "../../../pipes/translate-pipe";
import { Helper } from '../../../services/helper';

@Component({
  selector: 'app-nav-bar',
  imports: [Button, TranslatePipe],
  templateUrl: './nav-bar.html',
})
export class NavBar implements OnInit{
  router = inject(Router);
  icons = ICONS
  
  ngOnInit(): void {
    // router.navigate(['/authorization/login']);
    const token = this.tokenService.getToken();
    if(Helper.isNullOrUndefined(token) || Helper.isEmptyString(token)) {
      this.logout();
    }
  }
  
  tokenService = inject(TokenService);
  authorizationService = inject(AuthorizationService);

  navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  fleetViewerClicked() {
    this.router.navigate(['/fleet-viewer']);
  }

  eventsClicked() {
    this.router.navigate(['/events']);
  }

  trendViewerClicked() {
    this.router.navigate(['/fleet-viewer/trend-viewer']);
  }

  logout() {
    this.authorizationService.logout();
  }
}