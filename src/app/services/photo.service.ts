import { NgModule } from '@angular/core';
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@capacitor/geolocation';
import { ToastController } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class API {
  latitude: any = 22; //latitude
  longitude: any = 33; //longitude
  barcode: any = 'Hallo Welt';
  nvcValue: any = 10101010;
  cars: any;
  detection: any;
  lastDetectedImage: any = "http://yolo.szaroletta.de/detected_images/last.jpg";

  public photos: Photo[] = [];
  private ph:Photo;

  constructor(private toastCtrl: ToastController,
              public httpClient: HttpClient) {
    this.getLocation();
  }

  public getNumberOfCars() {

    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
      })};

  this.cars = this.httpClient.get('https://api.szaroletta.de/get_numer_of_cars', httpOptions);

  this.cars.subscribe(data => {
                                  this.cars = data;
                                  console.log('my data: ', data);
                              }
                      );
  };

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
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
   
    console.log('Image webPath', image.webPath);
    console.log('Image Path', image.path);
    console.log('Data URL', image.dataUrl);

    const response = await fetch(image.webPath);
    const imgBlob = await response.blob();
    console.log('data:', imgBlob); 
  }

  public async detectCars() {
    // Take a photo
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
   
    console.log('Image webPath', image.webPath);
    console.log('Image Path', image.path);
    console.log('Data URL', image.dataUrl);

    const response = await fetch(image.webPath);
    const imgBlob = await response.blob();
    console.log('data:', imgBlob);
 
    this.uploadImage(imgBlob);
  }

  
  public uploadImage(imageBlob) {
    // Destination URL
    const url = 'http://yolo.szaroletta.de/detect';

    const payload = new FormData();
    const dataOut = {
                      deviceId: 'MrFlexi',
                      type: 'Street',
                    };

    payload.append("dataOut",JSON.stringify(dataOut));
    payload.append('image', imageBlob, 'image.jpg');

    this.detection = this.httpClient.post('http://yolo.szaroletta.de/detect',payload)
    this.detection.subscribe(data => {
                  this.detection = data;
                  console.log('my detections: ', data);
                  this.lastDetectedImage = 'http://'+data['url'];
                  console.log('new url: ', this.lastDetectedImage);
                }
      );
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

  async showToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

}

