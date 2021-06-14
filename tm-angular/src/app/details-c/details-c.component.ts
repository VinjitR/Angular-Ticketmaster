import { Component, OnInit,Input} from '@angular/core';

@Component({
  selector: 'app-details-c',
  templateUrl: './details-c.component.html',
  styleUrls: ['./details-c.component.css']
})
export class DetailsCComponent implements OnInit {
  @Input() eventD:any;

  evedetaildisplay:boolean=false;

  constructor() { }

  ngOnInit(): void {
    this.evedetaildisplay=false;
  }
  displayevent(id:string){
    console.log(id);
  }
}
