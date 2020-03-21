import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { refreshScripts } from 'src/app/helpers/refreshScripts';
// import { DynamicScriptLoaderService } from 'src/app/services/script-loader.service';

@Component({
  selector: 'app-search',
  templateUrl: 'landing-page.component.html',
  styleUrls: ['./main-container-1.css', './main-container-2.css','./main-container-3.css','./main-container-4.css','./main-container-5.css']
})
export class LandingPageComponent implements OnInit {

  searchFrom:FormGroup;
  constructor(private router:Router) { 
    this.searchFrom = new FormGroup({
      search: new FormControl(null)
    });
  }
  searchInit = false;

  ngOnInit() {
    this.searchInit = false;
    // this.loadScripts();
    setTimeout(()=>{
      refreshScripts();
    },500);
   this.router.events.subscribe(()=>{
     setTimeout(()=>{
       this.searchInit = false;
     },5000);
   })
  }
 

  
  search(){
    this.searchInit = true;
    
    let query = this.searchFrom.get('search').value;
    
    this.router.navigate(['search/'+query]);
    // this.searchInit = false;
    // this.searchInit = false;
  }

}

