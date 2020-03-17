import { Component, Output, Input, EventEmitter } from "@angular/core";
import { PurchaseData } from 'src/app/client-account-module/client-purchases';
import { FetchFileService } from 'src/app/partner-account-module/partner-account-components/partner-data-results/fetchFile.service';
import { fetchPartnerFile } from 'src/app/resources';
import { HttpClient } from '@angular/common/http';

@Component({
    selector:'app-client-purchase-component',
    templateUrl:'purchase.component.html',
    styleUrls:['purchase.component.css']
})
export class ClientPurchase {
    @Input() data: PurchaseData;
    @Output() rate = new EventEmitter<PurchaseData>();
    constructor(private Http :HttpClient,private fetchFileService:FetchFileService){

    }
    fetchFile() {
        const file = new FormData;
        file.append('mime', this.data.mime);
        file.append('uri', this.data.url);
    
        this.Http.post(fetchPartnerFile, file, {
          responseType: 'text'
        }
        ).subscribe((data: string) => {
    
          /**This gets the signed url required for download of the file */
    
    
          /**This is the internal code require to dispose the file in download form */
          this.showFile(data, this.data);
        });
    
      }
      public showFile(value, Result: PurchaseData): void {
        this.fetchFileService.fetchFile(value)
          .subscribe(x => {
            // It is necessary to create a new blob object with mime-type explicitly set
            // otherwise only Chrome works like it should
            const newBlob = new Blob([x], { type: Result.mime });
    
            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(newBlob);
              return;
            }
    
            // For other browsers:
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);
    
            const link = document.createElement('a');
            link.href = data;
    
            // if the mime type is of application,then the extension is added via the database column
            if (Result.mime.includes('application')) {
              link.download = Result.title + '.' + Result.extension;
            } else {
              link.download = Result.title;
            }
    
    
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    
            setTimeout(function() {
              // For Firefox it is necessary to delay revoking the ObjectURL
              window.URL.revokeObjectURL(data);
              link.remove();
            }, 100);
          });
      }
      getRating():string{
          
        return ( 5 * (Number(this.data.total_compounded_rating) / (Number(this.data.total_numberof_ratings) * 5))).toString();

      }
      rateData(){
          this.rate.emit(this.data);
      }
}