import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.scss']
})
export class VideoCardComponent implements OnInit {
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() channel: string = '';
  @Input() views: string = '';
  @Input() timestamp: string = '';
  @Input() live: string = 'false';
  constructor() { }

  ngOnInit(): void {
  }

}
