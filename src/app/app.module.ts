import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { GraphrModule } from './graphr/graphr.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    GraphrModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
