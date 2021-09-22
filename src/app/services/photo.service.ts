import { NgModule } from '@angular/core';
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})


export class PhotoService {
  
  latitude: any = 22; //latitude
  longitude: any = 33; //longitude
  barcode: any = 'Hallo Welt';

  constructor() {
    this.getLocation();
  }

  public async addNewToGallery() {
    // Take a photo
    BarcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.barcode = barcodeData;
     }).catch(err => {
         console.log('Error', err);
     });
    }

  public async takePhoto() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
  }

    public async getLocation() {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    }

}
