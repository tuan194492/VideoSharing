import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private httpOptions = {
    headers: new HttpHeaders({
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      // 'Content-Type': 'application/json',
      // Authorization: 'my-auth-token',
      // Authorization: 'Basic ' + btoa('username:password'),
    }),
  };
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
  }
  login(data: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/login', data, this.httpOptions);
  }
  register(data: any) {
    //options
    // let options = {
    //   headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
    // }

    return this.http.post("http://localhost:3000/api/auth/register", data, this.httpOptions);
  }
  public setToken(token: string) {
    localStorage.setItem('token', token);
  }
  idUser: string = '';
  setUserId(data: string){
    this.idUser=data;
   console.log(data);
  }
  getUserId() {
    console.log('alo')
    console.log(this.idUser);
    return this.idUser;
  }
  getPublisherVideo(id:string): Observable<any> {
    const url = 'http://localhost:3000/api/video/get-by-publisher/'+id;
    return this.http.get<any>(url,);
  }
  postSubcribe(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post('http://localhost:3000/api/subcriber/subcribe', data, {headers});
  }
  postUnSubcribe(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post('http://localhost:3000/api/subcriber/unsubcribe', data, {headers});
  }
  delete(id: string){
    const url = 'http://localhost:3000/api/video/'+id;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(url, { headers });


  }
  postComment(data: any, id: string) {
    const url = 'http://localhost:3000/api/comment/'+id;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(url, data, { headers });
  }
  getComment(id: string): Observable<any>{
    const url = 'http://localhost:3000/api/comment/'+id;
    console.log(url);
    return this.http.get<any>(url);
  }
}
