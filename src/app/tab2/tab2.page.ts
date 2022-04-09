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
  

  constructor( public myAPI: API, private socket: Socket) { }

  ngOnInit() {
    this.socket.connect();
 
    this.socket.fromEvent('loklist_data').subscribe(data => {
      this.deviceList = JSON.parse(data['DeviceList']);
        this.myAPI.showToast('WebSocket received');
    });

    this.socket.fromEvent('lastDetectedImage').subscribe(data => {
      this.myAPI.lastDetectedImage = JSON.parse(data['lastDetectedImage']);
        this.myAPI.showToast('WebSocket received' + this.myAPI.lastDetectedImage );
    });
 
    //this.socket.fromEvent('message').subscribe(message => {
    //  this.messages.push(message);
    //});
  }


  detectCars() {
    this.myAPI.detectCars();
  }
  getWebSocketData() {
    this.socket.emit('test', 'hallo');
  }

  getGPS() {
    this.myAPI.getLocation();
    this.myAPI.reverseGeo();
    // Set marker
    //const markPoint = Leaflet.marker([this.myAPI.latitude, this.myAPI.longitude]);
    //markPoint.bindPopup('<p>Hallo</p>');
    //this.map.addLayer(markPoint);
    //this.map.setView([this.myAPI.latitude, this.myAPI.longitude], 16);
    this.myAPI.showToast('GPS aquired')
  }

}
