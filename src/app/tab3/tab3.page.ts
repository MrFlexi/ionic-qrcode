import { API } from '../services/photo.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page  implements OnInit, OnDestroy {
  login: any = { username: 'Jochen', password: '' };
  ble: any = { connected: false};

  constructor(public myAPI: API) { }

  ngOnInit() {}
  ionViewDidEnter() {}
  ngOnDestroy() {}
  ionViewWillLeave() {}

  initBLE() {
    this.ble.connected = true;
    this.myAPI.initBLE();
    this.myAPI.showToast('Bluetooth aquired');
  }

  stopBLE() {
    this.ble.connected = false;
  }
  onLogin() {
    console.log('user name:', this.login.username );
    console.log('user password', this.login.password );
  }

  setLoginData() {
    this.login.username = 'edupala.com';
    this.login.password = '12345';
  }
}