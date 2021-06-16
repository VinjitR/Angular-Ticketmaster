import { Component, OnInit } from '@angular/core';
import { NgForm,  FormsModule,FormBuilder,FormGroup } from '@angular/forms';
import { HttpClient} from '@angular/common/http';

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
  isDisabled:boolean;

  constructor(private http:HttpClient,private fb:FormBuilder) { 
    this.isDisabled=true;
    this.ticketForm=this.fb.group({
    keyword:[''],
    category:['All'],
    distance:[''],
    units:['miles'],
    location: ['curloc'],
    location2:[{value: '', disabled: this.isDisabled}]})
    this.submitted=false;
    this.display=false;
    this.nodisplay=false;
    this.iploc="";
    this.formData={};
    this.redis=true;
    this.favdis=false;
  }

  ngOnInit(): void{
    this.details="";
    this.http.get("https://ipinfo.io?token=d87014741e8aab")
    .subscribe( response=>{this.iploc=response;
                          console.log(this.iploc.loc);
                        }
    );


    //https://ipinfo.io?token=d87014741e8aab
    //ipinfo call

  }

  onSubmit(){
    if (this.ticketForm.valid){
      if (this.ticketForm.value.distance==''){
        this.ticketForm.value.distance='10';
      }
        this.submitted=true;
        if (this.ticketForm.value.location=='curloc'){
          this.ticketForm.value.location2=this.iploc.loc;
        }
        console.log(this.ticketForm.value)
        this.http.get("http://localhost:8080/getticket",
        {
          params:this.ticketForm.value
        }).subscribe(
          data => { this.details = data;
                  this.submitted=true;
                  if(this.details.page.totalElements=='0'){
                    this.nodisplay=true;
                    this.display=false;
                  }
                  else{
                    this.display=true;
                    this.nodisplay=false;
                  }
                  console.log(this.details);},
                err => console.error(err)
              );
      
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
    this.ticketForm.reset();

  }



  }
