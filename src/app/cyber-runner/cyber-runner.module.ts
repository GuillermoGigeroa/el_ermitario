import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CyberRunnerComponent } from './components/cyber-runner/cyber-runner.component';

@NgModule({
  declarations: [
    CyberRunnerComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    CyberRunnerComponent
  ]
})
export class CyberRunnerModule { }
