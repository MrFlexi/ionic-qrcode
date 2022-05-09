import { Component } from '@angular/core';
import { API } from '../services/photo.service';
import * as Leaflet from 'leaflet';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  map: Leaflet.Map;
  layer: Leaflet.Layer;
  propertyList = [];
  message = '';
  messages = [];
  currentUser = '';
 
  constructor(public myAPI: API, private socket: Socket) { }

  ngOnInit() {
    fetch('./assets/geo.json')
      .then(res => res.json())
      .then(data => {
        this.propertyList = data.properties;
        this.leafletInit();
      })
      .catch(err => console.error(err));
  }

  leafletInit() {
    const position = new Leaflet.LatLng(48.1365, 11.6825);

    this.map = new Leaflet.Map('mapId').setView(position, 10);
    Leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com'
    }).addTo(this.map);

    //Leaflet.geoJSON().addData(this.myLines).addTo(this.map);

    // Set marker
    this.leafletSetCrosshair(position);
  }

  ionViewWillLeave() {
    this.map.remove();
  }

  addPhotoToGallery() {
    this.myAPI.addNewToGallery();
  }

  getBarcode() {
    this.myAPI.getBarcode();
  }

  leafletSetCrosshair(position)
  {
    // Set marker
    // const markPoint = Leaflet.marker([this.myAPI.geoLocation.coords.latitude, this.myAPI.geoLocation.coords.longitude]);

    const markerCircle = Leaflet.circleMarker(position, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.1,
      radius: 500
  });
    markerCircle.setRadius(40);

    //markPoint.bindPopup('<p>Hallo</p>');
    this.map.addLayer(markerCircle);
    this.map.setView([this.myAPI.geoLocation.coords.latitude, this.myAPI.geoLocation.coords.longitude], 16);

  }
  
  getGPS() {
    this.myAPI.getLocation();
    const position = new Leaflet.LatLng( this.myAPI.geoLocation.coords.latitude, this.myAPI.geoLocation.coords.longitude);
    this.leafletSetCrosshair(position);
    this.myAPI.showToast('GPS aquired');
  }

  initBLE() {
    this.myAPI.initBLE();    
    this.myAPI.showToast('Bluetooth aquired');
  }
}
