import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

@Component({
  selector: 'app-evedetails',
  templateUrl: './evedetails.component.html',
  styleUrls: ['./evedetails.component.css']
})
export class EvedetailsComponent implements OnInit {
@Input() eventdetailsid:any;


infoselect: boolean=true;
artistselect: boolean = false;
venueselect: boolean = false;
detailsInfo:any={};
spotifyInfo:any={};
detailsready:boolean=false;
artistsInfo:any={"artists":{"items":null}}

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.loadeventdetails();
    this.infoselect=true;
    this.artistselect=false;
    this.venueselect=false;
  }
  async loadeventdetails(){
    var paramobj={"id":this.eventdetailsid};
    this.http.get('http://localhost:8080/getdetails',
    {
      params:paramobj
    }).subscribe(resposnse=>{console.log(resposnse);
      this.detailsInfo=resposnse;
    this.detailsready=true;
    this.loadSptDet();});

    

}
async loadSptDet(){
  console.log('spotify');
  var paramobj={"Keyword":this.detailsInfo._embedded.attractions[0].name};
    this.http.get('http://localhost:8080/spotify',
    {
      params:paramobj
    }).subscribe(response=>{
      this.artistsInfo=response;
      // for( let i of this.artistsInfo.artists.items){
      //   // if (i.name.toLowerCase()==this.detailsInfo._embedded.attractions[0].name.toLowerCase()){
      //   //   this.spotifyInfo=i;
      //   // }

      // }
      this.spotifyInfo=this.artistsInfo.artists.items[0];
      console.log(this.spotifyInfo);
      });
      
}
}
