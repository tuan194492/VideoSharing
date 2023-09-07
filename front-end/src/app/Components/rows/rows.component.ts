import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rows',
  templateUrl: './rows.component.html',
  styleUrls: ['./rows.component.scss']
})
export class RowsComponent implements OnInit {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() selected: boolean = false;
  @Input() live: boolean = false;
  @Input() svg: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
