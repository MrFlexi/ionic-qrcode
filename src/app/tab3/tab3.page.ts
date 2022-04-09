import { Component } from '@angular/core';
import { fabric } from 'fabric';
import { API } from '../services/photo.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  canvas: any;

  constructor(public myAPI: API) {}

   ngOnInit() {
     this.canvas = new fabric.Canvas('canvas');
     this.canvas.add(new fabric.IText('Hello World !'));
   }

   onSliderChanged(event, item){
    event.stopPropagation();
    //this.myAPI.LokChanged();
  }

}
