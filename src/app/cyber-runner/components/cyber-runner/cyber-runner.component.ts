import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { GameEngineService } from '../../services/game-engine.service';
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

  constructor(private gameEngineService: GameEngineService) {}

  ngAfterViewInit(): void {
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
