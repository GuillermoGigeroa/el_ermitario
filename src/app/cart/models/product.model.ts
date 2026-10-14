export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenBase64: string;
  stock: number;
  categoria: string;
  activo: boolean;
}
