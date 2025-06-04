import { Component, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  imports: [],
  template: ` <div class="video-wrapper">
    @if (videoId()) {
    <iframe
      width="560"
      height="315"
      [src]="videoURL"
      title="Justice League"
      frameborder="0"
      allow="autoplay; encrypted-media"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
    } @else {
      <p>No video ID provided.</p>
    }
  </div>`,
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent {
  private readonly sanitizer = inject(DomSanitizer)
  public videoURL: SafeResourceUrl;
  readonly videoId = input<string>('Z9eD6ujmK0Y');
  
  constructor() {
    const autoplay = 1;
    const mute = 1;
    const loop = 1;
    const controls = 0;
    const showInfo = 0;
    const modestBranding = 1;
    const iv_loadPolicy = 3;
    const rel = 0;
    const disablekb = 1;

    const url = `https://www.youtube.com/embed/${this.videoId()}?autoplay=${autoplay}&mute=${mute}&playlist=${this.videoId()}&loop=${loop}&controls=${controls}&showinfo=${showInfo}&modestbranding=${modestBranding}&iv_load_policy=${iv_loadPolicy}&rel=${rel}&disablekb=${disablekb}`;
    this.videoURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
