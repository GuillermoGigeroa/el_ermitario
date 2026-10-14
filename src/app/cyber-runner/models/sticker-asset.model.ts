export interface StickerAsset {
  id: string;
  name: string;
  image: HTMLImageElement;
  isFromApi: boolean;
  productId?: number;
}
