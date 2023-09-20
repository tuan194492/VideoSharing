import { Component, OnInit, ViewChild } from '@angular/core';
import { VideoServiceComponent } from 'src/app/services/video-service/video-service.component';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';
import { AuthserviceService } from 'src/app/services/authservice.service';
@Component({
  selector: 'app-watch-video',
  templateUrl: './watch-video.component.html',
  styleUrls: ['./watch-video.component.scss'],
  providers: [VideoServiceComponent],
})

export class WatchVideoComponent implements OnInit {
  videolist: any;
  constructor(
    private videos: VideoService,
    private httpService :AuthserviceService,
    private route: ActivatedRoute) { }
  comment:string=''
  commentList:any=''
  idTotal: string = ''
  currentLikeColor: string = ''; // Màu mặc định
  currentDisLikeColor: string = ''; //
  video: any = ''
  src: any = ''
  channelId: string = ''
  subcribeText:string = '';
  subcribeBoolean:boolean = false;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log(params.get('id'))
      let id = params.get('id');

      if (id) {
        this.StreamVideo(id)
        this.src = 'http://localhost:3000/api/video/stream/' + id
      }
    })
    this.getAll()
  }
  getAll() {
    
    this.videos.getlistVideos().subscribe((res: any) => {
      console.log(res.data);
      this.videolist = res.data;
    })
  }
  StreamVideo(id: string) {
    this.videos.getStreamVideo(id).subscribe(res => {
      console.log(res.data);
      this.video = res.data;
      if(this.video.liked==true) {this.currentLikeColor='blue'}
      else {this.currentLikeColor=''}
      if(this.video.disliked==true) {this.currentDisLikeColor='blue'}
      else {this.currentDisLikeColor=''}
      if( this.video.subcribed==true) {this.subcribeText='Đã Đăng ký'}
      else {this.subcribeText='Đăng ký'}
      this.idTotal = res.data.id;
      console.log('idtotal',this.idTotal);
      this.channelId= res.data.publisher_id
      console.log('channelid',this.channelId)
      this.getComment()
    })

   

  }
  like(id: string) {
    this.videos.LikeVideo(id).subscribe(res => {
      this.ngOnInit()
      console.log(res);
    })
  }
  disLike(id: string) {
    this.videos.disLikeVideo(id).subscribe(res => {
      this.ngOnInit()
      console.log(res);

    })
  }
  changeLikeColor() {
    // Thay đổi màu theo logic của bạn. Ví dụ, chuyển đổi giữa đỏ và xanh.
    if (this.currentLikeColor === '') {
      this.currentLikeColor = 'blue';
      this.like(this.idTotal)
    } else {
      this.currentLikeColor = '';
    }
  }

  changeDislikeLikeColor() {
 
    // Thay đổi màu theo logic của bạn. Ví dụ, chuyển đổi giữa đỏ và xanh.
    if (this.currentDisLikeColor === '') {
      this.currentDisLikeColor = 'blue';
      this.disLike(this.idTotal)
    } else {
      this.currentDisLikeColor = '';
    }
  }
  subcribe(){
    if ( this.subcribeText='Đã Đăng ký'){
      this.subcribeText='Đăng ký'    
      var id=this.channelId
    var sub = {channelId:id}
    console.log(sub)
    this.httpService.postUnSubcribe(sub).subscribe(data=>{
      console.log(data);
    })
      // this.videos.subscribe.
    }else{
    this.subcribeText = 'Đã Đăng ký'
    
    var id=this.channelId
    var sub = {channelId:id}
    this.httpService.postSubcribe(sub).subscribe(data=>{
      console.log(data);
    })
  }
  }
  loadAgain(){
    this.ngOnInit()
     window.location.reload();
  }
  
  getcomment(comment: string) {
    this.comment = comment
  }
  submitData() {
    // var formData = new FormData();
    // formData.set("title", this.name);
    // formData.set("description", this.description);
    var body= {comment:this.comment}
    console.log(body);
    this.httpService.postComment(body,this.idTotal).subscribe(data=>{    
      console.log(data);  
    })
    this.getComment()
  }
  getComment(){
    this.httpService.getComment(this.idTotal).subscribe(res=>{    
    
      this.commentList = res.data.rows
      console.log(this.commentList);  
    })
  }
}
