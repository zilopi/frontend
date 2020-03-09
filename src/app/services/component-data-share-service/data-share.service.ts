import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class DataService {

    id:BehaviorSubject<Number>;
    constructor(){
        console.log("Constructed");
    }
    setPartnerId(id:Number){
        this.id = new BehaviorSubject(id);
    }
}