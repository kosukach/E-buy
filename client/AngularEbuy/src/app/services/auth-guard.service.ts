import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, RouterState } from "@angular/router"


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    /*if(localStorage.getItem("token")){
      return state.url.startsWith("/profile")
        ? true : (this.router.navigate(["/"]), false)
    }

    return state.url.startsWith("/profile")
      ? (this.router.navigate(["/"]), false) : true*/
    let logedIn = !!localStorage.getItem("token")
    let routeIsProfile = state.url.startsWith("/profile"); 
    if(logedIn && routeIsProfile){
      return true;
    }
    if(!(logedIn || routeIsProfile)){
      return true;
    }
    this.router.navigate(["/"])
    return false;
  }
}
