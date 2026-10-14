import { Component, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { Menu } from './shared/enums/menu.enum';
import { Observable, Subscription } from 'rxjs';
import { CartService } from './cart/services/cart.service';
import { Router } from '@angular/router';
import { SearchEntry } from './shared/models/search-entry.model';
import { SearchService } from './shared/services/search.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnDestroy {
    title = 'El Ermitario';
    menu = Menu;
    itemCount$: Observable<number>;
    showConfetti = false;
    searchQuery = '';
    searchResults: SearchEntry[] = [];
    searchError = '';
    isSearching = false;
    private searchSubscription?: Subscription;

    constructor(
        private cartService: CartService,
        private router: Router,
        private renderer: Renderer2,
        private el: ElementRef,
        private searchService: SearchService
    ) {
        this.itemCount$ = this.cartService.getItemCount();
    }

    ngOnDestroy(): void {
        this.searchSubscription?.unsubscribe();
    }

    get isGameRoute(): boolean {
        return this.router.url.split(/[?#]/, 1)[0] === '/game';
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

    onSearchChange(query: string): void {
        this.searchSubscription?.unsubscribe();
        this.searchResults = [];
        this.searchError = '';
        this.isSearching = Boolean(query.trim());

        if (!this.isSearching) {
            return;
        }

        this.searchSubscription = this.searchService.search(query).subscribe({
            next: results => {
                this.searchResults = results;
                this.isSearching = false;
            },
            error: error => {
                console.error('Error loading the configured search index:', error);
                this.searchError = 'No se pudo cargar la búsqueda. Inténtalo de nuevo más tarde.';
                this.isSearching = false;
            }
        });
    }

    submitSearch(): void {
        this.onSearchChange(this.searchQuery);
    }

    async selectSearchResult(
        result: SearchEntry,
        cart: { toggleCart(): void }
    ): Promise<void> {
        this.clearSearch();
        this.closeMenu();

        if (result.action === 'cart') {
            cart.toggleCart();
            return;
        }

        if (!result.route) {
            return;
        }

        const destination = this.router.createUrlTree(
            [result.route],
            result.fragment ? { fragment: result.fragment } : undefined
        );
        await this.router.navigateByUrl(destination);
    }

    clearSearch(): void {
        this.searchSubscription?.unsubscribe();
        this.searchQuery = '';
        this.searchResults = [];
        this.searchError = '';
        this.isSearching = false;
    }
}
