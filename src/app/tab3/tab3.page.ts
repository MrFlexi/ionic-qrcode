import { API } from '../services/photo.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page  implements OnInit, OnDestroy {

  constructor(public myAPI: API) { }

  ngOnInit() {}
  ionViewDidEnter() {}
  ngOnDestroy() {}
  ionViewWillLeave() {}

  initBLE() {
    this.myAPI.initBLE();
    this.myAPI.showToast('Bluetooth aquired');
  }
}