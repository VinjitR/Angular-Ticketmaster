import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DetailsCComponent } from './details-c/details-c.component';
import { EvedetailsComponent } from './evedetails/evedetails.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    RoundProgressModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAexWQCzwz1blNnNHbW3xhBSKjsZODiZ7w"
    }),
    BrowserAnimationsModule//
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
