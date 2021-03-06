import { Component, OnInit } from '@angular/core';
import { refreshScripts } from 'src/app/helpers/refreshScripts';
import { RegistrationService } from 'src/app/services/registration-service/registration-service';
import { UpdateAboutMeService } from 'src/app/services/account-service/aboutMeUpdate-service/aboutMeUpdate-service';
import { FetchClientPurchases } from 'src/app/services/fetch-client-purchases/fetch-client-purchases.service';
import { PurchaseData } from '../../client-purchases';

@Component({
    selector : 'app-client-account-dashboard',
    templateUrl: 'client.dashboard.component.html',
    styleUrls :['client.dashboard.component.css']
}
)
export class ClientAccountDashboardComponent implements OnInit{

    editAboutParagraph = false;
    
    newAboutMe;

    //Client Attributes
    id;
    firstName; lastName; AboutMe:String; ; Country ; Industry; Phone ; Email; Wallet
    
    constructor(private aboutMeUpdater: UpdateAboutMeService,private fetchPurchasesService : FetchClientPurchases){

    }
    loadPurchase = true
    purchases:PurchaseData[] = [];
    ngOnInit(){
        this.firstName = sessionStorage.getItem('FirstName');
        this.lastName = sessionStorage.getItem('LastName');
        this.Country = sessionStorage.getItem('Country');
        this.Phone = sessionStorage.getItem('Phone');
        this.Email = sessionStorage.getItem('Email');
        this.AboutMe  = sessionStorage.getItem("AboutMe");
        this.id = sessionStorage.getItem('id');
        this.Wallet = sessionStorage.getItem('Wallet');
        refreshScripts();
        this.fetchPurchasesService.fetchClientPurchase('limit').subscribe((data:PurchaseData[])=>{
            this.purchases = data;
            console.log(this.purchases);
            this.loadPurchase=false;
        })

    }

    editAbout(){
        this.editAboutParagraph = !this.editAboutParagraph;

    }
    updateAboutMe(event){
        this.newAboutMe = event;

        console.log(this.newAboutMe);
    }
    saveAbout(){
        this.editAboutParagraph = !this.editAboutParagraph;
        let newAboutMe = new FormData;
        newAboutMe.append('about',this.newAboutMe);
        newAboutMe.append('id',this.id);
        this.aboutMeUpdater.clientAboutMeUpdate(newAboutMe).subscribe((event)=>{
            if(event['status']='success'){
                alert("Your About Me section has been updated");
                sessionStorage.setItem('AboutMe',this.newAboutMe);
            }

        });
    }
}