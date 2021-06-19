import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('300ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ]
})
export class FavoritesComponent implements OnInit {

  favorites:any;
  favorite_details:any=[];
  favrecords:boolean=false;
  evedetaildisplay:boolean=false;
  evedetaildisplay2:boolean=true;

  event:any;
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.favorites={ ...localStorage };
    this.loadfav();
    this.evedetaildisplay=false;
    this.event='';
  }
  displayevent(id:string){
    console.log(id);
    this.event=id;
  }
  async loadfav()
  {
    if (this.favorites=={}){
      this.favrecords=false;
    }
    else{
      
      var i=0;
    for (var f in this.favorites){
        await this.getdetails(f,i);
        i++;
    }
    console.log(this.favorite_details);
    this.favrecords=true;
  }
  }

  async getdetails(id:string,i:number){
    var paramobj={"id":id};
    this.http.get('http://localhost:8080/getdetails',
    {
      params:paramobj
    })
    .subscribe(response=>{
      this.favorite_details[i]=response;
    })

    
  }
  del_favor(id:string){
      
      for(let i = 0; i < this.favorite_details.length; ++i){
        if (this.favorite_details[i].id == id) {
            this.favorite_details.splice(i,1);
            localStorage.removeItem(id);
        }
    }
  }
}
