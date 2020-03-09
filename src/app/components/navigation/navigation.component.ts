import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EventManager } from '@angular/platform-browser';
import * as $ from 'jquery';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  tooltip = "You are not logged in as";
  currentRoute ="/";
  constructor(private router: Router) {
    router.events.subscribe(e => {
      if(e instanceof NavigationEnd){
        // console.log(router.url);

        this.currentRoute = router.url;
      }
    });
    }
  ngOnInit() {


  }
  showIndustriesControl = false;
  showIndustries(){
    this.showIndustriesControl = true;
  }
  closeShowIndustries(){
    this.showIndustriesControl = false;

  }


  showDropDownControl = false;
  showDropDown(){
    this.showDropDownControl = true;
    this.showIndustriesControl = false;
  }
  closeDropDown(){
    this.showDropDownControl = false;
    
  }
  logout(){
    sessionStorage.clear();
    
    // M.toast({html: 'You are being logged out',inDuration:800, outDuration: 800});
    this.router.navigate(['/landing-page']);
    

  }
  getAuthStatus(){
    // console.log(sessionStorage.getItem('id')+ " < id");
    if(sessionStorage.getItem('id')!=undefined || sessionStorage.getItem('id')!=null ){
      
      return true;
    }else{
      return false;
    }

  }
  getAccountType(){
    if(sessionStorage.getItem("AccountType")=="Partner"){
      return "Partner";
    }else if(sessionStorage.getItem("AccountType")=="Client"){
      return "Client";
    }
  }
  getName(){
    const name = sessionStorage.getItem("FirstName")+" "+sessionStorage.getItem("LastName");
    this.tooltip += name;
    return name;
  }


}
