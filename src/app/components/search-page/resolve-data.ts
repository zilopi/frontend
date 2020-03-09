import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { SearchService } from 'src/app/services/search-service/search.service';
import { SearchResult } from './search.item';
import { HttpClient } from '@angular/common/http';
import { search } from 'src/app/resources';
import { Observable } from 'rxjs';
import { DataStoreService } from './data-store.service';
import { Result } from './result';

@Injectable({
    providedIn:"root"
})
export class SearchResolver implements Resolve<any>{
        constructor(private http : HttpClient,private searchService: SearchService,private dataStore : DataStoreService){

        }
        resolve(route: ActivatedRouteSnapshot): Observable<any> | Result[]{
            if(this.dataStore.checkIfStoredResultExists()==null || this.dataStore.checkIfStoredResultExists()==undefined){
                // console.log("Search via service")
                return this.searchService.search(route.params['query'])
            }else{
                console.log("Search via store")
                // console.log(this.dataStore.getStoredResult());
                return this.dataStore.checkIfStoredResultExists()

            }
           
        }
        
}