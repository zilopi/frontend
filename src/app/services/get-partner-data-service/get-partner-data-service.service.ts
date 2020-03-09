import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fetchPartnerData } from 'src/app/resources';
import { MyDataResult } from 'src/app/partner-account-module/partner-account-components/partner-account-mydata/result-item';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetPartnerDataServiceService {

  constructor(private http:HttpClient) { 

  }
  fetchData(){
    const form = new FormData;
    form.append('id',sessionStorage.getItem('id'));
    return this.http.post<MyDataResult[]>(fetchPartnerData,form).pipe(delay(1000));
  }
}
