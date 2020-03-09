import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { DataStoreService } from '../data-store.service';
import { Result } from '../result';

@Component({
    selector: 'app-search-view-details',
    templateUrl: 'view-details.component.html',
    styleUrls: ['view-details.component.css']
})
export class ViewSearchDetailsComponent implements OnInit {
    ViewData:Result;
    constructor(private route: ActivatedRoute,private dataStore :DataStoreService) {

    }

    ngOnInit(){
        console.log(this.route.snapshot.queryParams);
        this.dataStore.getDataAsObservable().subscribe(data=>{
            this.ViewData = data;
        })
    }
}
