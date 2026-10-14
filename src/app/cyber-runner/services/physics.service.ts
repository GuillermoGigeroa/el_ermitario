import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import { Obstacle } from '../models/obstacle.model';
import { GameConfig } from '../models/game-config.model';

@Injectable({
  providedIn: 'root'
})
export class PhysicsService {
  applyGravity(player: Player, config: GameConfig): void {
    if (!player.isGrounded) {
      player.vy += config.gravity;
      player.y += player.vy;
    }
  }

  applyJump(player: Player, config: GameConfig): boolean {
    if (player.isGrounded && !player.isDucking) {
      player.vy = config.jumpForce;
      player.isGrounded = false;
      return true;
    }

    return false;
  }

  checkGroundCollision(player: Player, groundY: number): void {
    if (player.y >= groundY) {
      player.y = groundY;
      player.vy = 0;
      player.isGrounded = true;
    }
  }

  updatePlayerDuckState(player: Player, isDucking: boolean, groundY: number): void {
    if (isDucking && player.isGrounded) {
      player.isDucking = true;
      player.height = player.baseHeight / 2;
      player.y = groundY;
    } else {
      player.isDucking = false;
      player.height = player.baseHeight;
    }
  }

  checkCollisionAABB(rect1: { x: number; y: number; width: number; height: number },
                     rect2: { x: number; y: number; width: number; height: number }): boolean {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }
}
