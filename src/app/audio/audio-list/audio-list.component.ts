import {Component, Input} from '@angular/core';
import {Audio} from "../audio.model";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-audio-list',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgForOf,
  ],
  templateUrl: './audio-list.component.html',
  styleUrl: './audio-list.component.css'
})
export class AudioListComponent {
  @Input() audioData: { audio: Audio, url: SafeUrl }[] = [];
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
}
