import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { LoginComponent } from '../dialogs/login/login.component';
 
// import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  email: string | undefined;
  password: string | undefined;
  user: any = null;

  // constructor(private auth: AngularFireAuth, private router: Router) {
  //   this.auth.authState.subscribe((authState) => (this.user = authState));
  // }
  constructor(public dialog: MatDialog){}

  ngOnInit(): void {}

  // public submit(form: NgForm): void {
  //   if (form.valid) {
  //      this.router.navigate(['search', form.value.search])
  //   }
  // }
  
  @Output() changeState = new EventEmitter<boolean>();
  isLogin: boolean | undefined;
  opened: boolean | undefined;
  
  changeEvent() {
    this.changeState.emit(!this.opened);
    this.opened = !this.opened;
  }
  openDialogLogin(){
    const dialogRef = this.dialog.open(LoginComponent, {
      width:"500px",
      height:"500px",
      data: {email:this.email, password:this.password},
    });
    dialogRef.afterClosed().subscribe(result=>{
      
    })
  }

}
