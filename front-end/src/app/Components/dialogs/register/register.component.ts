import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthComponent } from 'src/app/services/auth/auth.component';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers:[AuthComponent]
})
export class RegisterComponent implements OnInit {
  public errorEmail =""
  public errorPassword ="" 
  constructor(private formBuilder: FormBuilder,
    private httpService :AuthserviceService,
    public dialogRefRegister: MatDialogRef<RegisterComponent>,) { }
  registerForm = this.formBuilder.group({
    email: [''],
    password1: [''],
    password2: [''],
    name: [''],

  })
  ngOnInit(): void {
    console.log('register');
  }
  registerform(){
    this.errorEmail =""
    this.errorPassword =""
    var filter = /^\w+@[a-zA-Z]{3,}\.com$/i;
    var a= String(this.registerForm.controls.email.value)
    if(!filter.test(a)){
      this.errorEmail = "*Vui lòng nhập đúng định dạng!"
    }
    if(this.registerForm.controls.password1.value != this.registerForm.controls.password2.value){
      this.errorPassword ="*Mật khẩu nhập lại không chính xác!"
    }
    if(this.errorEmail =="" && this.errorPassword ==""){
      var Acount = {name: this.registerForm.controls.name.value, email: this.registerForm.controls.email.value, password: this.registerForm.controls.password1.value}
      const newAcount = JSON.stringify(Acount)
      console.log(newAcount)
      this.httpService.register(Acount).subscribe(data=>{
        console.log(data)
      })
      this.closeDialog()
    }

  }

  closeDialog() {
    this.dialogRefRegister.close();
  }
}
