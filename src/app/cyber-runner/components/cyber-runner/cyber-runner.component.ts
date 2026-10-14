import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { GameEngineService } from '../../services/game-engine.service';
import { StickerLoaderService } from '../../services/sticker-loader.service';
import { GameState } from '../../enums/game-state.enum';

@Component({
  selector: 'app-cyber-runner',
  templateUrl: './cyber-runner.component.html',
  styleUrls: ['./cyber-runner.component.scss'],
  standalone: false
})
export class CyberRunnerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas', { static: false }) gameCanvas!: ElementRef<HTMLCanvasElement>;

  GameState = GameState;
  currentGameState: GameState = GameState.MENU;
  score: number = 0;
  globalSpeed: number = 0;

  constructor(
    private gameEngineService: GameEngineService,
    private stickerLoaderService: StickerLoaderService
  ) {}

  ngAfterViewInit(): void {
    // Set internal canvas resolution (fixed for consistent rendering)
    this.gameCanvas.nativeElement.width = 800;
    this.gameCanvas.nativeElement.height = 400;

    this.gameEngineService.initialize(this.gameCanvas.nativeElement);
  }

  ngOnDestroy(): void {
    this.gameEngineService.cleanup();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.gameEngineService.handleKeyDown(event.key);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.gameEngineService.handleKeyUp(event.key);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.handleJump(event);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.handleJump(event);
  }

  private handleJump(event: MouseEvent | TouchEvent): void {
    // Check if the event target is the canvas or contains the canvas
    const canvas = this.gameCanvas.nativeElement;
    const target = event.target as HTMLElement;

    if (!canvas.contains(target) && target !== canvas) {
      return;
    }

    // Prevent default to avoid double triggering on touch devices
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      // Touch event - use the first touch
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }

    // Calculate position relative to canvas center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Check if canvas is rotated (landscape mode on mobile)
    const isRotated = rect.width > rect.height;

    let shouldJump: boolean;

    if (isRotated) {
      // When rotated 90°, the top half corresponds to the right half visually
      // So we check if the touch is on the right side of the canvas
      shouldJump = clientX > centerX;
    } else {
      // Normal orientation - check if touch is in top half
      shouldJump = clientY < centerY;
    }

    if (shouldJump) {
      // Trigger jump using the same logic as keyboard
      this.gameEngineService.handleKeyDown(' ');
    }
  }

  startGame(): void {
    this.gameEngineService.startGame();
    this.updateGameState();
  }

  restartGame(): void {
    this.gameEngineService.startGame();
    this.updateGameState();
  }

  private updateGameState(): void {
    const interval = setInterval(() => {
      this.currentGameState = this.gameEngineService.getGameState();
      this.score = this.gameEngineService.getScore();
      this.globalSpeed = this.gameEngineService.getGlobalSpeed();

      if (this.currentGameState === GameState.GAMEOVER) {
        clearInterval(interval);
      }
    }, 100);
  }
}
