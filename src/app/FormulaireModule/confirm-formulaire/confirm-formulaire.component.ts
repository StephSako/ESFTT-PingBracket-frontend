import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-formulaire',
  templateUrl: './confirm-formulaire.component.html',
  styleUrls: ['./confirm-formulaire.component.scss'],
})
export class ConfirmFormulaireComponent implements OnInit {
  public summary = '';

  constructor(private readonly router: Router) {
    if (
      this.router.getCurrentNavigation().extras.hasOwnProperty('state') &&
      this.router.getCurrentNavigation().extras.state.hasOwnProperty('summary')
    ) {
      this.summary = this.router.getCurrentNavigation().extras.state.summary;
    } else {
      this.router.navigateByUrl('/formulaire');
    }
  }

  ngOnInit(): void {}
}
