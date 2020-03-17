import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { refreshScripts } from '../../helpers/refreshScripts';
import { Router, ActivatedRoute, PreloadAllModules } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { SearchService } from 'src/app/services/search-service/search.service';
import { Result } from './result';
import { DataStoreService } from './data-store.service';
import { HttpClient } from '@angular/common/http';
import { FetchFileService } from 'src/app/partner-account-module/partner-account-components/partner-data-results/fetchFile.service';
import { fetchPartnerFile } from 'src/app/resources';
import { UpdateWalletAndTransact } from 'src/app/services/update-client-wallet-service/updateWallet.service';




@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute,
              private searchService: SearchService, private dataStore: DataStoreService,
              private Http: HttpClient, private fetchFileService: FetchFileService,
              private transactionService:UpdateWalletAndTransact) {


  }

  search: FormGroup;
  sortControl: FormGroup;
  filterIndustry: FormGroup;
  filterInformationType: FormGroup;
  filterInformationFormat: FormGroup;
  locationFocusControl: FormGroup;

  // Control to show the modal
  showModal = false;

  pageNumber = 1;
  query;
  showLoading = false;
  numberOfResults = 0;

  // Contains the data which is rendered in the DOM
  results: Result[] = [];
  showResults = true;

  // Contains the data in pagenated fashion
  pagenatedResults: Result[][] = [];

  // Contains all the data that is received from the server
  allResults: Result[] = [];

  //
  showBuyModal = false;
  showPurchaseModal = true;
  showCompletedPurchaseModal = false;

  datasetForDownload:Result = null

  @ViewChild('searchInput', { static: true }) searchInput;
  @ViewChild('content', { static: true }) modal;

  closeResult: string;

  /** If these are true, then all of them in a category is shown */
  showAllIndustries = true;
  showAllInformationType = true;
  showAllInformationFormat = true;

  closeTransaction(){
    this.showPurchaseModal = true;
    this.showCompletedPurchaseModal =false;
    this.showBuyModal = false;
    this.datasetForDownload = null;
  }
  //Current wallet amount'
  walletAmount:Number;



  nextPage() {
    window.scrollTo(0, 0);
    if (this.pageNumber < this.pagenatedResults.length) {

      this.pageNumber++;
      this.results = [];

      this.results = this.pagenatedResults[this.pageNumber - 1];


    }
  }
  prevPage() {
    window.scrollTo(0, 0);
    if (this.pageNumber != 1) {
      this.pageNumber--;
      this.results = [];
      this.results = this.pagenatedResults[this.pageNumber - 1];
    }

  }
  ngOnInit() {



    /**  Initial loading when redirected from the landing page */
    this.showLoading = true;

    let preloadedData: Result[];
    // fetch the data from the resolver
    preloadedData = this.route.snapshot.data.results;

    // Set the data to the datastore
    this.dataStore.setStoreResult(preloadedData);

    // Pagenate the data
    this.updateResultArrays(preloadedData);
    this.pageNumber = 1;
    this.numberOfResults = preloadedData.length;
    this.allResults = preloadedData;


    //Set the wallet amount
    this.walletAmount = Number(sessionStorage.getItem('Wallet'));

    console.log(this.results);
    if (this.results.length == 0) {
      this.showResults = false;
    } else {
      this.showResults = true;
    }

    // set initial value in the search box
    this.searchInput.nativeElement.value = this.route.snapshot.params.query;


    this.search = new FormGroup({
      searchInput: new FormControl(null, [])
    });
    this.filterIndustry = new FormGroup({
      selectAllIndustry: new FormControl(true, []),

      automobiles: new FormControl(true, []),
      aviation: new FormControl(true, []),
      banking: new FormControl(true, []),
      chemicals: new FormControl(true, []),
      agricultureAndAlliedIndustries: new FormControl(true, [])

    });
    this.sortControl = new FormGroup({
      sortType: new FormControl('relevance', [])
    });
    this.filterInformationType = new FormGroup({
      showAll: new FormControl(true, []),
      marketSize: new FormControl(true, []),
      price: new FormControl(true, []),

      costOfProduction: new FormControl(true, []),

      demand: new FormControl(true, []),

      marketValue: new FormControl(true, []),
      uncategorized: new FormControl(true, [])

    });
    this.filterInformationFormat = new FormGroup({

      showAllFormats: new FormControl(false, []),

      word: new FormControl(false, []),
      excel: new FormControl(false, []),
      pdf: new FormControl(false, []),
      image: new FormControl(false, []),


    });

    this.locationFocusControl = new FormGroup({
      selectLocationFocus: new FormControl('unfocused', [])
    });
    // subscriptions


    // ** Sorts according to the timestamp  */
    this.sortControl.get('sortType').valueChanges.subscribe(val => {
      if (val == 'recent') {
        const convertedDateToTimeStampArray = this.allResults.map((element, index, array) => {
          // tslint:disable-next-line: no-string-literal
          element['timestamp'] = (new Date(element.upload_date)).getTime();
          return element;
        });
        convertedDateToTimeStampArray.sort(function(a, b) {
          // tslint:disable-next-line: no-string-literal
          return (b['timestamp'] - a['timestamp']);
        });
        this.updateResultArrays(convertedDateToTimeStampArray);
      }

    });
    this.locationFocusControl.get('selectLocationFocus').valueChanges.subscribe((val: string) => {

      // In case of unfocused
      if (val == 'unfocused') {

        this.updateResultArrays(this.allResults);
      } else {


       console.log('location focus set to  ' + val + ' focusing locations for');
       if (val != null) {

          const locationFocusing = this.allResults.filter((element) => {

            if (val.toLowerCase().replace(/ +/g, '') == element.location_focus.toLowerCase().replace(/ +/g, '')) {
              console.log(element);
              return element;

            }
          });

          this.updateResultArrays(locationFocusing);

        }
      }

    });

    this.filterInformationFormat.get('showAllFormats').valueChanges.subscribe(val => {
      if (val == true) {
        this.showAllInformationFormat = true;
        this.filterInformationFormat.get('word').patchValue(true);
        this.filterInformationFormat.get('excel').patchValue(true);
        this.filterInformationFormat.get('pdf').patchValue(true);
        this.filterInformationFormat.get('image').patchValue(true);
      } else {
        this.showAllInformationFormat = true;
        this.filterInformationFormat.get('word').patchValue(false);
        this.filterInformationFormat.get('excel').patchValue(false);
        this.filterInformationFormat.get('pdf').patchValue(false);
        this.filterInformationFormat.get('image').patchValue(false);

      }
    });

   


    // Add listeners to the checkboxes
    let industryCheckboxes = document.querySelectorAll('.value-input-industry');
    industryCheckboxes.forEach((e, i, a)=>{
      // Get the current value of the checkbox
      e.addEventListener('change',(x)=>{
        let value = this.filterIndustry.get(e.getAttribute('formControlName')).value;
        
        if(value == false) {
          this.showAllIndustries = false;
          this.filterIndustry.get('selectAllIndustry').patchValue(false);
        } else if(value == true) {
          // if this checkbox becomes true, check if all  of the checkbox are true or not, if they are then set the showAllIndustries control
          // to true as well
            let setAllIndustryControlToTrue = true;
            for(let i = 0 ; i < industryCheckboxes.length ; i ++) {
                let formControlName = industryCheckboxes[i].getAttribute('formControlName');
                let formControlValue = this.filterIndustry.get(formControlName).value;
                if(formControlValue == false) {
                  setAllIndustryControlToTrue = false;
                  break
                }
            }
            this.showAllIndustries = setAllIndustryControlToTrue;
            this.filterIndustry.get('selectAllIndustry').patchValue(setAllIndustryControlToTrue);
        }
      })
    })

    let informationTypeCheckboxes = document.querySelectorAll('.value-input-type');
    informationTypeCheckboxes.forEach((e, i, a)=>{
      // Get the current value of the checkbox
      e.addEventListener('change',(x)=>{
        let value = this.filterInformationType.get(e.getAttribute('formControlName')).value;
        
        if(value == false) {
          this.showAllInformationType = false;
          this.filterInformationType.get('showAll').patchValue(false);
        } else if(value == true) {
          // if this checkbox becomes true, check if all  of the checkbox are true or not, if they are then set the showAllIndustries control
          // to true as well
            let setAllControlToTrue = true;
            for(let i = 0 ; i < informationTypeCheckboxes.length ; i ++) {
                let formControlName = informationTypeCheckboxes[i].getAttribute('formControlName');
                let formControlValue = this.filterInformationType.get(formControlName).value;
                if(formControlValue == false) {
                  setAllControlToTrue = false;
                  break;
                }
            }
            this.showAllInformationType = setAllControlToTrue;
            this.filterInformationType.get('showAll').patchValue(setAllControlToTrue);
        }
      })
    })

    // Set initial values of the show all controls to true
    this.filterInformationFormat.get('showAllFormats').patchValue(true);
    this.filterIndustry.get('selectAllIndustry').patchValue(true);
    this.filterInformationType.get('showAll').patchValue(true);

 
    refreshScripts();
    this.showLoading = false;
    this.showAllIndustries = true;
    this.showAllInformationType = true;
  }

  // Toggle the industries via a function not through subscription
  toggleIndustries() {
    this.showAllIndustries = !this.showAllIndustries;
    if (this.showAllIndustries == true) {
      // this.showAllIndustries = true;
      this.filterIndustry.get('chemicals').patchValue(true);
      this.filterIndustry.get('aviation').patchValue(true);
      this.filterIndustry.get('banking').patchValue(true);
      this.filterIndustry.get('automobiles').patchValue(true);
      this.filterIndustry.get('agricultureAndAlliedIndustries').patchValue(true);

    } else {
      // this.showAllIndustries = false;
      this.filterIndustry.get('agricultureAndAlliedIndustries').patchValue(false);
      this.filterIndustry.get('chemicals').patchValue(false);
      this.filterIndustry.get('aviation').patchValue(false);
      this.filterIndustry.get('banking').patchValue(false);
      this.filterIndustry.get('automobiles').patchValue(false);
    }
  }
  toggleInformationType(){
    this.showAllInformationType = !this.showAllInformationType;
    if (this.showAllInformationType == true) {
      // this.showAllInformationType = true;
      this.filterInformationType.get('marketSize').patchValue(true);
      this.filterInformationType.get('price').patchValue(true);
      this.filterInformationType.get('costOfProduction').patchValue(true);
      this.filterInformationType.get('demand').patchValue(true);
      this.filterInformationType.get('marketValue').patchValue(true);
      this.filterInformationType.get('uncategorized').patchValue(true);


    } else {
      // this.showAllInformationType = false;
      this.filterInformationType.get('marketSize').patchValue(false);
      this.filterInformationType.get('price').patchValue(false);
      this.filterInformationType.get('costOfProduction').patchValue(false);
      this.filterInformationType.get('demand').patchValue(false);
      this.filterInformationType.get('marketValue').patchValue(false);
      this.filterInformationType.get('uncategorized').patchValue(false);

    }
  }
 


  /**Pagenates the results and updates the main array from which the template renders the results */
  updateResultArrays(data: Result[]) {
    // this.allResults = data;
    this.numberOfResults = data.length;
    if (data.length > 4) {
      const container = [];
      let temp = [];
      for (let i = 0; i < data.length; i++) {

        if ((i + 1) % 4 == 0) {
          temp.push(data[i]);
          container.push(temp);

          temp = [];
        } else {
          temp.push(data[i]);
        }
      }
      container.push(temp);
      this.pagenatedResults = container;
      this.results = container[0];
      console.log(this.pagenatedResults);


    } else {
      this.results = data;
      this.pagenatedResults = [];
      this.pagenatedResults[0] = this.results;
      console.log(this.pagenatedResults);
    }
  }

  /**Gets the query from the user and updates the layout */
  searchQuery() {
    this.showLoading = true;
    const q = this.searchInput.nativeElement.value;
    this.showLoading = true;
    this.searchPromise(q).then((data: []) => {
      this.updateResultArrays(data);
      this.pageNumber = 1;
      this.showLoading = false;
      this.allResults = data;
    });

    this.locationFocusControl.reset();
    this.filterIndustry.reset();
    this.filterInformationType.reset();
    this.filterInformationFormat.reset();
    this.allResults = [];
    this.pagenatedResults = [];
    this.filterInformationFormat.get('showAllFormats').patchValue(true);
    this.filterIndustry.get('selectAllIndustry').patchValue(true);
    this.filterInformationType.get('showAll').patchValue(true);

  }

  /**Async implementation for the search */
  searchPromise(query: string): Promise<[]> {
    return new Promise((resolve, reject) => {
      this.searchService.search(query).subscribe((data: any) => {
        resolve(data);
      });

    });
  }

  /**Listen for download event from the search result
   * Show the required modals
  */
  

  //TODO: The final wallet price is reduced twice, fix that
 showLowBalanceModal = false;
 closeLowBalanceModal(){
   this.showBuyModal = false;
   this.showPurchaseModal = true;
   this.showLowBalanceModal = false;
 }
  listenForDownload($event) {

    if (sessionStorage.getItem('id') == null || sessionStorage.getItem('id') == undefined || sessionStorage.getItem('AccountType')=='Partner') {
      this.showModal = true;
      // alert("Open modal");

    } else {
      // alert("Download")
      this.datasetForDownload = $event;
      if(this.checkBalance()==true){

        //If the balance is low then show the low balance modal
      this.showBuyModal = true;
      this.showCompletedPurchaseModal = false;
      this.showPurchaseModal = false;
      this.showLowBalanceModal = true;


    }else{
      //if the balance is optimal then show the regular buy modal
      this.showBuyModal = true;
      this.showPurchaseModal = true;
    }
      // this.fetchFile($event);
    }
  }

  /** Listen for the view event from the search result */
  listenForView($event) {
    this.dataStore.setData($event);
    this.dataStore.setStoreResult(this.allResults);
    this.router.navigate(['/view']);
  }
  
  //Convert the values for template
  convertValueToString(walletAmount,price):string{
    return (Number(walletAmount)-Number(price)).toString();
  }

  /**initiaite the download from the buy modal */
  initiateDownload(){
  
    // this.fetchFile(this.datasetForDownload);
    this.transactionService.transaction(sessionStorage.getItem('id'),this.datasetForDownload.id,sessionStorage.getItem('Wallet'),this.datasetForDownload.price).subscribe(data=>{
      if(data['status']=='ok'){
      this.showCompletedPurchaseModal= true;
      this.showPurchaseModal = false;
      let updatedBalance = parseInt(sessionStorage.getItem('Wallet')) - Number(this.datasetForDownload.price);
      sessionStorage.setItem('Wallet',updatedBalance.toString());
      this.walletAmount = updatedBalance;
      this.fetchFile(this.datasetForDownload);
      this.datasetForDownload.purchased = true;
    }else if(data['status']=='balance'){
      //TODO: Show modal that there is not enough balance
    }
      // this.datasetForDownload = null;
    })
  }
  checkBalance():Boolean{
    if((Number(this.walletAmount) - Number(this.datasetForDownload.price))<0){
      return true;
    }else{
      return false;
    }
  }
  directDownload($event:Result){
    this.fetchFile($event)
  }

  fetchFile(Result: Result) {
    const file = new FormData;
    file.append('mime', Result.mime);
    file.append('uri', Result.url);

    this.Http.post(fetchPartnerFile, file, {
      responseType: 'text'
    }
    ).subscribe((data: string) => {

      /**This gets the signed url required for download of the file */


      /**This is the internal code require to dispose the file in download form */
      this.showFile(data, Result);
    });

  }
  public showFile(value, Result: Result): void {
    this.fetchFileService.fetchFile(value)
      .subscribe(x => {
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        const newBlob = new Blob([x], { type: Result.mime });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }

        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = data;

        // if the mime type is of application,then the extension is added via the database column
        if (Result.mime.includes('application')) {
          link.download = Result.title + '.' + Result.extension;
        } else {
          link.download = Result.title;
        }


        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        setTimeout(function() {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      });
  }



  // Filter called by the template
  callFilter() {
    this.locationFocusControl.get('selectLocationFocus').patchValue('Unfocused');
    this.sortControl.get('sortType').patchValue('Relevance');
    this.updateResultArrays(this.filter(this.allResults));

  }

  // General purpose function
  filter(data:Result[]):Result[] {
    console.log("Filters")
    console.log(this.showAllIndustries , this.showAllInformationType)

    // If both the show all controls are true,then dont filter anything
    if(this.showAllIndustries == true && this.showAllInformationType == true) {
      
      return this.allResults;
    } else {
      let industries = this.filterIndustry.value;
      let informationType = this.filterInformationType.value;

      let filters = [];
      let industryKeys = Object.keys(industries);
      let informationTypeKeys = Object.keys(informationType);

      for( var i of industryKeys) {
        if(industries[i] == true) {
          console.log("pushing industry "+i)
          filters.push(i.toLowerCase().replace(/ /g, ""))
        }
      }
      for(var i of informationTypeKeys) {
        if(informationType[i] == true) {
          console.log("pushing information type "+i)

          filters.push(i.toLowerCase().replace(/ /g, ""));
        }
      }
      console.log(filters);

      let filteredResults = data.filter((element)=>{
        if(this.showAllIndustries==false && this.showAllInformationType == true) {
          if(filters.includes(element.information_type.toLowerCase().replace(/ /g, ""))) {
            return element;
          }
        } else if(this.showAllIndustries == true && this.showAllInformationType == false) {
          if(filters.includes(element.data_of_industry.toLowerCase().replace(/ /g, ""))) {
            return element;
          }
        }
      })

      return filteredResults;
    }
  }
}


