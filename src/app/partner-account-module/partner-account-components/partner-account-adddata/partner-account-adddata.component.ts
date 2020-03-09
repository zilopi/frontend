import { Component, OnChanges, AfterViewChecked, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {requiredFileType} from '../../../helpers/requireFileType';
import { PartnerDataUploadService } from 'src/app/services/upload-partner-data-service/upload-partner-data-service';
import { HttpEventType } from '@angular/common/http';
import {refreshScripts} from '../../../helpers/refreshScripts';
import { countries } from 'src/app/resources';
@Component({
    selector: 'app-partner-adddata',
    templateUrl: 'partner-account-adddata.component.html',
    styleUrls: ['partner-account-adddata.component.css'],
})
export class PartnerAccountAddDataComponent implements AfterViewChecked, OnChanges , OnInit {
    
    
    Price:FormGroup;
    
    selectIndustry: FormGroup;
    uploadDataType: FormGroup;
    uploadData: FormGroup;
    topManufacturingCountries: FormGroup;
    topManufacturingCompanies: FormGroup;
    marketsForDemand: FormGroup;
    specificChallenges: FormGroup;
    uploadDataViaExcel: FormGroup;
    typesOfData: FormGroup;

    // Keeps track of the progess of the data input
    step;
    showChemicalCASCodeFeild = false;
    // 1 = choose Upload, 2 = upload via Excel, 3 = fill form
    step_2;



    // Full Excel File Upload
    fullExcelFile = null;
    costDataFile = null;
    priceDataFile = null;

    // Data Inputs
    industryOfData = null;
    descriptionOfData = null;
    itemName = null;
    itemGrade = null;
    CAS = null;
    marketSize = null;
    manufacturingCountries = [];
    manufacturingCompanies = [];
    demandCountries = [];
    expertise = null;
    costData = null;
    priceData = null;
    excelData = null;

    generatedFormForUpload: FormGroup;

    // Types of Data Inputs to show
    generateFeilds = false;
    showCostData = false;
    showPrice = false;
    showMarketSize = false;
    showTopMarkets = false;
    showTopMakers = false;
    showDemandMarkets = false;
    showYourExpertise = false;


    // scriptL load check
    scriptLoaded = false;

    // Data inputs
    TypeOfInputs = ['Cost Data', 'Price', 'Market Size',
     'Top Manufacturing countries', 'Top Manufacturing companies',
     'Demand Markets', 'Your Expertise'];
    TypesOfDataFeildsSelected = [];

     prev;

    // To track upload progress
    uploadProgress = 0;
    
    // To show the upload section
    showUpload = false;


    //Contains coutries
    countries;
    
    constructor(private uploadService: PartnerDataUploadService) {

        // Initially the step1 is initialized
        this.step = 1;
        this.step_2 = 1;

        this.countries = countries;
        //
        this.Price = new FormGroup({
            setPrice:new FormControl(1.00,[Validators.required]),
            setCurrency : new FormControl('USD',[Validators.required])
        })
        //
        this.generatedFormForUpload = new FormGroup({

            costInput: new FormControl(null),
            priceInput: new FormControl(null),
            marketSizeInput : new FormControl(null),
            demandMarketInput : new FormControl(null),
            manufacturingCompaniesInput: new FormControl(null),
            manufacturingCountriesInput: new FormControl(null),
            expertiseInput: new FormControl(null),
        });

        //
        this.typesOfData = new FormGroup({
            dataFeildInput : new FormControl(null),
        });

        // 
        this.selectIndustry = new FormGroup({
            selectIndustryInput : new FormControl('Logistics', [Validators.required]),
            descriptionOfItem : new FormControl(null, [Validators.required]),
            itemName: new FormControl(null,[Validators.required]),
            itemGrade : new FormControl(null, []),
            CAS : new FormControl(null, []),
            setLocationFocus : new FormControl('Unfocused',[Validators.required]),
            setTypeOfData : new FormControl('None',[Validators.required])

        });
        this.uploadDataType = new FormGroup({

        });

        // Step 2 Input Controls
        this.uploadData = new FormGroup({
            costOfData: new FormControl(null, [Validators.required]),
            currencyFormat : new FormControl(null, [Validators.required]),
            unitsFormat : new FormControl(null, [Validators.required]),
            demand : new FormControl(null, [Validators.required]),
            demandFormat : new FormControl(null, [Validators.required])
        });
        this.topManufacturingCountries = new FormGroup({
            manufacturingCountries : new FormControl(null, [Validators.required])
        });
        this.topManufacturingCompanies = new FormGroup({
            manufacturingCompanies : new FormControl(null, [Validators.required])
        });
        this.marketsForDemand = new FormGroup({
            marketDemand : new FormControl(null, [Validators.required])
        });
        this.specificChallenges = new FormGroup({
            challenges : new FormControl(null, [Validators.required])
        });
        this.uploadDataViaExcel = new FormGroup({
            excelData : new FormControl(null, [Validators.required])
        });
        this.selectIndustry.get('selectIndustryInput').valueChanges.subscribe(val => {

            // console.log("change");
            if (this.step == 1) {

                const x = this.selectIndustry.get('selectIndustryInput').value;
                console.log(x);
                if (x == 'Chemical') {
                    this.showChemicalCASCodeFeild = true;
                } else {
                    this.showChemicalCASCodeFeild = false;
                }
            }
        });
    }


    //To get the size of main excel file
    fileSize = 0;
    setFullExcelFile(event) {
        this.fullExcelFile = event.srcElement.files;
        // console.log("File size "+ ((this.fullExcelFile[0].size/1024)/1024).toFixed(2));
        this.fileSize = Number(((this.fullExcelFile[0].size/1024)/1024).toFixed(2));
    }
    setCostPriceFile(event){
        this.costDataFile = event.srcElement.files;

    }
    setPriceDataFile(event){
        this.priceDataFile = event.srcElement.files;
    }


    // Update the DOM when the transition takes place between steps
    ngAfterViewChecked() {
           
    }
    ngOnInit(){
        refreshScripts();
    }
   

    ngOnChanges() {

    }
    reload(){
        // reload
    }
    // Functions to Fetch Data From Froms STEP 1
    getIndustryOfData() {
       this.industryOfData = this.selectIndustry.get('selectIndustryInput').value;
       this.descriptionOfData = this.selectIndustry.get('descriptionOfItem').value;
       this.itemGrade = this.selectIndustry.get('itemGrade').value;
       if (this.showChemicalCASCodeFeild == true) {
           this.CAS = this.selectIndustry.get('CAS').value;
       } else {
           this.CAS = null;
       }
       this.itemName = this.selectIndustry.get('itemName').value;
       // Increase the progress
       this.step = 2;
       console.log(this.industryOfData);
    }


    // Function to fetch data from generated form
    getDataFromGeneratedForm() {
        this.costData = this.generatedFormForUpload.get('costInput').value;

        console.log(this.generatedFormForUpload.get('costInput'));
        this.priceData = this.generatedFormForUpload.get('priceInput').value;
        this.marketSize = this.generatedFormForUpload.get('marketSizeInput').value;
        this.expertise = this.generatedFormForUpload.get('expertiseInput').value;
        this.step++;
        


     }
     getExcelUpload() {

        // fetch the metadata required for the file
        this.excelData = this.uploadDataViaExcel.get('excelData').value;
        console.log(this.excelData);
        this.step++;
        refreshScripts();
     }

    // Control Step 2 Flow
    inputDataViaExcel() {
        this.step_2 = 2;
        refreshScripts();
    }
    inputDataViaForm() {
        this.step_2 = 3;
        refreshScripts();
    }

    // Function to generate the feilds
    addDataFeild() {
        const x = this.typesOfData.get('dataFeildInput').value;
        console.log(x);
        if (x != null) {
            // this.prev = x;
            this.TypesOfDataFeildsSelected.push(x);
            for (let i = 0 ; i < this.TypesOfDataFeildsSelected.length; i++) {
            const x = this.TypesOfDataFeildsSelected[i];
            for (let j = 0; j < this.TypeOfInputs.length; j++) {
                if (x == this.TypeOfInputs[j]) {
                    this.TypeOfInputs.splice(j, 1);
                }
            }

        }} else {
            // this.typesOfData.get('dataFeildInput').setValue(this.prev);
        }
        this.typesOfData.get('dataFeildInput').reset();
        this.typesOfData.get('dataFeildInput').setValue(this.TypeOfInputs[0]);
        refreshScripts();
    }
    generateDataFeilds() {
        this.generateFeilds = true;
        for (let i = 0 ; i < this.TypesOfDataFeildsSelected.length; i++) {
            switch (this.TypesOfDataFeildsSelected[i]) {
                case 'Cost Data':
                    this.showCostData = true;
                    break;
                case 'Price':
                    this.showPrice = true;
                    break;
                case 'Market Size':
                    this.showMarketSize = true;
                    break;
                case 'Top Manufacturing countries':
                    this.showTopMarkets = true;
                    break;
                case 'Top Manufacturing companies':
                    this.showTopMakers = true;
                    break;
                case 'Demand Markets':
                    this.showDemandMarkets = true;
                    break;
                case 'Your Expertise':
                    this.showYourExpertise = true;
                    break;

            }
        }
        this.TypesOfDataFeildsSelected = [];
        refreshScripts();
    }


    // Countries and Companies addition
    manufacturingCountriesAddition() {
      const countries = this.generatedFormForUpload.get('manufacturingCountriesInput').value;

      console.log(countries);
      if (countries != null) {
        this.manufacturingCountries.push(countries); }
    }
    manufacturingCompaniesAddition() {
        const companies = this.generatedFormForUpload.get('manufacturingCompaniesInput').value;
        console.log(companies);

        if (companies != null) {
            this.manufacturingCompanies.push(companies); }
    }
    demandCountriesAddition() {
        const demandCountries = this.generatedFormForUpload.get('demandMarketInput').value;
        console.log(demandCountries);
        if (demandCountries != null) {
             this.demandCountries.push(demandCountries); }
    }


    // get viewchilds
    @ViewChild('itemName',{static:true}) itemNameInput;
    backStep(){
        
        if(this.step>2){
            this.step--;
        }else if(this.step==2){
            if(this.step_2!=1){
                // this.step_2--;
                if(this.step_2==3){
                    this.step_2=1;
                }else{
                    this.step_2--;
                }
            }else if(this.step_2 == 1){
                this.step = 1;
            }
        }
        if(this.step == 1){

            this.selectIndustry.get('selectIndustryInput').patchValue(this.industryOfData);
            
            // document.getElementById('itemName').click();
        
        }
        
        refreshScripts(); 
       }
    uploadSuccess=null;
    sendToServer() {

        const formData = new FormData;
        
        //Set optional feilds to null if empty
        formData.append('CAS',this.CAS ? "": null);
        formData.append('ItemGrade',this.itemGrade ? "" : null);

        
        formData.append('Description',this.descriptionOfData);
        formData.append('Industry',this.industryOfData);
        formData.append('Id',sessionStorage.getItem('id'));
        formData.append('ItemName',this.itemName);
        formData.append('Price',this.Price.get('setPrice').value);
        formData.append('Currency',this.Price.get('setCurrency').value)
        formData.append("LocationFocus",this.selectIndustry.get('setLocationFocus').value);
        formData.append("TypeOfData",this.selectIndustry.get('setTypeOfData').value);

        // Upload file via excel
        this.showUpload = true;
        if (this.step_2 == 2) {
            formData.append('DataFile', this.fullExcelFile[0]);
            console.log(formData);
            this.uploadService.uploadExcelFile(formData).subscribe(
                (event) => {

                if ( event.type === HttpEventType.UploadProgress ) {
                    this.uploadProgress = Math.round((100 * event.loaded) / event.total);
                    console.log(this.uploadProgress);
                  }

                if ( event.type === HttpEventType.Response ) {
                    console.log(event.body);
                    // this.signup.reset();
                  }
                if(event['status']==200){
                    console.log("Success");
                    this.uploadSuccess = true;
                }

            }
            );
        } else {
            // Upload via form filled
            // Data that is input by the user is sent to the server using this function


            let demandCountriesString = this.demandCountries.join(';');
            let manufacturingCompaniesString = this.manufacturingCompanies.join(';');
            let manufacturingCountriesString = this.manufacturingCountries.join(';');

            if(demandCountriesString.length==0){
                demandCountriesString = null;
            }
            if(manufacturingCompaniesString.length ==0){
                manufacturingCompaniesString = null;
            }
            if(manufacturingCountriesString.length==0){
                manufacturingCountriesString = null;
            }

            //Append array type data
            formData.append('DemandCountries',demandCountriesString);
            formData.append('ManufacturingCountries',manufacturingCountriesString);
            formData.append('ManufacturingCompanies',manufacturingCompaniesString);

            //Set files for upload
            formData.append('CostPriceFile',this.costDataFile[0]);
            formData.append('PriceDataFile',this.priceDataFile[0]);

            //Add additional Data
            formData.append('Expertise',this.generatedFormForUpload.get('expertiseInput').value);
            formData.append('MarketSize',this.generatedFormForUpload.get('marketSizeInput').value);

            this.uploadService.uploadData(formData).subscribe(

                (event) => {

                    if ( event.type === HttpEventType.UploadProgress ) {
                        this.uploadProgress = Math.round((100 * event.loaded) / event.total);
                        console.log(this.uploadProgress);
                      }
    
                    if ( event.type === HttpEventType.Response ) {
                        console.log(event.body);
                        // this.signup.reset();
                      }
                    if(event['status']==200){
                        console.log("Success");
                        this.uploadSuccess = true;
                    }
    
                }
            )
        }
    }

    
    
}
