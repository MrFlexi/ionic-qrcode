import { NgModule } from '@angular/core';
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ToastController } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BleClient, BleClientInterface, numbersToDataView, numberToUUID } from '@capacitor-community/bluetooth-le';
import { BehaviorSubject, Observable } from 'rxjs';


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
  latitude: any;
  longitude: any;
  speed: any;
  altitude: any;
  timestamp: any;
  lastDetectedImage: any = "http://yolo.szaroletta.de/detected_images/last.jpg";
  lastPlantImage: any = "http://api.szaroletta.de/get_last_image";
  batteryLevel: any = 0;
  batteryChargeCurrent: any = 0;
  sunAzimuth: any = 0;
  sunElevation: any = 0;
  payload: any = "no data";
  detectedObjects = [{ className: 'car', classCount: 26 },
  { className: 'person', classCount: 2 }];

  esp32Service = numberToUUID(0x180F); // '91bad492-b950-4226-aa2b-4ede9fa42f59';
  bmeCharacteristic = numberToUUID(0x2A19);

  public bleDevice: any;
  public geoTicker: Observable<any>;

  batService = numberToUUID(0x180f);
  envService = numberToUUID(0x181A);

  batLevelCharacteristic = numberToUUID(0x2a19);
  batChargeCharacteristic = 'c530390d-cb2a-46c3-87c4-2f302a2f371e';
  sunAzimuthCharacteristic = '738be241-bccb-47d0-9149-ef3024d4324c';
  sunElevationCharacteristic = 'e20ce7ec-4ed7-40f4-b149-c9a209e21e92';
  payloadCharacteristic = 'e20ce7ec-4ed7-40f4-b149-c9a209e21e93';

  public photos: Photo[] = [];


  constructor(private toastCtrl: ToastController,
    public httpClient: HttpClient) {
    this.getLocation();

    this.geoTicker = new Observable((observer) => {
      let watchId: any;
      // Simple geolocation API check provides values to publish
      if ('geolocation' in navigator) {
        watchId = Geolocation.watchPosition({}, (position, err) => {
          console.log('Watch', position);
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.speed = position.coords.speed;
          this.altitude = position.coords.altitude;
          this.timestamp = position.timestamp;

          observer.next(position);    // Bradcast actual position
        });
      }
    });

    this.geoTicker.subscribe({
      next(position) {
        console.log('Position Update: ', position);
      }
    });
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
    //this.getLocation();
    this.yoloImageDetection(imgBlob);
  }

  public yoloImageDetection(imageBlob) {
    // Destination URL
    const url = 'http://api.szaroletta.de/upload_and_detect';

    const payload = new FormData();
    const dataOut = {
      deviceId: 'MrFlexi',
      type: 'Street',
      latitude: this.latitude,
      longitude: this.longitude
    };

    payload.append('data', JSON.stringify(dataOut));
    payload.append('image', imageBlob, 'image.jpg');

    this.detection = this.httpClient.post(url, payload);
    this.detection.subscribe(data => {
      this.detection = data;
      console.log('my detections: ', data);
      this.lastDetectedImage = 'http://' + data['url'];
      this.detectedObjects = data['detectedObjects'];
      //this.geoLocation = data['geoLocation'];
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
      })
    };


    const payload = new FormData();
    const dataOut = {
      latitude: this.latitude,
      longitude: this.longitude
    };

    payload.append('data', JSON.stringify(dataOut));

    this.nomatim = this.httpClient.post(url, payload, httpOptions);
    this.nomatim.subscribe(data => {
      this.nomatim = data;
      console.log('reverseGeo: ', data);
      //this.geoLocation = data['geoLocation'];
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
      })
    };


    const payload = new FormData();
    const dataOut = {
      latitude: this.longitude,
      longitude: this.longitude
    };

    payload.append('data', JSON.stringify(dataOut));

    this.response = this.httpClient.post(url, payload, httpOptions);
    this.response.subscribe(data => {
      this.response = data;
      console.log('API Call: ', data);
    }
    );
  }


  public async getLocation() {
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.speed = position.coords.speed;
    this.altitude = position.coords.altitude;
    this.timestamp = position.timestamp;
  }


  async showToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  onDisconnect(deviceId: string): void {
    console.log(`device ${deviceId} disconnected`);
  }


  // https://github.com/capacitor-community/bluetooth-le


  async scanBLE(): Promise<void> {
    try {
      await BleClient.initialize();

      await BleClient.requestLEScan(
        {
          services: []
        },
        (result) => {
          console.log('received new scan result', result);
          console.log('Available services', result.uuids);
        }
      );

      setTimeout(async () => {
        await BleClient.stopLEScan();
        console.log('stopped scanning');
      }, 10000);
    } catch (error) {
      console.error(error);
    }
  }

  async initBLE(): Promise<void> {
    try {

      await BleClient.initialize();

      this.bleDevice = await BleClient.requestDevice({
        services: [this.batService, this.envService],
        optionalServices: [],
      });

      // connect to device, the onDisconnect callback is optional
      await BleClient.connect(this.bleDevice.deviceId, (deviceId) => this.onDisconnect(deviceId));
      console.log('connected to ', this.bleDevice);

      const result = await BleClient.read(this.bleDevice.deviceId, this.batService, this.batLevelCharacteristic);
      console.log('Battery level', result);

      await BleClient.startNotifications(
        this.bleDevice.deviceId,
        this.batService,
        this.batLevelCharacteristic,
        (value) => {
          this.batteryLevel = value.getInt8(0);
          console.log('Battery level', this.batteryLevel);
        }
      );

      await BleClient.startNotifications(
        this.bleDevice.deviceId,
        this.batService,
        this.batChargeCharacteristic,
        (value) => {
          this.batteryChargeCurrent = value.getInt32(0, true);       // true = LSB  false = MSB
          console.log('Battery charge', this.batteryChargeCurrent);
        }
      );


      await BleClient.startNotifications(
        this.bleDevice.deviceId,
        this.envService,
        this.sunAzimuthCharacteristic,
        (value) => {
          this.sunAzimuth = value.getFloat64(0, true);       // true = LSB  false = MSB
          console.log('Sun azimuth', this.sunAzimuth);
        }
      );


      await BleClient.startNotifications(
        this.bleDevice.deviceId,
        this.envService,
        this.sunElevationCharacteristic,
        (value) => {
          //this.sunElevation = value.getFloat64(0, true);       // true = LSB  false = MSB
          //this.sunElevation = value.buffer.toString();     // true = LSB  false = MSB
          //console.log('Sun Elevation', this.sunElevation);

          const enc = new TextDecoder("utf-8");
          this.payload = JSON.parse(enc.decode(value.buffer));
        }
      );

    } catch (error) {
      console.log('ERROR');
      console.error(error);
    }
  }
}

