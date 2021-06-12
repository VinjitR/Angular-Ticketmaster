import { Component } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-ticketform',
  templateUrl: './ticketform.component.html',
  styleUrls: ['./ticketform.component.css']
})
export class TicketformComponent {

  constructor(private http:HttpClient){}
  
  submit(ticket: any){
    console.log(ticket)
    // this.http.request("GET","http:localhost:8080/getticket",{params:ticket})
    this.http.get("https://csci571-rsbv-hw7.wl.r.appspot.com/getticket", {
      params:ticket,
    })
    .toPromise()
    .then(response => {
      console.log(response);
    })
  }
}
