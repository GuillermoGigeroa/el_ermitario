import { Injectable, NgZone } from '@angular/core';
import { GameState } from '../enums/game-state.enum';
import { GameConfig } from '../models/game-config.model';
import { Player } from '../models/player.model';
import { Obstacle } from '../models/obstacle.model';
import { Particle } from '../models/particle.model';
import { PhysicsService } from './physics.service';
import { EntityManagerService } from './entity-manager.service';
import { StickerLoaderService } from './sticker-loader.service';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  private config: GameConfig = {
    gravity: 0.6,
    jumpForce: -14,
    baseSpeed: 6,
    speedIncrement: 0.0005,
    spawnIntervalBase: 1200,
    maxParticles: 30
  };

  private gameState: GameState = GameState.MENU;
  private score: number = 0;
  private globalSpeed: number = this.config.baseSpeed;
  private lastTime: number = 0;
  private obstacleTimer: number = 0;
  private nextSpawnTime: number = this.config.spawnIntervalBase;

  private player: Player = {
    baseX: 100,
    x: 100,
    y: 300,
    baseWidth: 40,
    baseHeight: 60,
    width: 40,
    height: 60,
    vy: 0,
    isGrounded: true,
    isDucking: false,
    color: '#00fff2'
  };

  private obstacles: Obstacle[] = [];
  private particles: Particle[] = [];
  private keys = { jump: false, duck: false };

  private animationFrameId: number = 0;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor(
    private ngZone: NgZone,
    private physicsService: PhysicsService,
    private entityManagerService: EntityManagerService,
    private stickerLoaderService: StickerLoaderService
  ) {}

  initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.renderInitialCanvas();
  }

  async preloadAssets(): Promise<void> {
    await this.stickerLoaderService.preloadImages();
  }

  startGame(): void {
    this.preloadAssets().then(() => {
      this.obstacles = [];
      this.particles = [];
      this.score = 0;
      this.globalSpeed = this.config.baseSpeed;
      this.obstacleTimer = 0;
      this.nextSpawnTime = this.config.spawnIntervalBase;
      this.gameState = GameState.PLAYING;
      this.resetPlayer();

      this.lastTime = performance.now();
      this.ngZone.runOutsideAngular(() => {
        this.gameLoop();
      });
    });
  }

  stopGame(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  triggerGameOver(): void {
    this.gameState = GameState.GAMEOVER;
    this.stopGame();
  }

  handleKeyDown(key: string): void {
    if (this.gameState !== GameState.PLAYING) return;

    if (key === 'w' || key === 'W' || key === 'ArrowUp' || key === ' ') {
      this.keys.jump = true;
      this.physicsService.applyJump(this.player, this.config);
      this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height, '#ff007f');
    }
    if (key === 's' || key === 'S' || key === 'ArrowDown') {
      this.keys.duck = true;
    }
  }

  handleKeyUp(key: string): void {
    if (key === 'w' || key === 'W' || key === 'ArrowUp' || key === ' ') {
      this.keys.jump = false;
    }
    if (key === 's' || key === 'S' || key === 'ArrowDown') {
      this.keys.duck = false;
    }
  }

  getGameState(): GameState {
    return this.gameState;
  }

  getScore(): number {
    return this.score;
  }

  getGlobalSpeed(): number {
    return this.globalSpeed;
  }

  private resetPlayer(): void {
    this.player.x = this.player.baseX;
    this.player.y = 300;
    this.player.width = this.player.baseWidth;
    this.player.height = this.player.baseHeight;
    this.player.vy = 0;
    this.player.isGrounded = true;
    this.player.isDucking = false;
  }

  private gameLoop(timestamp?: number): void {
    if (this.gameState !== GameState.PLAYING) return;

    if (!timestamp) {
      timestamp = performance.now();
    }

    let deltaTime = timestamp - this.lastTime;
    if (deltaTime > 100) deltaTime = 16.66;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.render();

    this.animationFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  private update(deltaTime: number): void {
    this.globalSpeed += this.config.speedIncrement * deltaTime;
    this.score += 0.05 * deltaTime;

    const groundY = 360 - this.player.height;
    this.physicsService.updatePlayerDuckState(this.player, this.keys.duck, groundY);
    this.physicsService.applyGravity(this.player, this.config);
    this.physicsService.checkGroundCollision(this.player, 360 - this.player.height);

    this.obstacleTimer += deltaTime;
    if (this.entityManagerService.shouldSpawnObstacle(this.obstacleTimer, this.nextSpawnTime)) {
      const type = this.entityManagerService.getRandomObstacleType();
      const sticker = this.stickerLoaderService.getRandomSticker();
      if (this.canvas) {
        this.obstacles.push(this.entityManagerService.createObstacle(type, this.canvas.width, sticker || undefined));
      }
      this.obstacleTimer = 0;
      this.nextSpawnTime = this.entityManagerService.calculateNextSpawnTime(this.config.spawnIntervalBase);
    }

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      this.entityManagerService.updateObstacle(this.obstacles[i], this.globalSpeed);

      if (this.physicsService.checkCollisionAABB(this.player, this.obstacles[i])) {
        this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#ff0000');
        this.triggerGameOver();
        return;
      }

      if (this.entityManagerService.isObstacleOffScreen(this.obstacles[i])) {
        this.obstacles.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.entityManagerService.updateParticle(this.particles[i]);
      if (this.entityManagerService.isParticleDead(this.particles[i])) {
        this.particles.splice(i, 1);
      }
    }
  }

  private render(): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = '#323454';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 360);
    this.ctx.lineTo(this.canvas.width, 360);
    this.ctx.stroke();

    this.drawPlayer();
    this.obstacles.forEach(obs => this.drawObstacle(obs));
    this.particles.forEach(p => this.drawParticle(p));

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 18px monospace';
    this.ctx.fillText(`SCORE: ${Math.floor(this.score)}`, 20, 35);
    this.ctx.fillStyle = '#00fff2';
    this.ctx.fillText(`SPEED: ${this.globalSpeed.toFixed(1)}x`, 680, 35);
  }

  private drawPlayer(): void {
    if (!this.ctx) return;
    this.ctx.save();
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = this.player.color;
    this.ctx.fillStyle = this.player.color;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    this.ctx.restore();
  }

  private drawObstacle(obstacle: Obstacle): void {
    if (!this.ctx) return;
    this.ctx.save();
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = obstacle.color;

    if (obstacle.image && obstacle.isSticker) {
      this.ctx.drawImage(
        obstacle.image,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );
    } else {
      this.ctx.fillStyle = obstacle.color;
      this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
    this.ctx.restore();
  }

  private drawParticle(particle: Particle): void {
    if (!this.ctx) return;
    this.ctx.save();
    this.ctx.globalAlpha = particle.alpha;
    this.ctx.fillStyle = particle.color;
    this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    this.ctx.restore();
  }

  private createExplosion(x: number, y: number, color: string): void {
    for (let i = 0; i < 15; i++) {
      if (this.particles.length < this.config.maxParticles) {
        this.particles.push(this.entityManagerService.createParticle(x, y, color, this.globalSpeed));
      }
    }
  }

  private renderInitialCanvas(): void {
    if (!this.ctx || !this.canvas) return;
    this.ctx.fillStyle = '#141624';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = '#323454';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 360);
    this.ctx.lineTo(this.canvas.width, 360);
    this.ctx.stroke();
  }

  cleanup(): void {
    this.stopGame();
    this.canvas = null;
    this.ctx = null;
  }
}
