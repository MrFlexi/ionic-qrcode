import { Component } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  
  canvas: any;

  constructor() {}

   ngOnInit() {
     this.canvas = new fabric.Canvas('canvas');
     this.canvas.add(new fabric.IText('Hello World !'));
   }

}
