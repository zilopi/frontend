import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { partnerAboutMeUpdate, clientAboutMeUpdate } from 'src/app/resources';

@Injectable({
    providedIn:'root'
})
export class UpdateAboutMeService{
    constructor(private http:HttpClient){

    }
    partnerAboutMeUpdate(formData:FormData){
        return this.http.post(partnerAboutMeUpdate,formData);
    }
    clientAboutMeUpdate(formData:FormData){
        return this.http.post(clientAboutMeUpdate,formData);
    }
}