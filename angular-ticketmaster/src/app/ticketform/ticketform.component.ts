import { Component, Output } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-ticketform',
  templateUrl: './ticketform.component.html',
  styleUrls: ['./ticketform.component.css']
})
export class TicketformComponent {

  
  isEnabled: boolean;

  @Output() detailsdata: any;


  ticketForm=new FormGroup({
    keyword:new FormControl(),
    Category:new FormControl(),
    Distance:new FormControl(),
    Units:new FormControl(),
    location: new FormControl(),
    location2:new FormControl()
  })


  constructor(private http:HttpClient){
    this.isEnabled = true;
    this.detailsdata="";
    
  }
  
  onSubmit(){
    console.log(this.ticketForm.value);
  }

  submit(ticket: any){
    console.log(ticket)
    // this.http.request("GET","http:localhost:8080/getticket",{params:ticket})
    this.http.get("https://csci571-rsbv-hw7.wl.r.appspot.com/getticket", {
      params:ticket,
    })
    .toPromise()
    .then(response => {
      this.detailsdata=response;
      
      console.log(response);
    })
    
  }

  enableField(){
    this.isEnabled = !this.isEnabled;
    console.log(this.isEnabled);
  }
}
