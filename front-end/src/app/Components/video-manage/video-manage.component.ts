import { Component, OnInit } from '@angular/core';
import { MatDialog,MatDialogRef  } from '@angular/material/dialog';
import { AuthComponent } from 'src/app/services/auth/auth.component';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { UpdateVideoComponent } from '../dialogs/update-video/update-video.component';



@Component({
  selector: 'app-video-manage',
  templateUrl: './video-manage.component.html',
  styleUrls: ['./video-manage.component.scss'],
  providers:[AuthComponent]
})
export class VideoManageComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'url', 'view','createdAt','update','delete'];
  userId: string=''
  videos:any=''
  dataSource : any='';
  constructor( private httpService :AuthserviceService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userId=this.httpService.getUserId()
    var id=this.userId
    var user = {publisherId:id}
    console.log(user)
    this.httpService.getPublisherVideo(id).subscribe(res=>{
      this.videos=res.data
      this.dataSource = res.data
      console.log(this.videos)

    })
  }
  openDialog(id:any): void {
    const dialogRef = this.dialog.open(UpdateVideoComponent, {
      data: {title: this.videos[id-1].title, description: this.videos[id-1].description,id:id},
    });
    dialogRef.afterClosed().subscribe((result) => {
    this.ngOnInit();
    console.log('close');
    });
    
  }


  // getlistManagerVideo(){}
  
  onDelete(id:any){
    this.httpService.delete(id).subscribe(res =>{
     
      })
      this.ngOnInit();
  }
  openDialogCreateVideo(){
    const dialogRef = this.dialog.open(UpdateVideoComponent, {
      width:"960px",
      height:"400px",
      // data: {email:this.email, password:this.password},
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog đã đóng.');
      // Bạn có thể thực hiện các hành động sau khi dialog đã đóng ở đây.
    });
  } 

}
