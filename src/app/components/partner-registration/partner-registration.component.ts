import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from 'src/app/services/registration-service/registration-service';
import { Router } from '@angular/router';
import {countries} from '../../resources';
import { refreshScripts } from 'src/app/helpers/refreshScripts';

@Component({
  selector: 'app-partner-registration',
  templateUrl: './partner-registration.component.html',
  styleUrls: ['./partner-registration.component.css']
})
export class PartnerRegistrationComponent implements OnInit {

  partnerForm: FormGroup;
  matchPassword = false;
  alreadyExists = null;
  createdAccount = null;
  country = [];
  industries = [];
  constructor(private partnerRegistrationService: RegistrationService,private router:Router) {
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
          this.matchPassword = false;
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
      this.matchPassword = false;
    } else {
      this.matchPassword = true;
    }
  }

  ngOnInit() {
   refreshScripts();
  }
  
}
