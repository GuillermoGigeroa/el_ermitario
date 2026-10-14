import { Injectable } from '@angular/core';
import { Observable, from, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StickerAsset } from '../models/sticker-asset.model';
import { ProductService } from '../../cart/services/product.service';
import { Product } from '../../cart/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class StickerLoaderService {
  private stickerCache: StickerAsset[] = [];
  private staticImagePaths = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png'];

  constructor(private productService: ProductService) {}

  loadStaticStickers(): Promise<StickerAsset[]> {
    const promises = this.staticImagePaths.map(path => {
      return new Promise<StickerAsset>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            id: path,
            name: `Sticker ${path.replace('.png', '')}`,
            image: img,
            isFromApi: false
          });
        };
        img.onerror = () => {
          console.error(`Failed to load sticker: ${path}`);
          resolve({
            id: path,
            name: `Sticker ${path.replace('.png', '')}`,
            image: img,
            isFromApi: false
          });
        };
        img.src = `assets/images/${path}`;
      });
    });

    return Promise.all(promises).then(stickers => {
      this.stickerCache = [...this.stickerCache, ...stickers];
      return stickers;
    });
  }

  loadApiStickers(): Observable<StickerAsset[]> {
    return this.productService.getProducts().pipe(
      map(products => {
        const stickers: StickerAsset[] = [];
        products
          .filter(p => p.activo && p.imagenBase64)
          .forEach(product => {
            const img = new Image();
            img.src = 'data:image/png;base64,' + product.imagenBase64;
            stickers.push({
              id: `api-${product.id}`,
              name: product.nombre,
              image: img,
              isFromApi: true,
              productId: product.id
            });
          });
        this.stickerCache = [...this.stickerCache, ...stickers];
        return stickers;
      }),
      catchError(error => {
        console.error('Failed to load API stickers:', error);
        return of([]);
      })
    );
  }

  getAllStickers(): StickerAsset[] {
    return this.stickerCache;
  }

  getRandomSticker(): StickerAsset | null {
    if (this.stickerCache.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * this.stickerCache.length);
    return this.stickerCache[randomIndex];
  }

  preloadImages(): Promise<void> {
    return this.loadStaticStickers().then(() => {
      console.log(`Loaded ${this.stickerCache.length} static stickers`);
    });
  }

  private convertBase64ToImage(base64: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = 'data:image/png;base64,' + base64;
    });
  }
}
