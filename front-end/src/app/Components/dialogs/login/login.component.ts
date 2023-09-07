import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AuthComponent } from 'src/app/services/auth/auth.component';
import { RegisterComponent } from '../register/register.component';
export interface DialogData {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[AuthComponent]
})
export class LoginComponent implements OnInit {
  public errorLoginEmail =""
  public errorLoginPass =""
  public errorEmail =""
  public errorPassword ="" 
  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRefLogin: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private httpService :AuthComponent) { }
  loginForm = this.formBuilder.group({
    email: [''],
    password: [''],
  })
  ngOnInit(): void {
    // console.log(1)
    
  }
  loginform(){
    this.errorLoginEmail=""
    this.errorLoginPass=""
    if(this.loginForm.controls.email.value === ""){
      this.errorLoginEmail = "*Vui lòng nhập email của bạn"
    }
    if(this.loginForm.controls.password.value === ""){
      this.errorLoginPass = "*Vui lòng nhập mật khẩu của bạn"
    }
    if( this.loginForm.controls.email.value!=="" && this.loginForm.controls.password.value !==""){
      var account = {email : this.loginForm.controls.email.value , password : this.loginForm.controls.password.value}
      const loginAcount = JSON.stringify(account)
      console.log("ac")
      console.log(account)
      this.httpService.login(loginAcount).subscribe(data=>{
        console.log(data)
      })
      this.closeDialog()
    }

  }
  
closeDialog() {
  this.dialogRefLogin.close();
}
openDialogRegister(){
  
  
  const dialogRef = this.dialog.open(RegisterComponent, {
    width:"500px",
    height:"500px",
    // data: {email:this.email, password:this.password},
  });
  dialogRef.afterClosed().subscribe(result=>{
    
  })
}

}
