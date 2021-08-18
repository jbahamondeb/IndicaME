import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ViewCell } from "ng2-smart-table";

@Component({
    selector: 'button-view',
    templateUrl: './custombutton.component.html',
    styleUrls: ['./custombutton.component.scss'],
  })
  export class CustomButtonComponent implements ViewCell, OnInit {
    renderValue: string;
  
    @Input() value;
  
    constructor() {  }
  
     @Input() rowData: any;
  
    @Output() save: EventEmitter<any> = new EventEmitter();
    @Output() save2: EventEmitter<any> = new EventEmitter();
    ngOnInit() {
      this.renderValue = this.value;
    }
  
    onClick() {
      this.save.emit(this.rowData);
    }

    onClick2() {
        this.save2.emit(this.rowData);
      }
  }