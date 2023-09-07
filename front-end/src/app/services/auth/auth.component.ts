import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token',
      // Authorization: 'Basic ' + btoa('username:password'),
    }),
  };
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  login(data:any): Observable<any>{
    return this.http.post('http://localhost:3000/api/auth/login',data,this.httpOptions);
  }
  register(data:any){
    //options
    let options={
        headers : new HttpHeaders().set("Content-Type","application/x-www-form-urlencoded")
    }
    return this.http.post("http://localhost:3000/api/auth/register",data,this.httpOptions);
}
}
