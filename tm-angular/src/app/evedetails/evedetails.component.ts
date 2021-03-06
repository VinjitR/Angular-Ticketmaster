import { Component, Input, OnInit ,Output,EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { trigger, transition, animate, style } from '@angular/animations';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-evedetails',
  templateUrl: './evedetails.component.html',
  styleUrls: ['./evedetails.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('500ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ]
})
export class EvedetailsComponent implements OnInit {
@Input() eventdetailsid:any;
@Output() checkdisplay:EventEmitter<boolean> = new EventEmitter();

displaycheck:boolean=true;
infoselect: boolean=true;
artistselect: boolean = false;
venueselect: boolean = false;
detailsInfo:any;
spotifyInfo:any;
tweeturl:any="https://twitter.com/intent/tweet?text=";
tweettext:any;
noSpotify:boolean=false;
detailsready:boolean=false;
artistsInfo:any=[];
venueInfo:any;
mapLoc:any;
betterdate:any;
vlat:any;
vlng:any;


  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.loadeventdetails();
    this.infoselect=true;
    this.artistselect=false;
    this.venueselect=false;
  }
  async loadeventdetails(){
    var paramobj={"id":this.eventdetailsid};
    this.http.get(environment.apiUrl+"/getdetails",
    {
      params:paramobj
    }).subscribe(resposnse=>{
      this.detailsInfo=resposnse;
      console.log(this.detailsInfo);
    this.detailsready=true;
    this.mapLoc=this.detailsInfo._embedded.venues[0].location;
    this.tweettext="Check out "+this.detailsInfo.name+" located at "+this.detailsInfo._embedded.venues[0].name+". &hashtags=CSCI571EventSearch".replace(/ /g,'+');
    this.tweeturl+=this.tweettext;
    this.betterdate=moment(this.detailsInfo.dates.start.localDate).format('ll');
    console.log(this.betterdate);
    if(this.detailsInfo._embedded.attractions!=undefined){
    for(var i=0; i<this.detailsInfo._embedded.attractions.length;i++){
      this.loadSptDet(i, this.detailsInfo._embedded.attractions[i].name);
    }}
    else{
      this.noSpotify=true;
    }
    this.loadvenue(this.detailsInfo._embedded.venues[0].name);
    
    
});

    

}
async loadSptDet(i:number, name:any){
  console.log(i,name);
  var paramobj={"Keyword":name};
    await this.http.get(environment.apiUrl+"/spotify",
    {
      params:paramobj
    }).subscribe(response=>{
      
      this.artistsInfo[i]=response;
      console.log(this.artistsInfo[i])
      // for( let i of this.artistsInfo.artists.items){
      //   // if (i.name.toLowerCase()==this.detailsInfo._embedded.attractions[0].name.toLowerCase()){
      //   //   this.spotifyInfo=i;
      //   // }

      // }
      // if (this.artistsInfo.artists.items.length>0 && this.artistsInfo.artists!=undefined){
      //   this.noSpotify[i]=false;
      // this.spotifyInfo[i]=this.artistsInfo.artists.items[0];
      // }
      // else{
      //   this.noSpotify[i]=true;
      // }
      // console.log(this.spotifyInfo);
      });
      
}

async loadvenue(key:string){
  console.log(key);
  var paramobj={"key":key.replace(/ /g,'+')};
   this.http.get(environment.apiUrl+"/getvenue",
  {
    params:paramobj
  }).subscribe(response=>{
    this.venueInfo=response;
    console.log(this.venueInfo);
    this.vlat=parseFloat(this.venueInfo._embedded.venues[0].location.latitude);
    this.vlng=parseFloat(this.venueInfo._embedded.venues[0].location.longitude);
    console.log(this.vlat,this.vlng)
});
}

set_favor(idstr:string){
  console.log(idstr);
  if (localStorage.getItem(idstr)!=undefined){
    localStorage.removeItem(idstr);
  }
  else{
 
    if(this.detailsInfo.id==idstr){
      console.log(idstr,this.detailsInfo)
      localStorage.setItem(idstr, JSON.stringify({"date":this.detailsInfo.dates.start.localDate,"event":this.detailsInfo.name,"id":this.detailsInfo.id,"genre":this.detailsInfo.classifications[0].genre.name+" | "+this.detailsInfo.classifications[0].segment.name+" | "+this.detailsInfo.classifications[0].subGenre.name,"venue":this.detailsInfo._embedded.venues[0].name}));
    }
  }

  
}
checkfavor(idstr:string): string | undefined{
  if(localStorage.getItem(idstr)!=undefined){
    return idstr;
  }
  else{
    return undefined;
  }

}

tabledisplay(){
  this.displaycheck=false;
  this.checkdisplay.emit(this.displaycheck);
}

}
