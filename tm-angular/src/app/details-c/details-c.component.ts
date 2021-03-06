import { Component, OnInit,Input} from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-details-c',
  templateUrl: './details-c.component.html',
  styleUrls: ['./details-c.component.css'],animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('300ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class DetailsCComponent implements OnInit {
  @Input() eventD:any;

  evedetaildisplay:boolean=false;
  evedetaildisplay2:boolean=true;
  slideactivate:boolean=false;

  event:any;

  constructor() { }

  ngOnInit(): void {
    this.evedetaildisplay=false;
    this.event='';
  }
  displayevent(id:string){
    console.log(id);
    this.event=id;
  }
  set_favor(idstr:string){
    console.log(idstr);
    if (localStorage.getItem(idstr)!=undefined){
      localStorage.removeItem(idstr);
    }
    else{
    for (var i of this.eventD.events){
      if(i.id==idstr){
        console.log(idstr,i)
        localStorage.setItem(idstr, JSON.stringify({"date":i.datetime,"event":i.event,"id":i.id,"genre":i.genre,"venue":i.venue}));
      }
    }}

    
  }
  checkfavor(idstr:string): string | undefined{
    if(localStorage.getItem(idstr)!=undefined){
      return idstr;
    }
    else{
      return undefined;
    }

  }

  getbetterName(name:string){
    if(name.length>34){
    var space_index=0;
    if(name.charAt(35)==" "){
      return name.substring(0,31)+"...";
    }
    else{
    for(let i=0;i<name.length;i++){
      if (name.charAt(i)==' '){
          if(i>35){
            break;
          }
          else{
            space_index=i;
          }
      }
    }
    return name.substring(0,space_index)+"...";
  }
    }
    else{
      return name;
    }
  }
  checkdisplayHandler(displaybool:boolean){
    this.evedetaildisplay=displaybool;
    this.slideactivate=true;
  }
}
