import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { Result } from './result';

@Injectable({
    providedIn:'root'
})
export class DataStoreService{
    private storedData: BehaviorSubject<Result> = new BehaviorSubject(null);
    private storedResults: BehaviorSubject<Result[]> = new BehaviorSubject(null);
    constructor(){

    }
    getDataAsObservable(){
        return this.storedData.asObservable();
    }
    setData(data: Result){
        this.storedData.next(data);
    }

    setStoreResult(data:Result[]){
        this.storedResults.next(data);
    }
    getStoredResult(): Observable<Result[]>{
        // console.log(this.storedResults.value);
        return this.storedResults.asObservable();
    }
    checkIfStoredResultExists(){
        return this.storedResults.value;
    }
    

}