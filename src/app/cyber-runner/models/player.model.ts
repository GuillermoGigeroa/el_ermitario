export interface Player {
  baseX: number;
  x: number;
  y: number;
  baseWidth: number;
  baseHeight: number;
  width: number;
  height: number;
  vy: number;
  isGrounded: boolean;
  isDucking: boolean;
  color: string;
}
