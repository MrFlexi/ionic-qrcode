
import { API } from '../services/photo.service';
import * as Leaflet from 'leaflet';
import { Socket } from 'ngx-socket-io';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  map: Leaflet.Map;
  layer: Leaflet.Layer;
  propertyList = [];
  message = '';
  messages = [];
  currentUser = '';

  constructor(public myAPI: API, private socket: Socket) {
    // Subscribe on GPS position updates
    const that = this;
    this.myAPI.geoTicker.subscribe((next) => {
      console.log(next);
      that.updateGpsMapPosition();
    });
  }

  ngOnInit() {
    //this.leafletInit();
  }

  ionViewDidEnter() {this.leafletInit();}
  ngOnDestroy() {}

  updateGpsMapPosition() {
    const position = new Leaflet.LatLng(this.myAPI.latitude, this.myAPI.longitude);
    this.leafletSetCrosshair(position);
  }


  leafletInit() {
    const position = new Leaflet.LatLng(48.1365, 11.6825);

    this.map = new Leaflet.Map('mapId').setView(position, 16);
    Leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'Hallo Welt'
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

  // Set marker and center map
  leafletSetCrosshair(position) {
    this.map.setView(position, 16);
  
    const markerCircle = Leaflet.circleMarker(position, {
      color: 'orange',
      fillColor: '#f03',
      fillOpacity: 0.1,
      radius: 500
    });
    markerCircle.setRadius(40);
    this.map.addLayer(markerCircle);
  }


  getGPS() {
    //this.myAPI.getLocation();
    if ( this.myAPI.latitude )
    {
      const position = new Leaflet.LatLng(this.myAPI.latitude, this.myAPI.longitude);
      this.leafletSetCrosshair(position);
      this.myAPI.showToast('GPS Position set');
    }
  }
}
