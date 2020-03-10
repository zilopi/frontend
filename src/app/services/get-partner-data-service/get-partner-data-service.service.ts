import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fetchPartnerData } from 'src/app/resources';
import { MyDataResult } from 'src/app/partner-account-module/partner-account-components/partner-account-mydata/result-item';
import { delay } from 'rxjs/operators';
import { PartnerData } from 'src/app/partner-account-module/partner-account-components/partner-data-results/data.schema';

@Injectable({
  providedIn: 'root'
})
export class GetPartnerDataServiceService {

  constructor(private http:HttpClient) { 

  }
  fetchData(){
    const form = new FormData;
    form.append('id',sessionStorage.getItem('id'));
    return this.http.post<PartnerData[]>(fetchPartnerData,form).pipe(delay(1000));
  }
}
