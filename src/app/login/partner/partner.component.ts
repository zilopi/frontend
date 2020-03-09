import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account-service/account.service';
import { FormGroup, FormControl, RequiredValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login-service/login-service';
import { DataService } from 'src/app/services/component-data-share-service/data-share.service';
import { refreshScripts } from 'src/app/helpers/refreshScripts';
// import { timingSafeEqual } from 'crypto';
// import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent implements OnInit {

  formGroup: FormGroup;
  displayLoader = false;
  displayError = false;
  passwordError = null;

  constructor(private Account: AccountService, private Router: Router, private LoginService: LoginService,private dataService:DataService) {

  }
  authenticate() {
    // Loader
     this.displayLoader = true;

     const email = this.formGroup.get('email').value;
     const password = this.formGroup.get('password').value;


     let formData = new FormData;
     formData.append('Email', email);
     formData.append('Password', password);
     this.LoginService.loginPartner(formData).subscribe((data: any) => {
      // const result = JSON.parse(data);
      if (data.status == '200') {
        // console.log('Router');
        console.log(data);
        //Set in session storage
        sessionStorage.setItem('id',data.id);
        sessionStorage.setItem('FirstName',data.first_name);
        sessionStorage.setItem('LastName',data.last_name);
        sessionStorage.setItem('Email',data.email);
        sessionStorage.setItem('Country',data.country);
        sessionStorage.setItem('Phone',data.phone);
        sessionStorage.setItem('LinkedIn',data.linkedin);
        sessionStorage.setItem('AboutMe' , data.about);
        sessionStorage.setItem('Rating',data.rating);
        sessionStorage.setItem('Industry',data.industry);
        sessionStorage.setItem('AccountType',"Partner");
        // this.dataService.setPartnerId(data.id);

        //Navigate to the dashboard
        this.Router.navigate(['partner-account']);
      } else if (data.status == '404') {
        this.displayError = true;
        this.formGroup.reset();
        setTimeout(() => {
          this.displayError = false;
          this.passwordError = false;
        }, 5000);
      } else {
        this.passwordError = true;
        this.formGroup.reset();
        setTimeout(() => {
          this.displayError = false;
          this.passwordError = false;
        }, 5000);

      }
      this.displayLoader = false;
    });


  }
  removeLoader() {
    this.displayLoader = false;
  }
  ngOnInit() {

    this.formGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });


    refreshScripts();
    window.scrollTo(0,0);
  }


}
