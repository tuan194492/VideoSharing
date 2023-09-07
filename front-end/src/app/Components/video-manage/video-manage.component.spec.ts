import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoManageComponent } from './video-manage.component';

describe('VideoManageComponent', () => {
  let component: VideoManageComponent;
  let fixture: ComponentFixture<VideoManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
