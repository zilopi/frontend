import { HttpClient } from '@angular/common/http';
import {registerPartnerLink, registerClientLink} from "../../../app/resources";
import { Injectable } from '@angular/core';
@Injectable()
export class RegistrationService{
    constructor(private http:HttpClient){
    }
    registerPartner(formData:FormData){
        return this.http.post(registerPartnerLink,formData)
    }
    registerClient(formData: FormData){
        return this.http.post(registerClientLink,formData);
    }
}