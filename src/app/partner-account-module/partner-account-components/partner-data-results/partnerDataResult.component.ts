import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fetchPartnerFile } from 'src/app/resources';
import { FetchFileService } from './fetchFile.service';
import { PartnerData } from './data.schema';

@Component({
    selector :'app-partner-data',
    templateUrl :'partnerDataResult.component.html',
    styleUrls :['partnerDataResult.component.css']
})
export class PartnerDataResultComponent implements OnInit{

    price;
    downloadURI;
    title;
    description;
    rating;
    downloads;
    mime;
    extension

    @Input() PartnerData: PartnerData;
    value:string;
    constructor(private Http:HttpClient,private fetchFileService:FetchFileService){
            
    }
    ngOnInit(){
        this.price = this.PartnerData.price;;
        this.downloadURI = this.PartnerData.url;
        this.description = this.PartnerData.description;
    
        let totalCompoundedRating = Number(this.PartnerData.total_compounded_rating);
        let totalRatings = 5*Number(this.PartnerData.total_numberof_ratings);
        this.title = this.PartnerData.title;
        
        if(totalRatings != 0 ){
            this.rating = 5* (totalCompoundedRating/totalRatings);
        }else{
            this.rating = 0;
        }
       
        this.downloads = this.PartnerData.downloads
        this.mime = this.PartnerData.mime
        this.extension = this.PartnerData.extension;


        console.log(this.downloadURI);
    }
    fetchFile(){
        const file = new FormData;
        file.append('mime',this.mime);
        file.append('uri',this.downloadURI)
        let uri;
        this.Http.post(fetchPartnerFile,file,{
            responseType:'text'
        }
        ).subscribe((data:string)=>{

            /**This gets the signed url required for download of the file */
            this.value = data;

            /**This is the internal code require to dispose the file in download form */
            this.showFile(this.value);
        })
       
    }
    public showFile(value): void {
        this.fetchFileService.fetchFile(value)
            .subscribe(x => {
                // It is necessary to create a new blob object with mime-type explicitly set
                // otherwise only Chrome works like it should
                var newBlob = new Blob([x], { type: this.mime });
    
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
                if(this.mime.includes('application')){
                    link.download = this.title+"."+this.extension;
                }else{
                    link.download =  this.title;
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