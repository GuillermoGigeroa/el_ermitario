import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.scss'],
  standalone: false
})
export class ConfettiComponent {
  @Input() trigger: boolean = false;
  particles: any[] = [];

  constructor() {
    this.initParticles();
  }

  private initParticles(): void {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8', '#00b894', '#e17055'];
    
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        left: Math.random() * 100,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: Math.random() * 2,
        animationDuration: Math.random() * 2 + 2,
        size: Math.random() * 8 + 6
      });
    }
  }
}
