import { NgModule } from '@angular/core';
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@capacitor/geolocation';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})

export class PhotoService {
  latitude: any = 22; //latitude
  longitude: any = 33; //longitude
  barcode: any = 'Hallo Welt';
  nvcValue: any = 10101010;

  public photos: Photo[] = [];
  private ph:Photo;



  constructor() {
    this.getLocation();
  }


  public async getBarcode() {
    // Take a photo
    BarcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.barcode = barcodeData;
    }).catch(err => {
      console.log('Error', err);
    });
  }

  public async addNewToGallery() {
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

  public async getNFC() {
    //const flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
    //this.nvcValue = this.nfc.readerMode(flags).subscribe(
    //                      tag => console.log(JSON.stringify(tag)),
    //                      err => console.log('Error reading tag', err)
    //);
  }

}

