import { RouteReuseStrategy , DetachedRouteHandle, ActivatedRouteSnapshot} from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class CacheRouteReuseStratergy implements RouteReuseStrategy {

    storedRouteHandles  = new Map<string, DetachedRouteHandle>();

    allowCacheRetrieveal = {
        'landing-page' : true
    }

    // Checks if the route should be reused
    shouldReuseRoute(before : ActivatedRouteSnapshot, current : ActivatedRouteSnapshot){

        if((this.getPath(before)!="landing-page"||this.getPath(before)!='landing-page')&&this.getPath(current)=='landing-page'){
            console.log('should reuse route');
            this.allowCacheRetrieveal[''] = true;
        }else{
            this.allowCacheRetrieveal[''] = false;
        }
        return before.routeConfig == current.routeConfig;
    }

    //
    retrieve(route : ActivatedRouteSnapshot): DetachedRouteHandle | null{
            return this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle;
    }
    shouldAttach(route : ActivatedRouteSnapshot) : boolean {
        console.log('attached');
        const path = this.getPath(route);
        if(this.allowCacheRetrieveal[path]){
            return this.storedRouteHandles.has(this.getPath(route));
        }
    }
    shouldDetach(route : ActivatedRouteSnapshot): boolean {
        console.log('detached');
        const path = this.getPath(route);
        if(this.allowCacheRetrieveal.hasOwnProperty(path)){
            return true;
        }else{
            return false;
        }
    }
    store(route : ActivatedRouteSnapshot , detachedTree : DetachedRouteHandle): void{
        console.log('cached');
        this.storedRouteHandles.set(this.getPath(route),detachedTree);
    }

    private getPath(route: ActivatedRouteSnapshot): string {
        if (route.routeConfig != null && route.routeConfig.path != null) {
            return route.routeConfig.path;
        } else {
            return '';
        }
    }
}
