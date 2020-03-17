import { Component, OnInit } from '@angular/core';
import { FetchClientPurchases } from 'src/app/services/fetch-client-purchases/fetch-client-purchases.service';
import { PurchaseData } from '../../client-purchases';
import { HttpClient } from '@angular/common/http';
import { FeedBackUploadService } from 'src/app/services/feedback-upload-service/feedback-upload-service';
import { from } from 'rxjs';

@Component({
    selector:'app-view-purchases',
    templateUrl:'client-view-purchases.html',
    styleUrls:['client-view-purchases.css']
})
export class ClientViewPurchases implements OnInit {
    constructor(private fetchPurchases:FetchClientPurchases,private http:HttpClient,private feedbackUploadService: FeedBackUploadService,){
        
    }
    purchases:PurchaseData[] = [];
    showLoader = true;
    rating = 1;
    selectedData:PurchaseData;
    showRatingModal = false;
    submitting =false;
    ngOnInit(){
     this.fetchPurchases.fetchClientPurchase('all').subscribe((data:PurchaseData[])=>{
      this.purchases = data;
      this.showLoader = false;
     })
    }
    rateData($event:PurchaseData){
            console.log($event)
            this.selectedData = $event;
            this.showRatingModal = true;
            setTimeout(()=>{
                document.getElementById("modal-rating-content").scrollIntoView({behavior: 'smooth'});
            },200);
            
            
    }
    closeRatingModal(){
        this.showRatingModal =false;
        this.rating = 1;
    }
    submitRating(){
        this.submitting = true;
        const formData = new FormData();
        formData.append('rating', this.rating.toString());
        formData.append('uuid', this.selectedData.uuid);
        this.feedbackUploadService.uploadFeedback(formData).subscribe(data=>{
          
            this.selectedData.total_compounded_rating = Number(this.selectedData.total_compounded_rating ) + Number(this.rating.toString());
            this.selectedData.total_numberof_ratings = Number(this.selectedData.total_numberof_ratings)+1;
            this.submitting = false;
            this.closeRatingModal();
        })
    }
  

}