import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { DataStoreService } from '../data-store.service';
import { Result } from '../result';
import { FormGroup, FormControl } from '@angular/forms';
import { FeedBackUploadService } from 'src/app/services/feedback-upload-service/feedback-upload-service';
import { HttpClient } from '@angular/common/http';
import { FetchFileService } from 'src/app/partner-account-module/partner-account-components/partner-data-results/fetchFile.service';
import { fetchPartnerFile } from 'src/app/resources';
// import { timingSafeEqual } from 'crypto';

@Component({
    selector: 'app-search-view-details',
    templateUrl: 'view-details.component.html',
    styleUrls: ['view-details.component.css']
})
export class ViewSearchDetailsComponent implements OnInit {
    ViewData: Result;
    feedback: FormGroup;
    showFeedBackModal = false;
    rating:Number;
    constructor(private route: ActivatedRoute, private dataStore: DataStoreService, private feedbackUploadService: FeedBackUploadService,private Http:HttpClient,private fetchFileService:FetchFileService) {

    }
    feedbackRating = 1;

    ngOnInit() {
        console.log(this.route.snapshot.queryParams);
        this.dataStore.getDataAsObservable().subscribe(data => {
            this.ViewData = data;
        });

        this.feedback = new FormGroup({
            feedbackInput: new FormControl('', [])
        });
        this.rating = ( 5 * (Number(this.ViewData.total_compounded_rating) / (Number(this.ViewData.total_numberof_ratings) * 5)));



    }
    showSubmitting = false;
    submitFeedBack() {
        this.showSubmitting = true;
        const formData = new FormData();
        formData.append('rating', this.feedbackRating.toString());
        formData.append('uuid', this.ViewData.uuid);
        this.feedbackUploadService.uploadFeedback(formData).subscribe(res => {
            this.showSubmitting = false;
            this.showFeedBackModal = false;

        });
        this.ViewData.total_compounded_rating = Number(this.ViewData.total_compounded_rating ) + Number(this.feedbackRating.toString());
        this.ViewData.total_numberof_ratings = Number(this.ViewData.total_numberof_ratings)+1;
        this.recalculateRating();

    }
    recalculateRating(){
        this.rating = ( 5 * (Number(this.ViewData.total_compounded_rating) / (Number(this.ViewData.total_numberof_ratings) * 5)));
    }

    download(){
        //This will contain the login and the other authentication required

        this.fetchFile();

    }
    fetchFile(){
        const file = new FormData;
        file.append('mime',this.ViewData.mime);
        file.append('uri',this.ViewData.url)
        
        this.Http.post(fetchPartnerFile,file,{
            responseType:'text'
        }
        ).subscribe((data:string)=>{

            /**This gets the signed url required for download of the file */
             ;

            /**This is the internal code require to dispose the file in download form */
            this.showFile(data);
        })
       
    }
    public showFile(value): void {
        this.fetchFileService.fetchFile(value)
            .subscribe(x => {
                // It is necessary to create a new blob object with mime-type explicitly set
                // otherwise only Chrome works like it should
                var newBlob = new Blob([x], { type: this.ViewData.mime });
    
                // IE doesn't allow using a blob object directly as link href
                // instead it is necessary to use msSaveOrOpenBlob
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(newBlob);
                    return;
                }
    
                // For other browsers: 
                // Create a link pointing to the ObjectURL containing the blob.
                const data = window.URL.createObjectURL(newBlob);
    
                var link = document.createElement('a');
                link.href = data;

                // if the mime type is of application,then the extension is added via the database column
                if(this.ViewData.mime.includes('application')){
                    link.download = this.ViewData.title+"."+this.ViewData.extension;
                }else{
                    link.download =  this.ViewData.title;
                }
                
            
                // this is necessary as link.click() does not work on the latest firefox
                link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    
                setTimeout(function () {
                    // For Firefox it is necessary to delay revoking the ObjectURL
                    window.URL.revokeObjectURL(data);
                    link.remove();
                }, 100);
            });
    }
}
