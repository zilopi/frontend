import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fetchClientPurchases } from 'src/app/resources';

@Injectable({
    providedIn:'root'
})
export class FetchClientPurchases{
    constructor(private http: HttpClient){
        
    }
    fetchClientPurchase(option:string){
        let options = new FormData();
        options.append('client_id',sessionStorage.getItem('id'));
        options.append('options',option);
        return this.http.post(fetchClientPurchases,options);
    }
}