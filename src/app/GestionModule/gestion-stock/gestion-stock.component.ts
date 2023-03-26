import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../../Interface/Dialog';
import { DialogComponent } from '../../SharedModule/dialog/dialog.component';
import { StockInterface } from '../../Interface/Stock';
import { StockService } from '../../Service/stock.service';
import { EditStockComponent } from '../edit-stock/edit-stock.component';

@Component({
  selector: 'app-gestion-stock',
  templateUrl: './gestion-stock.component.html',
  styleUrls: ['./gestion-stock.component.scss'],
})
export class GestionStockComponent implements OnInit {
  displayedColumns: string[] = ['label', 'stock', 'edit', 'delete'];
  allStocks: StockInterface[] = [];

  public stock: StockInterface = {
    _id: null,
    label: null,
    stock: null,
  };

  constructor(
    private stockService: StockService,
    private notifyService: NotifyService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllStock();
  }

  getAllStock(): void {
    this.stockService.getAllStock().subscribe(
      (stocks) => (this.allStocks = stocks),
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  create(): void {
    if (this.stock.stock === null) this.stock.stock = 0;
    this.stockService.create(this.stock).subscribe(
      (result) => {
        this.getAllStock();
        this.notifyService.notifyUser(
          result.message,
          this.snackBar,
          'success',
          'OK'
        );
        this.stock = {
          stock: null,
          label: null,
          _id: null,
        };
      },
      (err) =>
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK')
    );
  }

  openEditDialog(stock: StockInterface): void {
    this.dialog.open(EditStockComponent, {
      width: '60%',
      data: {
        stock,
        createMode: false,
      },
    });
  }

  delete(stock: StockInterface): void {
    const stockToDelete: Dialog = {
      id: stock._id,
      action: 'Supprimer le stock ?',
      option: null,
      action_button_text: 'Supprimer',
    };

    this.dialog
      .open(DialogComponent, {
        width: '55%',
        data: stockToDelete,
      })
      .afterClosed()
      .subscribe(
        (stock_id) => {
          if (stock_id) {
            this.stockService.delete(stock_id).subscribe(
              (result) => {
                this.getAllStock();
                this.notifyService.notifyUser(
                  result.message,
                  this.snackBar,
                  'error',
                  'OK'
                );
              },
              (err) =>
                this.notifyService.notifyUser(
                  err.error,
                  this.snackBar,
                  'error',
                  'OK'
                )
            );
          }
        },
        (err) =>
          this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK')
      );
  }

  isInvalidStock(): boolean {
    return this.stock.label !== null && this.stock.label.trim() !== '';
  }
}
