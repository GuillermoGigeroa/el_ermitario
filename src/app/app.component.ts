import { Component, Renderer2, ElementRef } from '@angular/core';
import { Menu } from './shared/enums/menu.enum';
import { Observable } from 'rxjs';
import { CartService } from './cart/services/cart.service';
import { Router } from '@angular/router';

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

    constructor(
        private cartService: CartService,
        private router: Router,
        private renderer: Renderer2,
        private el: ElementRef
    ) {
        this.itemCount$ = this.cartService.getItemCount();
    }

    triggerConfetti(): void {
        this.showConfetti = true;
        setTimeout(() => {
            this.showConfetti = false;
        }, 3000);
    }

    closeMenu(): void {
        const navbarCollapse = this.el.nativeElement.querySelector('#navbarSupportedContent');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            this.renderer.removeClass(navbarCollapse, 'show');
        }
    }

    onNavigation(): void {
        this.closeMenu();
    }
}
