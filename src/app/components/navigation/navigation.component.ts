import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  animations :[
    trigger('dropDown',[
      state('true', style({
       height : '100%'
      })),
      state('false',style({
        height :'0',
        overflow:'hidden'
      })),
      transition('true => false',[
        animate('0.5s')
      ]),
      transition('false => true',[
        animate('0.5s')
      ]),
      
    ])
  ]
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
 //For industry
 


 
 //For Profile
  showProfileDropDownControl =false;
  showProfileDropDown(){
    this.showProfileDropDownControl = true;
  }
  closeProfileDropDown(){
    this.showProfileDropDownControl = false;
  }


  // for logins
  showDropDownControl = false;
  showDropDown(){
    this.showDropDownControl = true;

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
