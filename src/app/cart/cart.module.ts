import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './cart.component';
import { ConfettiComponent } from './components/confetti/confetti.component';

@NgModule({
  declarations: [
    CartComponent,
    ConfettiComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    CartComponent,
    ConfettiComponent
  ]
})
export class CartModule { }
