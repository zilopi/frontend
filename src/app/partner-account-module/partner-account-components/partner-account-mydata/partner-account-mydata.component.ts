import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MyDataResult } from './result-item';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-partner-account-mydata',
    styleUrls: ['partner-account-mydata.component.css'],
    templateUrl: 'partner-account-mydata.component.html',
})
export class PartnerAccountMyDataComponent implements OnInit{

    myDataSearch:FormGroup;
    data:MyDataResult[] = [];
    constructor(private router: ActivatedRoute) {
        this.myDataSearch = new FormGroup({
            searchMyData:new FormControl(null)
        });
    }
    ngOnInit(){
        this.data = this.router.snapshot.data.data;
        console.log(this.data);
    }
}
