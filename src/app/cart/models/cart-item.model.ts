import { Product } from './product.model';

export interface CartItem {
  id: number;
  productoId: number;
  cantidad: number;
  sessionId: string;
  producto?: Product;
}
