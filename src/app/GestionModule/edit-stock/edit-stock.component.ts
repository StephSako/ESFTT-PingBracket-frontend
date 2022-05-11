import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';
import { StockInterface } from '../../Interface/Stock';
import { StockService } from '../../Service/stock.service';

@Component({
  selector: 'app-edit-stock',
  templateUrl: './edit-stock.component.html',
  styleUrls: ['./edit-stock.component.scss']
})
export class EditStockComponent implements OnInit {

  reactiveForm = new FormGroup({
    label: new FormControl(''),
    stock: new FormControl('')
  });
  stock: StockInterface = {
    stock: null,
    label: null,
    _id: null
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data, private route: ActivatedRoute, private notifyService: NotifyService,
              private stockService: StockService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.stock = data.stock;
  }

  ngOnInit(): void {
    this.reactiveForm.setValue({
      label: this.stock.label,
      stock: this.stock.stock
    });
  }

  editStock(): void {
    this.stock.label = this.reactiveForm.get('label').value;
    this.stock.stock = this.reactiveForm.get('stock').value;
    this.stockService.edit(this.stock).subscribe(result =>
      this.notifyService.notifyUser(result.message, this.snackBar, 'success','OK'), err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  isModified(): boolean {
    return (this.reactiveForm.get('label').value !== this.stock.label || this.reactiveForm.get('stock').value !== this.stock.stock);
  }

  isInvalid(): boolean {
    return (this.stock.label != null && this.stock.label.trim() !== '' && this.isModified());
  }
}
