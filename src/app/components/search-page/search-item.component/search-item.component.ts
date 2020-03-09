import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Result } from '../result';

@Component({
    selector:'app-search-result',
    templateUrl:'search-item.component.html',
    styleUrls:['search-item.component.css']
})
export class SearchItem{

    // @Input() title;
    // @Input() dataOfIndustry;
    // @Input() informationType;
    // @Input() price;
    // @Input() uploadDate;
    // @Input() description;
    // @Input() uuid;
    // @Input() totalNumberOfRatings
    // @Input() totalCompoundedRating
    
    @Input() data: Result;
    
    @Output() download = new EventEmitter<{}>();
    @Output() view = new EventEmitter<{}>();

    constructor(){

    }
    downloadNow(){
        this.download.emit({'uuid':this.data.uuid});
    }
    viewDetails(){
        this.view.emit(this.data);
    }


    
}