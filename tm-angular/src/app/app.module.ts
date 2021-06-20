import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { AgmCoreModule } from '@agm/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DetailsCComponent } from './details-c/details-c.component';
import { EvedetailsComponent } from './evedetails/evedetails.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
  declarations: [
    AppComponent,
    DetailsCComponent,
    EvedetailsComponent,
    FavoritesComponent
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
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
