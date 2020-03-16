import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { transaction } from 'src/app/resources';

@Injectable()
export class UpdateWalletAndTransact {
    constructor(private http: HttpClient){

    }
    transaction(client_id,item_id,currentWallet,price){
        let data = new FormData();
        data.append('client_id',client_id);
        data.append('prev',currentWallet);
        data.append('price',price);
        data.append('item_id',item_id);
        return this.http.post(transaction,data);
    }
}