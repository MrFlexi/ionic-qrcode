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
  barcode: any = 'Hallo Welt';
  nvcValue: any = 10101010;
  cars: any;
  detection: any;
  nomatim: any;
  response: any;
  lastDetectedImage: any = "http://yolo.szaroletta.de/detected_images/last.jpg";
  lastPlantImage: any = "http://api.szaroletta.de/get_last_image";
  geoLocation : any;
  detectedObjects = [{className:"car", classCount:26},
                      {className:"person", classCount:2}];

  public photos: Photo[] = [];
  private ph:Photo;

  constructor(private toastCtrl: ToastController,
              public httpClient: HttpClient) {
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
 
    this.getLocation();
    this.yoloImageDetection(imgBlob);
  }

  
  public yoloImageDetection(imageBlob) {
    // Destination URL
    const url = 'http://api.szaroletta.de/upload_and_detect';

    const payload = new FormData();
    const dataOut = {
                      deviceId: 'MrFlexi',
                      type: 'Street',
                      latitude: this.geoLocation.coords.latitude,
                      longitude: this.geoLocation.coords.longitude
                    };

    payload.append('data',JSON.stringify(dataOut));
    payload.append('image', imageBlob, 'image.jpg');

    this.detection = this.httpClient.post(url,payload);
    this.detection.subscribe(data => {
                  this.detection = data;
                  console.log('my detections: ', data);
                  this.lastDetectedImage = 'http://'+data['url'];
                  this.detectedObjects = data['detectedObjects'];
                  this.geoLocation = data['geoLocation'];
                  console.log('new url: ', this.lastDetectedImage);
                }
      );
  }

  public reverseGeo() {
    // Destination URL
    const url = 'http://api.szaroletta.de/reverseGeo';

    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
      })};


    const payload = new FormData();
    const dataOut = {
                      latitude: this.geoLocation.coords.latitude,
                      longitude: this.geoLocation.coords.longitude
                    };

    payload.append('data',JSON.stringify(dataOut));

    this.nomatim = this.httpClient.post(url,payload,httpOptions);
    this.nomatim.subscribe(data => {
                  this.nomatim = data;
                  console.log('reverseGeo: ', data);
                  this.geoLocation = data['geoLocation'];
                  console.log('reverseGeo: ', this.nomatim);
                }
      );
  }

  public lokChanged() {
    // Destination URL
    console.log('LokChanged');
    const url = 'localhost:3033/LokChanged';

    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
      })};


    const payload = new FormData();
    const dataOut = {
                      latitude: this.geoLocation.coords.longitude,
                      longitude: this.geoLocation.coords.longitude
                    };

    payload.append('data',JSON.stringify(dataOut));

    this.response = this.httpClient.post(url,payload,httpOptions);
    this.response.subscribe(data => {
                  this.response = data;
                  console.log('API Call: ', data);
                }
      );
  }


  public async getLocation() {
    this.geoLocation = await Geolocation.getCurrentPosition();

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

