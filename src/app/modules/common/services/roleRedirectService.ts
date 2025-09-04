import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { helperService } from "app/core/auth/helper";

@Injectable({ providedIn: 'root' })
export class RoleRedirectGuard implements CanActivate {
    constructor(private _helperService: helperService, private router: Router) {}
  
    canActivate(): boolean {
      const role:any = this._helperService.getUserDetail();
      console.log(role,"role")
      if (role === 'admin') {
        this.router.navigate(['/mentor']);
      } else {
        this.router.navigate(['/student']);
      }
      return false;
    }
  }