import { Component } from '@angular/core';
import { Menu } from './shared/enums/menu.enum';
import { Observable } from 'rxjs';
import { CartService } from './cart/services/cart.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
    title = 'El Ermitario';
    menu = Menu;
    itemCount$: Observable<number>;
    showConfetti = false;

    constructor(private cartService: CartService) {
        this.itemCount$ = this.cartService.getItemCount();
    }

    triggerConfetti(): void {
        this.showConfetti = true;
        setTimeout(() => {
            this.showConfetti = false;
        }, 3000);
    }
}
