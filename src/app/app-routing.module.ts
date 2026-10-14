import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CameraFrameComponent } from './camera-frame/components/camera-frame/camera-frame.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'camera-frame', component: CameraFrameComponent },
  { path: 'favoritos', component: FavoritesComponent },
  { path: 'game', component: GameComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
