import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { feedbackUpload } from 'src/app/resources';

@Injectable({
    providedIn: 'root'
})
export class FeedBackUploadService {

    constructor(private http: HttpClient){

    }
    uploadFeedback(data:FormData){
        return this.http.post(feedbackUpload,data);
        
    }
}