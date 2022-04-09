import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://127.0.0.1:3033', options: {} };

import { HTTP } from '@ionic-native/http/ngx';
import {HttpClient, HttpHandler, HttpClientModule} from '@angular/common/http';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
            HttpClientModule,
            IonicModule.forRoot(), AppRoutingModule,
    SocketIoModule.forRoot(config)],
  providers: [ HttpClientModule, HttpClient,
              { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
