import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-video-service',
  templateUrl: './video-service.component.html',
  styleUrls: ['./video-service.component.scss']
})
export class VideoServiceComponent implements OnInit {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  importVideo(data: FormData) {
   
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post("http://localhost:3000/api/video", data, { headers });
  }
  getlistVideos(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/video/watch');
  }
  getStreamVideo(id:number): Observable<any>{
    const url = 'http://localhost:3000/api/video/stream/'+id;
    return this.http.get<any>(url);
  
  }
}
