import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from './models/cart.model';
import { CartItem } from './models/cart-item.model';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false
})
export class CartComponent implements OnInit {
  cart$: Observable<Cart>;
  isCartOpen = false;

  constructor(private cartService: CartService) {
    this.cart$ = this.cartService.getCart();
  }

  ngOnInit(): void {
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeFromCart(item.id);
    } else {
      this.cartService.updateCartItem(item.id, newQuantity).subscribe();
    }
  }

  removeFromCart(itemId: number): void {
    if (confirm('¿Estás seguro de eliminar este item del carrito?')) {
      this.cartService.removeFromCart(itemId).subscribe();
    }
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      this.cartService.clearCart().subscribe();
    }
  }

  checkout(): void {
    alert('Funcionalidad de checkout próximamente disponible');
    this.closeCart();
  }

  getImageUrl(item: CartItem): string {
    if (item.producto?.imagenBase64) {
      return 'data:image/png;base64,' + item.producto.imagenBase64;
    }
    return 'assets/images/1.png';
  }

  getProductName(item: CartItem): string {
    return item.producto?.nombre || 'Producto';
  }

  getProductPrice(item: CartItem): number {
    return item.producto?.precio || 0;
  }

  getItemTotal(item: CartItem): number {
    const price = this.getProductPrice(item);
    return price * item.cantidad;
  }
}
