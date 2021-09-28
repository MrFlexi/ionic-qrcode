import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { API } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  deviceList ='';

  constructor(public myAPI: API, private socket: Socket) { }

  ngOnInit() {
    this.socket.connect();
 
    this.socket.fromEvent('Devices').subscribe(data => {
      this.deviceList = JSON.parse(data['DeviceList']);
        this.myAPI.showToast('WebSocket received');
    });
 
    //this.socket.fromEvent('message').subscribe(message => {
    //  this.messages.push(message);
    //});
  }

  getWebSocketData() {
    this.socket.emit('test', name);
  }

}
