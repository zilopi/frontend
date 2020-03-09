import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { refreshScripts } from 'src/app/helpers/refreshScripts';
import { RegistrationService } from 'src/app/services/registration-service/registration-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.css']
})
export class ClientRegistrationComponent implements OnInit {

  clientFrom: FormGroup;
  passwordMatch: Boolean = true;
  accountCreated = false;
  displayError = false;
  loading = false;

  constructor( private registerService: RegistrationService , private router:Router) {
    this.clientFrom = new FormGroup({
      firstName: new FormControl(null,[Validators.required]),
      lastName : new FormControl(null,[Validators.required]),
      email : new FormControl(null,[Validators.required,Validators.email]),
      password: new FormControl(null,[Validators.required]),
      country : new FormControl("India",[Validators.required]),
      industry : new FormControl(null,[Validators.required]),
      phoneNumber : new FormControl(null,[Validators.required]),
      confirm_password : new FormControl(null,[Validators.required]),
      aboutMe : new FormControl(null,[Validators.required])

    })
   }

  ngOnInit() {
    refreshScripts();
  }

  matchPassword(ref:ElementRef){
    if(this.clientFrom.get('password').value!=this.clientFrom.get('confirm_password').value){
      this.passwordMatch = false;
    }else{
      this.passwordMatch = true;
    }
  }
  
  submit(){
    this.loading = true;
    let formData = new FormData;
    formData.append('FirstName', this.clientFrom.get('firstName').value);
    formData.append('LastName', this.clientFrom.get('lastName').value);
    formData.append('Email', this.clientFrom.get('email').value)
    formData.append('Country', this.clientFrom.get('country').value)
    formData.append('Industry', this.clientFrom.get('industry').value)
    formData.append('Phone', this.clientFrom.get('phoneNumber').value)
    formData.append('Password',this.clientFrom.get('password').value)
    formData.append('AboutMe',this.clientFrom.get('aboutMe').value);
    // Send data to the server
   
    this.registerService.registerClient(formData).subscribe( (data:any)=>{
      this.loading = false;
      console.log(data);
      if(data['status']=='ok'){
        
        this.accountCreated = true;
        

        setTimeout(()=>{
          this.router.navigate(['/login/client']);
        },5000);
      }else if(data['status']=='exist'){
        this.displayError = true;
        this.clientFrom.get('email').patchValue('');
        this.clientFrom.get('password').patchValue('');
        this.clientFrom.get('confirm_password').patchValue('')
        setTimeout(()=>{
          this.displayError = false;
        },5000);
      }


    });


  }

}
