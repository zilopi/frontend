import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { search } from 'src/app/resources';
import { delay } from "rxjs/operators";
import { Observable } from 'rxjs';
import { Result } from 'src/app/components/search-page/result';
@Injectable({
    providedIn:'root'
})
export class SearchService{
    constructor(private http:HttpClient){

    }
    search(query:any){
        let formdata = new FormData;
        formdata.append('query',query.replace("%20"," "));
        console.log(query.replace("%20"," "));
        formdata.append('client_id',sessionStorage.getItem('id'));
        return this.http.post<Result[]>(search,formdata).pipe(delay(1000));
    }
}