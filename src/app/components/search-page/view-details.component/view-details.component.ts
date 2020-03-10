import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { DataStoreService } from '../data-store.service';
import { Result } from '../result';
import { FormGroup, FormControl } from '@angular/forms';
import { FeedBackUploadService } from 'src/app/services/feedback-upload-service/feedback-upload-service';
import { timingSafeEqual } from 'crypto';

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
    constructor(private route: ActivatedRoute, private dataStore: DataStoreService, private feedbackUploadService: FeedBackUploadService) {

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
}
