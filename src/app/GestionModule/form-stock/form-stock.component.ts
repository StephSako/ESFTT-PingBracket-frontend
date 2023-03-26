import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StockInterface } from '../../Interface/Stock';

@Component({
  selector: 'app-form-stock',
  templateUrl: './form-stock.component.html',
  styleUrls: ['./form-stock.component.scss'],
})
export class FormStockComponent implements OnInit {
  @Input() stock: StockInterface = {
    label: null,
    _id: null,
    stock: null,
  };
  stockControl = new FormControl('');

  constructor() {}

  ngOnInit(): void {}
}
