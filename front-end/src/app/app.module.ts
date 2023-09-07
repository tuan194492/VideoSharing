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
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './services/auth/auth.component';
import { VideosComponent } from './services/videos/videos.component';
import { CommentsComponent } from './services/comments/comments.component';
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
    VideosComponent,
    CommentsComponent,

  ],
  imports: [
    // YouTubePlayerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule, 
    BrowserModule,
    AppRoutingModule,
    MatListModule,
    MatDialogModule,MatFormFieldModule,MatButtonModule,MatInputModule,ReactiveFormsModule,FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
