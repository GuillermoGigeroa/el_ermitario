import { ObstacleType } from '../enums/obstacle-type.enum';

export interface Obstacle {
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  image?: HTMLImageElement;
  isSticker?: boolean;
  stickerName?: string;
}
