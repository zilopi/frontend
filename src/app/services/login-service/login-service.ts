import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {loginPartner, loginClient} from '../../resources';
@Injectable()
export class LoginService {
    constructor(private http: HttpClient) {

    }
partnerLogin = false;
clientLogin = false;



loginPartner(formData: FormData){
        return this.http.post(loginPartner, formData);
    }
loginClient(formData:FormData){
    return this.http.post(loginClient,formData);
}
}
