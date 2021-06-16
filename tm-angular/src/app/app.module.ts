import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DetailsCComponent } from './details-c/details-c.component';
import { EvedetailsComponent } from './evedetails/evedetails.component';

@NgModule({
  declarations: [
    AppComponent,
    DetailsCComponent,
    EvedetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RoundProgressModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
