import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CyberRunnerComponent } from './components/cyber-runner/cyber-runner.component';
import { GameComponent } from '../game/game.component';

@NgModule({
  declarations: [
    CyberRunnerComponent,
    GameComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    CyberRunnerComponent,
    GameComponent,
  ]
})
export class CyberRunnerModule { }
