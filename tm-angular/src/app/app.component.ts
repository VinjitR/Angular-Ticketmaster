import { Component, OnInit ,Injectable} from '@angular/core';
import { Validators,FormBuilder,FormGroup, AbstractControl } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { Observable,of } from 'rxjs';
import {map, startWith,switchMap,filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Service {
  constructor(private http: HttpClient) { }

  opts:any = [];

  getData(value:string) {
        this.http.get(environment.apiUrl+"/auto_complete",{
      params:{"keyword":value}
    })
    .subscribe(response=>{this.opts=response;});
    return of(this.opts);
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular-ticketmaster';
  submitted:boolean;
  details:any="";
  // keyword:string;
  // category: string;
  // distance: string;
  // units: string;
  // location: string;
  // location2: string;
  display:boolean;
  nodisplay:boolean;
  iploc:any;
  formData:any={};
  redis:boolean;
  favdis:boolean;
  ticketForm:FormGroup;
  isDisabled:boolean=true;
  errorinfo:boolean=false;
  clicked:boolean=true;
  progress:boolean=true;
  formvalidcheck:boolean=false;


  filteredOptions: Observable<any> | any;




  constructor(private http:HttpClient,public fb:FormBuilder,private service:Service) { 

    this.ticketForm=this.fb.group({
      keyword:['',[Validators.required, this.noWhitespaceValidator]],
      category:['All'],
      distance:[''],
      units:['miles'],
      location: ['curloc'],
      location2:[{value: '', disabled: this.isDisabled},[Validators.required]]});
    
    this.submitted=false;
    this.display=false;
    this.nodisplay=false;
    this.iploc="";
    this.formData={};
    this.redis=true;
    this.favdis=false;
    
  }

  ngOnInit(): void{

    this.ticketForm=this.fb.group({
      keyword:['',[Validators.required, this.noWhitespaceValidator]],
      category:['All'],
      distance:[''],
      units:['miles'],
      location: ['curloc'],
      location2:[{value: '', disabled: this.isDisabled},[Validators.required]]});
      this.ticketForm.controls.location2.disable();

    this.details="";

    //iploc
    this.http.get("https://ipinfo.io?token=d87014741e8aab")
    .subscribe( response=>{this.iploc=response;
                          console.log(this.iploc.loc);
                        }
    );


    //https://ipinfo.io?token=d87014741e8aab
    //ipinfo call
    //Autocomplete
    this.filteredOptions = this.ticketForm.controls.keyword.valueChanges.pipe(
      // debounceTime(2000),
      startWith(''),
      switchMap(value => this._filter(value))
    );
      
  }

  public noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}



  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    // if (value.length == 0 ){
    //   return [];
    // }
    // else {
      return this.http.get(environment.apiUrl+"/auto_complete",{
        params:{"keyword":value}
      }).pipe(
        filter(data => !!data),
        map(data => {
          console.log(data);
          // let fo= data.filter((option:any) =>{
          //   option.name.toLowerCase().includes(filterValue)});
            
            return data;         
           })
      );
    // }
   
  }

    
    // this.http.get("http://localhost:8080/auto_complete",{
    //   params:{"keyword":value}
    // })
    // .subscribe(response=>{this.options_data=response;})
    // for (var o of this.options_data){
    //   this.options=o.name;
    // }
    // return this.options.filter((option:string) => option.toLowerCase().includes(filterValue));
    
  




  onSubmit(){
    console.log(this.ticketForm.valid)
    if (this.ticketForm.valid){
      this.formvalidcheck=false;
      if (this.ticketForm.value.distance==''){
        this.ticketForm.value.distance='10';
      }
        this.submitted=true;
        if (this.ticketForm.value.location=='curloc'){
          this.ticketForm.value.location2=this.iploc.loc;
        }
        console.log(this.ticketForm.value)
        this.http.get(environment.apiUrl+"/getticket",
        {
          params:this.ticketForm.value
        }).subscribe(
          data => { 
                  // data._embedded['events'].sort(function(a:any,b:any){
                  //   return new Date(a.dates.start.localDate) - new Date(b.dates.start.localDate);
                  // })
                  console.log(data);
                  this.details=data;
                  
                  if (this. details.events!=undefined &&this.details.events.length!=0 ){
                    this.display=true;
                      this.nodisplay=false;
                      
                    }
                  else if(this.details.error==true){
                    this.errorinfo=true;
                  }
                    else{
                      this.nodisplay=true;
                      this.display=false;
                      
                    }
                    this.progress=false;
                  
                  console.log(this.details);},
                err => {console.log(err);
                  this.progress=false;
                  this.errorinfo=true;}
              );
      
    }
    else{
      this.formvalidcheck=true
    }
  }

  // changeDisabled(){
  //   if(this.ticketForm.value.location=="curloc"){
  //     this.isDisabled=true;
  //     console.log(this.isDisabled);
  //   }
  //   else if (this.ticketForm.value.location=="othloc"){
  //     this.isDisabled=false;
  //   }



  //}

  onReset(){
    this.submitted=false;
    this.ngOnInit();
    this.errorinfo=false;
    this.formvalidcheck=false;




  }
}
