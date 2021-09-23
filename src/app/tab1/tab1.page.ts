import { Component } from '@angular/core';
import { API } from '../services/photo.service';
import * as Leaflet from 'leaflet';
//import data  from 'geo.json';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  map: Leaflet.Map;
  layer: Leaflet.Layer;
  propertyList = [];

  myLines = [{ "type": "LineString", "coordinates": [[-100, 40], [-105, 45], [-110, 55]]},
              {"type": "LineString","coordinates": [[-105, 40], [-110, 45], [-115, 55]]}];

  constructor(public myAPI: API) { }

  ionViewDidEnter() {

    fetch('./assets/geo.json')
      .then(res => res.json())
      .then(data => {
        this.propertyList = data.properties;
        this.leafletMap();
      })
      .catch(err => console.error(err));
  }

  leafletMap() {
   
    this.map = new Leaflet.Map('mapId').setView([48.1365, 11.6825], 10);
    
    Leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com'
    }).addTo(this.map);

    
    //Leaflet.geoJSON().addData(this.myLines).addTo(this.map);

    // Set marker
    const markPoint = Leaflet.marker([48.094, 11.537]);
    markPoint.bindPopup('<p>MrFlexi.</p>');    
    this.map.addLayer(markPoint);
    



    // Get Markers from JSOn File
    //for (const property of this.propertyList) {
    //  Leaflet.marker([property.lat, property.long]).addTo(this.map)
    //    .bindPopup(property.city)
    //    .openPopup();
    //}

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

  getNFC() {
    this.myAPI.getNFC();
  }

  getGPS() {
    this.myAPI.getLocation();
    // Set marker
    const markPoint = Leaflet.marker([this.myAPI.latitude, this.myAPI.longitude]);
    markPoint.bindPopup('<p>Hallo</p>');
    this.map.addLayer(markPoint);
    this.map.setView([this.myAPI.latitude, this.myAPI.longitude], 16);
  }
}
