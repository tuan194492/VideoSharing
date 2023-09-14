import { Component, OnInit } from '@angular/core';
import { VideoServiceComponent } from 'src/app/services/video-service/video-service.component';

@Component({
  selector: 'app-create-video',
  templateUrl: './create-video.component.html',
  styleUrls: ['./create-video.component.scss'],
  providers:[VideoServiceComponent]
})
export class CreateVideoComponent implements OnInit {
  name: string =''
  description: string =''

  file: any
  constructor( private httpService :VideoServiceComponent) { }

  ngOnInit(): void {
  }
  getName(name: string) {
    this.name = name
  }
  getDescription(description:string){
    this.description = description
  }
  getFile(event: any) {
    this.file = event.target.files[0];
    console.log("file: ", this.file);
  }
  submitData() {
    var formData = new FormData();
    formData.set("title", this.name);
    formData.set("description", this.description);
    formData.set("file", this.file);
    console.log(formData);
    this.httpService.importVideo(formData).subscribe(data=>{    
      console.log(data);  
    })
  }
}
