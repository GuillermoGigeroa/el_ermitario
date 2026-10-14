import { CartItem } from './cart-item.model';

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
