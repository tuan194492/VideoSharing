import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoServiceComponent } from './video-service.component';

describe('VideoServiceComponent', () => {
  let component: VideoServiceComponent;
  let fixture: ComponentFixture<VideoServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
