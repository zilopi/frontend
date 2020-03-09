import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../../../../assets/canvasjs.min.js';
import { UpdateAboutMeService } from 'src/app/services/account-service/aboutMeUpdate-service/aboutMeUpdate-service.js';
import { DataService } from 'src/app/services/component-data-share-service/data-share.service.js';
@Component({
    selector: 'app-partner-dashboard',
    templateUrl : 'partner-account-dashboard.html',
    styleUrls : ['partner-account-dashboard.css']
})
export class PartnerAccountDashboardComponent implements OnInit {
    constructor(private aboutMeUpdater:UpdateAboutMeService, private dataService:DataService){

    }
    firstName;
    lastName;
    email;
    country;
    phone;
    linkedIn;
    editAboutParagraph = false;
    AboutMe;
    id;
    rating;
    industry:string;
    industryArray:String[]
        newAboutMe;
    ngOnInit() {
        
        this.firstName = sessionStorage.getItem('FirstName');
        this.lastName = sessionStorage.getItem('LastName');
        this.email = sessionStorage.getItem('Email');
        this.country = sessionStorage.getItem('Country');
        this.phone = sessionStorage.getItem('Phone');
        this.linkedIn = sessionStorage.getItem('LinkedIn');
        this.AboutMe = sessionStorage.getItem('AboutMe');
        this.id = sessionStorage.getItem('id');
        this.rating = sessionStorage.getItem('Rating');
        
        //Split industry at index '<>' when using
        this.industry = sessionStorage.getItem('Industry');
        this.industryArray = this.industry.split('<>');

        // this.dataService.id.subscribe(data=>{
        //     console.log(data);
        // })
        // console.log("About Me "+this.AboutMe)

        let chart = new CanvasJS.Chart("chartContainer", {
            theme: "light2",
            animationEnabled: true,
            exportEnabled: true,
            title:{
                text: "Downloads form Countries"
            },
            data: [{
                type: "pie",
                showInLegend: true,
                toolTipContent: "<b>{name}</b>: {y} (#percent%)",
                indexLabel: "{name} - #percent%",
                dataPoints: [
                    { y: 450, name: "Iran" },
                    { y: 120, name: "Afganistan" },
                    { y: 300, name: "Ukraine" },
                    { y: 800, name: "Australia" },
                    { y: 150, name: "India" },
                    { y: 150, name: "Honduras"},
                    { y: 250, name: "Zimbabwe" }
                ]
            }]
        });
            
        chart.render();

        let chart2 = new CanvasJS.Chart("chartContainer2", {
            theme: "light2",
            animationEnabled: true,
            exportEnabled: true,
            title:{
                text: "Industry Distribution"
            },
            data: [{
                type: "pie",
                showInLegend: true,
                toolTipContent: "<b>{name}</b>: {y} (#percent%)",
                indexLabel: "{name} - #percent%",
                dataPoints: [
                    { y: 450, name: "Cars" },
                    { y: 120, name: "Aeronautics" },
                    { y: 300, name: "Agriculture" },
                    { y: 800, name: "Organic" },
                    { y: 150, name: "Food" },
                    { y: 150, name: "Transportation"},
                    { y: 250, name: "Military" }
                ]
            }]
        });
            
        chart2.render();
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
            this.aboutMeUpdater.partnerAboutMeUpdate(newAboutMe).subscribe((event)=>{
                if(event['status']='success'){
                    alert("Your About Me section has been updated");
                    sessionStorage.setItem('AboutMe',this.newAboutMe);
                }

            });
            
        }
}
