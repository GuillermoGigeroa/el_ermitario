import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { NavigationService } from './shared/services/navigation.service';
import { UtilsService } from './shared/services/utils.service';
import { DataService } from './shared/services/data.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CameraFrameModule } from './camera-frame/camera-frame.module';
import { CartModule } from './cart/cart.module';
import { CyberRunnerModule } from './cyber-runner/cyber-runner.module';
import { HomeComponent } from './home/home.component';
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FavoritesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    CameraFrameModule,
    CartModule,
    CyberRunnerModule,
  ],
  providers: [
    DataService,
    NavigationService,
    UtilsService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
