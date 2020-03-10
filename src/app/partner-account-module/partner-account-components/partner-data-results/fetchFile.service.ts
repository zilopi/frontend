import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn :'root'
})
export class FetchFileService{
/** This service is responsible for fetching the uploaded file from S3  */

    constructor(private http :HttpClient){

    }
    fetchFile(uri):Observable<Blob>{
        // this.http refers to HttpClient. Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.
        return this.http.get(uri, { responseType: 'blob' });
    }
}