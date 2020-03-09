import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fetchPartnerFile } from 'src/app/resources';
import { FetchFileService } from './fetchFile.service';

@Component({
    selector :'app-partner-data',
    templateUrl :'partnerDataResult.component.html',
    styleUrls :['partnerDataResult.component.css']
})
export class PartnerDataResultComponent implements OnInit{

    @Input() price;
    @Input() downloadURI;
    @Input() title;
    @Input() description;
    @Input() rating;
    @Input() downloads;
    @Input() mime
    value:string;
    constructor(private Http:HttpClient,private fetchFileService:FetchFileService){
            
    }
    ngOnInit(){
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

            this.value = data;
            // window.location.href = this.value;
            this.showFile(this.value);
        })
        // this.Http.get(uri).subscribe((data)=>{
        //     console.log(data);
        // })
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
                // link.innerText = this.title;
                const extension = this.mime.split('/')[1]
                
                link.download =  this.title+" "+extension;
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