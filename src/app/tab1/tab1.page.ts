
import { API } from '../services/photo.service';
import * as Leaflet from 'leaflet';
import * as L from 'leaflet.offline';
import { Socket } from 'ngx-socket-io';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  map: Leaflet.Map
  layer: Leaflet.Layer
  propertyList = [];
  message = '';
  messages = [];
  currentUser = '';
  private locationLayerGroup = new Leaflet.LayerGroup();
  private trackLayerGroup = new Leaflet.LayerGroup();

  constructor(public myAPI: API, private socket: Socket) {
    // Subscribe on GPS position updates
    const that = this;
    this.myAPI.geoTicker.subscribe((next) => {
      console.log(next);
      that.updateGpsMapPosition();
    });
  }

  ngOnInit() { }
  ionViewDidEnter() { this.leafletInit(); }
  ngOnDestroy() { }

  updateGpsMapPosition() {
    const accuracy = this.myAPI.accuracy;
    const position = new Leaflet.LatLng(this.myAPI.latitude, this.myAPI.longitude);

    if (position) {
      this.locationLayerGroup.clearLayers();
      this.map.setView(position);

      const markerCircle = Leaflet.circleMarker(position, {
        color: 'blue',
        radius: accuracy
      });
      this.locationLayerGroup.addLayer(markerCircle);

      const markerCircleRed = Leaflet.circleMarker(position, {
        color: 'red',
        radius: 5
      });
      this.trackLayerGroup.addLayer(markerCircleRed);

    }

  }


  leafletInit() {
    const position = new Leaflet.LatLng(48.1365, 11.6825);

    this.map = new Leaflet.Map('mapId').setView(position, 16);

    const tileLayerOnline = Leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'Online Layer'
    }).addTo(this.map);

    // offline baselayer, will use offline source if available
    const tileLayerOffline = L.tileLayerOffline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Offline Layer'
    }).addTo(this.map);

    const control = L.savetiles(tileLayerOffline, {
      zoomlevels: [13, 16], // optional zoomlevels to save, default current zoomlevel
      confirm(layer, successCallback) {
        // eslint-disable-next-line no-alert
        if (window.confirm(`Save ${layer._tilesforSave.length}`)) {
          successCallback();
        }
      },
      confirmRemoval(layer, successCallback) {
        // eslint-disable-next-line no-alert
        if (window.confirm('Remove all the tiles?')) {
          successCallback();
        }
      },
      saveText:
        '<i class="fa fa-download" aria-hidden="true" title="Save tiles"></i>',
      rmText: '<i class="fa fa-trash" aria-hidden="true"  title="Remove tiles"></i>',
    });
    control.addTo(this.map);
    this.map.addLayer(this.locationLayerGroup);


    // layer switcher control
    const layerswitcher = new Leaflet.Control.Layers(
      {
        'Carto (online)': tileLayerOnline,
        'Openstreetmap (offline)': tileLayerOffline
      },
      {
        'GPS Position': this.locationLayerGroup,
        'GPS Track': this.trackLayerGroup,

      },
      { collapsed: false }
    ).addTo(this.map);



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



  getGPS() {
    //this.myAPI.getLocation();
    if (this.myAPI.latitude) {
      this.updateGpsMapPosition();
      this.myAPI.showToast('GPS Position set');
    }
  }
}
