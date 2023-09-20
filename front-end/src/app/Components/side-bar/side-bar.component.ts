import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  showLogins: boolean = false;
 
  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem('token')){
      this.showLogins=true;
    }
  }

}
