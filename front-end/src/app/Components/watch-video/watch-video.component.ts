import { Component, OnInit, ViewChild } from '@angular/core';
import { VideoServiceComponent } from 'src/app/services/video-service/video-service.component';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-watch-video',
  templateUrl: './watch-video.component.html',
  styleUrls: ['./watch-video.component.scss'],
  providers: [VideoServiceComponent],
})

export class WatchVideoComponent implements OnInit {
 
  constructor(private httpService :VideoServiceComponent,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params=>{
      console.log(params)
    })
  }
  StreamVideo(id:number){
    this.httpService.getStreamVideo(id).subscribe(data=>{    
      console.log(data);  
    })
  }

}
