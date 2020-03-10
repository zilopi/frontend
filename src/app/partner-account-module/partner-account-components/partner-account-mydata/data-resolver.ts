import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { MyDataResult } from './result-item';
import { HttpClient } from '@angular/common/http';
import { GetPartnerDataServiceService } from 'src/app/services/get-partner-data-service/get-partner-data-service.service';
import { Observable } from 'rxjs';
import { PartnerData } from '../partner-data-results/data.schema';

@Injectable({
    providedIn:'root'
})
export class PartnerDataProvider implements Resolve<any>{
    constructor(private http:HttpClient,private fetchService: GetPartnerDataServiceService){

    }
    resolve():Observable<PartnerData[]>{
        return this.fetchService.fetchData();
    }
}