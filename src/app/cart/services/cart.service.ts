import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { CartItem } from '../models/cart-item.model';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = '/api/carrito';
  private sessionId: string;
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {
    this.sessionId = this.getOrCreateSessionId();
    this.loadCart();
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('cartSessionId');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('cartSessionId', sessionId);
    }
    return sessionId;
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private loadCart(): void {
    this.http.get<CartItem[]>(`${this.apiUrl}/${this.sessionId}`).subscribe(
      items => {
        this.cartItemsSubject.next(items);
        this.loadProductsForCart(items);
      },
      error => {
        console.error('Error loading cart:', error);
        this.cartItemsSubject.next([]);
      }
    );
  }

  private loadProductsForCart(items: CartItem[]): void {
    if (items.length === 0) {
      this.productsSubject.next([]);
      return;
    }

    const productIds = items.map(item => item.productoId);
    this.productService.getProducts().subscribe(
      products => {
        const cartProducts = products.filter(p => productIds.includes(p.id));
        this.productsSubject.next(cartProducts);
      },
      error => {
        console.error('Error loading products:', error);
        this.productsSubject.next([]);
      }
    );
  }

  getCart(): Observable<Cart> {
    return combineLatest([this.cartItems$, this.products$]).pipe(
      map(([items, products]) => {
        const itemsWithProducts = items.map(item => ({
          ...item,
          producto: products.find(p => p.id === item.productoId)
        }));
        
        const total = itemsWithProducts.reduce((sum, item) => {
          return sum + (item.producto ? item.producto.precio * item.cantidad : 0);
        }, 0);

        const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);

        return {
          items: itemsWithProducts,
          total,
          itemCount
        };
      })
    );
  }

  addToCart(productoId: number, cantidad: number = 1): Observable<CartItem> {
    const body = {
      productoId,
      cantidad,
      sessionId: this.sessionId
    };

    return this.http.post<CartItem>(this.apiUrl, body).pipe(
      tap(() => this.loadCart())
    );
  }

  updateCartItem(id: number, cantidad: number): Observable<CartItem> {
    const body = { cantidad };
    return this.http.put<CartItem>(`${this.apiUrl}/${id}`, body).pipe(
      tap(() => this.loadCart())
    );
  }

  removeFromCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadCart())
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/session/${this.sessionId}`).pipe(
      tap(() => {
        this.cartItemsSubject.next([]);
        this.productsSubject.next([]);
      })
    );
  }

  getTotal(): Observable<number> {
    return this.getCart().pipe(map(cart => cart.total));
  }

  getItemCount(): Observable<number> {
    return this.getCart().pipe(map(cart => cart.itemCount));
  }
}
