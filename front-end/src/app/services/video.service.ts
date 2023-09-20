import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  
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
  updateVideo(data: any, id: string) {
    const url = 'http://localhost:3000/api/video/'+id;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(url, data, { headers });
  }
  getlistVideos(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/video/watch');
  }
  getStreamVideo(id:string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    const url = 'http://localhost:3000/api/video/'+id;
    return this.http.get<any>(url,{ headers });
  
  }
  LikeVideo(id:string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    const url = 'http://localhost:3000/api/react/like/'+id;
    return this.http.post(url,{},{ headers });
  
  }
  disLikeVideo(id:string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    const url = 'http://localhost:3000/api/react/dislike/'+id;
    return this.http.post(url,{},{ headers });
  }
}
