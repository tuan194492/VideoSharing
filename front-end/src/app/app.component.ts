import { Component, Input } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FE_VideoSharing';
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "access_point",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/access_point.svg")
    );
  }
  opened: boolean = true;
  


  changeState(event: boolean ) {
    this.opened = event;
    console.log('from app');
  }

}
