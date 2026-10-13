import { Injectable } from '@angular/core';
import { Obstacle } from '../models/obstacle.model';
import { ObstacleType } from '../enums/obstacle-type.enum';
import { Particle } from '../models/particle.model';
import { GameConfig } from '../models/game-config.model';

@Injectable({
  providedIn: 'root'
})
export class EntityManagerService {
  createObstacle(type: ObstacleType, canvasWidth: number): Obstacle {
    const width = 30 + Math.random() * 20;
    let y: number;
    let height: number;
    let color: string;

    if (type === ObstacleType.LOW) {
      height = 40 + Math.random() * 20;
      y = 360 - height;
      color = '#ff007f';
    } else {
      height = 40;
      y = 250;
      color = '#ffff00';
    }

    return {
      type,
      x: canvasWidth,
      y,
      width,
      height,
      color
    };
  }

  createParticle(x: number, y: number, color: string, globalSpeed: number): Particle {
    return {
      x,
      y,
      size: Math.random() * 4 + 2,
      vx: (Math.random() - 0.5) * 6 - (globalSpeed * 0.2),
      vy: (Math.random() - 0.5) * 6,
      alpha: 1,
      decay: Math.random() * 0.03 + 0.01,
      color
    };
  }

  updateObstacle(obstacle: Obstacle, globalSpeed: number): void {
    obstacle.x -= globalSpeed;
  }

  updateParticle(particle: Particle): void {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.alpha -= particle.decay;
  }

  isObstacleOffScreen(obstacle: Obstacle): boolean {
    return obstacle.x + obstacle.width < 0;
  }

  isParticleDead(particle: Particle): boolean {
    return particle.alpha <= 0;
  }

  shouldSpawnObstacle(timer: number, nextSpawnTime: number): boolean {
    return timer >= nextSpawnTime;
  }

  calculateNextSpawnTime(baseInterval: number): number {
    return baseInterval * (0.7 + Math.random() * 0.6);
  }

  getRandomObstacleType(): ObstacleType {
    return Math.random() > 0.5 ? ObstacleType.LOW : ObstacleType.HIGH;
  }
}
