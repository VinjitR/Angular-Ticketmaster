import { Component, OnInit,Input} from '@angular/core';

@Component({
  selector: 'app-details-c',
  templateUrl: './details-c.component.html',
  styleUrls: ['./details-c.component.css']
})
export class DetailsCComponent implements OnInit {
  @Input() eventD:any;

  evedetaildisplay:boolean=false;
  evedetaildisplay2:boolean=true;

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
}
