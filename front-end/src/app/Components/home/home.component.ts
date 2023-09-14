import { Component, OnInit } from '@angular/core';
import { VideoServiceComponent } from 'src/app/services/video-service/video-service.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:[VideoServiceComponent]
})
export class HomeComponent implements OnInit {
  videolist: any;
  constructor(private videos: VideoServiceComponent,) {
  }

  ngOnInit(): void {
    console.log('home');
this.getAll()
  }
  getAll() {
    console.log('1');
    this.videos.getlistVideos().subscribe((res: any) => {
      console.log(res.data);
      this.videolist = res.data;
    })
  }
}