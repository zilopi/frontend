import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { refreshScripts } from '../../helpers/refreshScripts';
import { Router, ActivatedRoute, PreloadAllModules } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { SearchService } from 'src/app/services/search-service/search.service';
import { Result } from './result';
import { DataStoreService } from './data-store.service';


@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit, OnChanges {

  search: FormGroup;
  sortControl: FormGroup;
  filterIndustry: FormGroup;
  filterInformationType: FormGroup;
  filterInformationFormat: FormGroup;
  locationFocusControl: FormGroup;

  //Control to show the modal
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


  @ViewChild('searchInput', { static: true }) searchInput;
  @ViewChild('content',{static:true}) modal;

  constructor(private router: Router, private route: ActivatedRoute, private searchService: SearchService,private dataStore:DataStoreService) {


  }
  
    
  

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

    let preloadedData:Result[];
    // fetch the data from the resolver
    preloadedData = this.route.snapshot.data.results;

    //Set the data to the datastore
    this.dataStore.setStoreResult(preloadedData);

    // Pagenate the data
    this.updateResultArrays(preloadedData);
    this.pageNumber = 1;
    this.numberOfResults = preloadedData.length;
    this.allResults = preloadedData;



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

      automobiles: new FormControl(false, []),
      aviation: new FormControl(false, []),
      banking: new FormControl(false, []),
      chemicals: new FormControl(false, []),
      agricultureAndAlliedIndustries: new FormControl(false, [])

    });
    this.sortControl = new FormGroup({
      sortType: new FormControl("relevance", [])
    });
    this.filterInformationType = new FormGroup({
      showAll: new FormControl(true, []),
      marketSize: new FormControl(false, []),
      price: new FormControl(false, []),

      costOfProduction: new FormControl(false, []),

      demand: new FormControl(false, []),

      marketValue : new FormControl(false, []),
      uncategorized : new FormControl(false, [])

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


    this.sortControl.get('sortType').valueChanges.subscribe(val=>{
      if(val == 'recent'){
        let convertedDateToTimeStampArray = this.allResults.map((element,index,array)=>{
          element['timestamp'] = (new Date(element.upload_date)).getTime();
          return element;
        })
        convertedDateToTimeStampArray.sort( function(a,b){
          return (b['timestamp'] - a['timestamp'])
        })
        this.updateResultArrays(this.filterArray(this.determineLocationFocusOfArray(convertedDateToTimeStampArray)));
      }

    })
    this.locationFocusControl.get('selectLocationFocus').valueChanges.subscribe((val: string) => {

      // In case of unfocused
      if (val == 'unfocused') {

        this.updateResultArrays(this.allResults);
      } else {


        // console.log("location focus "+val);

        const locationFocusing = this.allResults.filter((element) => {
          // console.log("Location focus "+val + " Element location focus "+element.location_focus);
          if (val.toLowerCase().replace(/ +/g, '') == element.location_focus.toLowerCase().replace(/ +/g, '')) {
            console.log(element);
            return element;

          }
        });
        this.updateResultArrays(locationFocusing);
      }

    });

    this.filterInformationFormat.get('showAllFormats').valueChanges.subscribe(val => {
      if (val == true) {
        this.filterInformationFormat.get('word').patchValue(true);
        this.filterInformationFormat.get('excel').patchValue(true);
        this.filterInformationFormat.get('pdf').patchValue(true);
        this.filterInformationFormat.get('image').patchValue(true);
      } else {
        this.filterInformationFormat.get('word').patchValue(false);
        this.filterInformationFormat.get('excel').patchValue(false);
        this.filterInformationFormat.get('pdf').patchValue(false);
        this.filterInformationFormat.get('image').patchValue(false);

      }
    });

    this.filterInformationType.get('showAll').valueChanges.subscribe(val => {
      if (val == true) {
        this.filterInformationType.get('marketSize').patchValue(true);
        this.filterInformationType.get('price').patchValue(true);
        this.filterInformationType.get('costOfProduction').patchValue(true);
        this.filterInformationType.get('demand').patchValue(true);
        this.filterInformationType.get('marketValue').patchValue(true);
        this.filterInformationType.get('uncategorized').patchValue(true);


      } else {
        this.filterInformationType.get('marketSize').patchValue(false);
        this.filterInformationType.get('price').patchValue(false);
        this.filterInformationType.get('costOfProduction').patchValue(false);
        this.filterInformationType.get('demand').patchValue(false);
        this.filterInformationType.get('marketValue').patchValue(false);
        this.filterInformationType.get('uncategorized').patchValue(false);

      }
    });


    this.filterIndustry.get('selectAllIndustry').valueChanges.subscribe(value => {
      console.log(value);
      if (value == true) {
        this.filterIndustry.get('chemicals').patchValue(true);
        this.filterIndustry.get('aviation').patchValue(true);
        this.filterIndustry.get('banking').patchValue(true);
        this.filterIndustry.get('automobiles').patchValue(true);
        this.filterIndustry.get('agricultureAndAlliedIndustries').patchValue(true);

      } else {
        this.filterIndustry.get('agricultureAndAlliedIndustries').patchValue(false);

        this.filterIndustry.get('chemicals').patchValue(false);
        this.filterIndustry.get('aviation').patchValue(false);
        this.filterIndustry.get('banking').patchValue(false);
        this.filterIndustry.get('automobiles').patchValue(false);
      }
    });

    // Set initial values of the show all controls to true
    this.filterInformationFormat.get('showAllFormats').patchValue(true);
    this.filterIndustry.get('selectAllIndustry').patchValue(true);
    this.filterInformationType.get('showAll').patchValue(true);


    refreshScripts();
    this.showLoading = false;
  }
  ngOnChanges() {

  }


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
    
  }

  searchPromise(query: string): Promise<[]> {
    return new Promise((resolve, reject) => {
      this.searchService.search(query).subscribe((data: any) => {
        resolve(data);
      });

    });
  }

  //Function called by template
  determineLocationFocus() :Result[]{
    let locationFocus = this.locationFocusControl.get('selectLocationFocus').value.toLowerCase().replace(/ +/g, ""); 
    if (locationFocus== 'unfocused' ){
      return this.allResults;
    }else{
      let locationFocusedResult = this.allResults.filter((data:Result)=>{

        if(data.location_focus.toLowerCase().replace(/ +/g, "") == locationFocus ){
          return data;
        }
      });
      return locationFocusedResult;
    }
  }

  //general purpose array functions
  determineLocationFocusOfArray(array:Result[]) :Result[]{
    let locationFocus = this.locationFocusControl.get('selectLocationFocus').value.toLowerCase().replace(/ +/g, ""); 
    if (locationFocus== 'unfocused' ){
      return array;
    }else{
      let locationFocusedResult:Result[] = array.filter((data:Result)=>{

        if(data.location_focus.toLowerCase().replace(/ +/g, "") == locationFocus ){
          return data;
        }
      });
      return locationFocusedResult;
    }
  }
  filterArray(data:Result[]):Result[]{
    const industry = this.filterIndustry.value;
    const typeOfData = this.filterInformationType.value;
    const formatOfData = this.filterInformationFormat.value;
   
    let filters = [];


    //Check for industry
    for (var key in industry) {
      if (industry.hasOwnProperty(key)) {
           if(industry[key]==true){
             filters.push(key.toLowerCase().replace(/ +/g, ""))
           }
      }
    }
    //Check for type of data
    for (var key in typeOfData) {
      if (typeOfData.hasOwnProperty(key)) {
           if(typeOfData[key]==true){
             filters.push(key.toLowerCase().replace(/ +/g, ""))
           }
      }
    }
    //TODO: Format of data
    // console.log(filters);
    let finalResult = data.filter((value:Result)=>{
      console.log(value);
      if(filters.includes(value.information_type.toLowerCase().replace(/ +/g, "")) 
      &&
         filters.includes(value.data_of_industry.toLowerCase().replace(/ +/g, ""))){
        return value;
      }
    })
    return finalResult;
  }


  filter() {
    const industry = this.filterIndustry.value;
    const typeOfData = this.filterInformationType.value;
    const formatOfData = this.filterInformationFormat.value;
    let locationFocusedResult = this.determineLocationFocus();

    let filters = [];

    // console.log(locationFocusedResult);
    // console.log(industry);
    // console.log(typeOfData);
    // console.log(formatOfData);


    //Check for industry
    for (var key in industry) {
      if (industry.hasOwnProperty(key)) {
           if(industry[key]==true){
             filters.push(key.toLowerCase().replace(/ +/g, ""))
           }
      }
    }
    //Check for type of data
    for (var key in typeOfData) {
      if (typeOfData.hasOwnProperty(key)) {
           if(typeOfData[key]==true){
             filters.push(key.toLowerCase().replace(/ +/g, ""))
           }
      }
    }
    //TODO: Format of data
    // console.log(filters);
    let finalResult = locationFocusedResult.filter((value:Result)=>{
      console.log(value);
      if(filters.includes(value.information_type.toLowerCase().replace(/ +/g, "")) 
      &&
         filters.includes(value.data_of_industry.toLowerCase().replace(/ +/g, ""))){
        return value;
      }
    })


    this.updateResultArrays(finalResult);
  }


  resetFilters(){
    this.filterIndustry.reset();
    this.filterInformationFormat.reset();
    this.filterInformationType.reset();
    let locationFocused = this.determineLocationFocus();
    this.updateResultArrays(locationFocused);
  }

  closeResult: string;
  listenForDownload($event){
  
    if(sessionStorage.getItem('id')==null || sessionStorage.getItem('id')==undefined){
      this.showModal = true
      // alert("Open modal");

    }else{
      alert("Download")
    }
  }
  listenForView($event){
    this.dataStore.setData($event);
    this.dataStore.setStoreResult(this.allResults);
    this.router.navigate(['/view'])
  }

  
}


