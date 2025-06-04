import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerComponent } from './video-player.component';

describe('VideoPlayerComponent', () => {
  let component: VideoPlayerComponent;
  let fixture: ComponentFixture<VideoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid video URL', () => {
    expect(component.videoURL).toBeDefined();
    expect(component.videoURL.toString()).toContain('https://www.youtube.com/embed/Z9eD6ujmK0Y');
  });

  it('should sanitize the video URL', () => {
    const sanitizedUrl = component.videoURL.toString();
    expect(sanitizedUrl).toContain('https://www.youtube.com/embed/');
    expect(sanitizedUrl).toContain('autoplay=1');
    expect(sanitizedUrl).toContain('loop=1');
    expect(sanitizedUrl).toContain('mute=1');
    expect(sanitizedUrl).toContain('controls=0');
  });
});
