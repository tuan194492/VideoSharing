import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VideoService } from 'src/app/services/video.service';
export interface DialogData {
  title: string;
  description: string;
  id: string;
}

@Component({
  selector: 'app-update-video',
  templateUrl: './update-video.component.html',
  styleUrls: ['./update-video.component.scss']
})
export class UpdateVideoComponent implements OnInit {
  name: string =''
  description: string =''
  constructor(
    private httpService :VideoService,
    public dialogRef: MatDialogRef<UpdateVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}
  video:any=''
  ngOnInit(): void {
    console.log(this.data)
     
  }
  getName(name: string) {
    this.name = name
  }
  getDescription(description:string){
    this.description = description
  }
  submitData() {
    // var formData = new FormData();
    // formData.set("title", this.name);
    // formData.set("description", this.description);
    var body= {title:this.name, description:this.description}
    console.log(body);
    this.httpService.updateVideo(body,this.data.id).subscribe(data=>{    
      console.log(data);  
    })
  }

}
