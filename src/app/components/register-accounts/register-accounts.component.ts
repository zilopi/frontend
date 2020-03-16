import { Component, OnInit, ElementRef } from "@angular/core";
import { refreshScripts } from 'src/app/helpers/refreshScripts';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from 'src/app/services/registration-service/registration-service';
import { Router } from '@angular/router';
import {countries} from '../../resources';
@Component({
    selector:"app-register",
    templateUrl : 'register-accounts.component.html',
    styleUrls:['register-accounts.component.css']
})
export class RegisterComponent implements OnInit{
    clientFrom: FormGroup;
    passwordMatch: Boolean = true;
    accountCreated = false;
    displayError = false;
    loading = false;
  
    //For partner functionality
    partnerForm: FormGroup;
  matchPasswordPartner = false;
  alreadyExists = null;
  createdAccount = null;
  country = [];
  industries = [];


    constructor( private partnerRegistrationService: RegistrationService,private registerService: RegistrationService , private router:Router) {
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

      this.partnerForm = new FormGroup({
        firstName : new FormControl(null, [Validators.required]),
        lastName: new FormControl(null, [Validators.required]),
        email : new FormControl(null, [Validators.required, Validators.email]),
        country: new FormControl('India', [Validators.required]),
        industry: new FormControl(null, [Validators.required]),
        yearsOfExperience: new FormControl(null, [Validators.required]),
        linkedInProfile: new FormControl(null, [Validators.required]),
        phoneNumber: new FormControl(null, [Validators.required, Validators.min(10)]),
        password : new FormControl(null, [Validators.required]),
        confirmPassword : new FormControl(null, [Validators.required]),
        aboutMe: new FormControl(null,[])
      });
      this.country = countries;

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

    // Partner specific functions


    addToIndustries(elem:ElementRef){
      const value =   this.partnerForm.get('industry').value;
      this.partnerForm.get('industry').patchValue(' ');
      this.industries.push(value);
    
      }

      register() {
        const formData = new FormData;
        formData.append('FirstName', this.partnerForm.get('firstName').value);
        formData.append('LastName', this.partnerForm.get('lastName').value);
        formData.append('Email', this.partnerForm.get('email').value);
        formData.append('Country', this.partnerForm.get('country').value);
        //Industries seperator :<>
        formData.append('Industry', this.industries.join('<>'));
        formData.append('Experience', this.partnerForm.get('yearsOfExperience').value);
        formData.append('LinkedInProfile', this.partnerForm.get('linkedInProfile').value);
        formData.append('Phone', this.partnerForm.get('phoneNumber').value);
        formData.append('Password', this.partnerForm.get('password').value);
        formData.append('aboutMe',this.partnerForm.get('aboutMe').value);
        this.partnerRegistrationService.registerPartner(formData).subscribe((data:any) => {
            let x = data['status'];
            if(x == 'exist'){
              this.alreadyExists = true;
              
              setTimeout(()=>{
                this.alreadyExists = false;
              },5000);
              this.partnerForm.get('email').patchValue("");
              this.partnerForm.get('password').patchValue("");
              this.partnerForm.get("confirmPassword").patchValue("");
              this.matchPasswordPartner = false;
            }else if(x == 'ok'){
              this.createdAccount = true;
              window.scrollTo(0,0);
              setTimeout(()=>{
                
                this.router.navigate(['/login/partner']);
              },5000);
            }
    
    
        });
    
    
      }
      checkPassword() {
        const x = this.partnerForm.get('password').value;
        const y = this.partnerForm.get('confirmPassword').value;
        if (x != y) {
          this.matchPasswordPartner = false;
        } else {
          this.matchPasswordPartner = true;
        }
      }
}