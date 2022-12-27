import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ReusableService {

  constructor(
    public loadingController: LoadingController
  ) { }


  // Simple loader
  simpleLoader(msg:string) {
    this.loadingController.create({
      message: msg
    }).then((response) => {
      response.present();
    });
  }

  // Dismiss loader
dismissLoader() {
  this.loadingController.dismiss().then((response) => {
      console.log('Loader closed!', response);
  }).catch((err) => {
      console.log('Error occured : ', err);
  });
}

  // Auto hide show loader
  autoLoader() {
    this.loadingController.create({
      message: 'Loader hides after 4 seconds',
      duration: 4000
    }).then((response) => {
      response.present();
      response.onDidDismiss().then((response) => {
        console.log('Loader dismissed', response);
      });
    });
  } 


}
