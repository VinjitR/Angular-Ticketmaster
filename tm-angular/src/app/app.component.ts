import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  keyword:string;
  category: string;
  distance: string;
  units: string;
  location: string;
  location2: string;
  display:boolean;
  nodisplay:boolean;
  iploc:any;
  formData:any={};
  redis:boolean;
  favdis:boolean;


  constructor(private http:HttpClient) { 
    this.keyword='';
    this.category='All';
    this.distance='';
    this.units='miles';
    this.location='curloc';
    this.location2='';
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

  onSubmit(form:NgForm){
    if (form.valid){
      if (form.value.distance==''){
        form.value.distance='10';
      }
        this.submitted=true;
        if (form.value.location=='curloc'){
          form.value.location2=this.iploc.loc;
        }
        console.log(form.value)
        this.http.get("http://localhost:8080/getticket",
        {
          params:form.value
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

  onReset(form:NgForm){
    form.resetForm();
    this.display=false;

  }



  }
