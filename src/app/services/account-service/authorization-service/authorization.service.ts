import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private accountService: AccountService,private router:Router) {

    }
    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | Promise<boolean> |Observable<boolean>|UrlTree {
       
       //TODO: Potential security risk here, we will have to make the client and the parnter authentication route guards different
        if (sessionStorage.getItem('id')!=null) {
            console.log('authenticated by route guard');
            return true;
        } else {
            return this.router.createUrlTree(['landing-page']);
        }
       
    }
}
