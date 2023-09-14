import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { HeaderComponent } from './Components/header/header.component';
import {MatIconModule,MatIconRegistry } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RowsComponent } from './Components/rows/rows.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import { YouTubePlayerModule } from '@angular/youtube-player';
import { VideoCardComponent } from './Components/video-card/video-card.component';
 import { HomeComponent } from './Components/home/home.component';
import { VideoManageComponent } from './Components/video-manage/video-manage.component';
import {MatDialogModule} from '@angular/material/dialog';
import { LoginComponent } from './Components/dialogs/login/login.component';
import { RegisterComponent } from './Components/dialogs/register/register.component';
import {CreateVideoComponent} from './Components/dialogs/create-video/create-video.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './services/auth/auth.component';
import { VideoServiceComponent } from './services/video-service/video-service.component';
import { CommentServiceComponent } from './services/comment-service/comment-service.component';
import { WatchVideoComponent } from './Components/watch-video/watch-video.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {YouTubePlayerModule} from '@angular/youtube-player';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule} from '@videogular/ngx-videogular/buffering'

@NgModule({
  declarations: [
    HomeComponent,
    VideoCardComponent,
    AppComponent,
    SideBarComponent,
    HeaderComponent,
    RowsComponent,
    VideoManageComponent,
    LoginComponent,
    RegisterComponent,
    AuthComponent,
    CreateVideoComponent,
    VideoServiceComponent,
    CommentServiceComponent,
    WatchVideoComponent,

  ],
  imports: [
    // YouTubePlayerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule, 
    BrowserModule,
    AppRoutingModule,
    MatListModule,YouTubePlayerModule,
    MatDialogModule,MatFormFieldModule,MatButtonModule,MatInputModule,ReactiveFormsModule,FormsModule,MatGridListModule,
    VgCoreModule,VgControlsModule,VgOverlayPlayModule,VgBufferingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
