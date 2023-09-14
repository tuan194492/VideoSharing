import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { VideoManageComponent } from './Components/video-manage/video-manage.component';
import { WatchVideoComponent } from './Components/watch-video/watch-video.component';
const routes: Routes = [
  // { path: 'videoManeger', component: VideoManageComponent },
  { path: 'videoManeger', component: VideoManageComponent },
  { path: 'watchVideo/:id', component: WatchVideoComponent},
  { path: '', component: HomeComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
