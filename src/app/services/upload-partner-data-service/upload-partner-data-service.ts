import { HttpClient } from '@angular/common/http';
import { partnerUploadExcelFile, partnerUploadData } from 'src/app/resources';
import { Injectable } from '@angular/core';

@Injectable()
export class PartnerDataUploadService {
    constructor(private http: HttpClient) {

    }
    uploadExcelFile(formData: FormData) {
        return this.http.post(partnerUploadExcelFile, formData, {
            reportProgress: true,
            observe: 'events'
          });
    }
    uploadData(formData: FormData){
        return this.http.post(partnerUploadData,formData,{
            reportProgress: true,
            observe: 'events'
        });
    }
}
