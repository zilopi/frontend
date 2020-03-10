import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Result } from '../result';

@Component({
    selector:'app-search-result',
    templateUrl:'search-item.component.html',
    styleUrls:['search-item.component.css']
})
export class SearchItem implements OnInit{

    // @Input() title;
    // @Input() dataOfIndustry;
    // @Input() informationType;
    // @Input() price;
    // @Input() uploadDate;
    // @Input() description;
    // @Input() uuid;
    // @Input() totalNumberOfRatings
    // @Input() totalCompoundedRating
    

    //The data is passed in by the parent as a Result object
    @Input() data: Result;
    
    @Output() download = new EventEmitter<{}>();
    @Output() view = new EventEmitter<{}>();

    rating:Number;
    constructor(){

    }
    downloadNow(){
        this.download.emit({'uuid':this.data.uuid});
    }
    viewDetails(){
        this.view.emit(this.data);
    }
    ngOnInit(){
        this.rating  = 5*(Number(this.data.total_compounded_rating)/(Number(this.data.total_numberof_ratings)*5));
        
    }


    
}