import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CyberRunnerComponent } from './components/cyber-runner/cyber-runner.component';

@NgModule({
  declarations: [
    CyberRunnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CyberRunnerComponent
  ]
})
export class CyberRunnerModule { }
