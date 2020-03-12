import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account-service/account.service';
import { LoginService } from 'src/app/services/login-service/login-service';
import { Router } from '@angular/router';
import { refreshScripts } from 'src/app/helpers/refreshScripts';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userForm: FormGroup;
  displayLoader = false;
  displayError = false;

  constructor(private loginService: LoginService,private router: Router) {

  }

  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null)
    });
    refreshScripts()
  }
  
  login(){
    this.displayLoader = true;
    let formData = new FormData;
    formData.append('Email',this.userForm.get('email').value);
    formData.append('Password',this.userForm.get('password').value);

    this.loginService.loginClient(formData).subscribe( (data:any)=>{
      console.log(data);
      this.displayLoader = false;
      if(data['status']=='200'){
        
        sessionStorage.setItem('id',data.id);
        sessionStorage.setItem('FirstName',data.first_name);
        sessionStorage.setItem('LastName',data.last_name);
        sessionStorage.setItem('Email',data.email);
        sessionStorage.setItem('Country',data.country);
        sessionStorage.setItem('Phone',data.phone_number);
        sessionStorage.setItem('AboutMe' , data.about_me);
        sessionStorage.setItem('AccountType',"Client");
        sessionStorage.setItem('Wallet',data.wallet_balance);
        this.router.navigate(['landing-page']);
      }else{
        this.displayError = true;
        setTimeout(()=>{
          this.displayError = false;
        },5000);
      }
    });
  }
}
