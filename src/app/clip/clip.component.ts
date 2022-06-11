import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import videojs from 'video.js';
import Iclip from '../models/clip.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers : [DatePipe]
})
export class ClipComponent implements OnInit {

  id =''
  @ViewChild('videoPlayer',{static:true}) target?: ElementRef
  player:videojs.Player
  clip?:Iclip

  constructor(public _aroute:ActivatedRoute) { }

  ngOnInit(): void {
    // this.id = this._aroute.snapshot.params['id'];

    this.player = videojs(this.target?.nativeElement)

    // this._aroute.params.subscribe((params:Params) => 
    //   {
    //     this.id = params['id']  /// here it is observable property
    //   })

    this._aroute.data.subscribe(data =>
      {
        this.clip = data['clip'] as Iclip

        this.player?.src(
          {
            src: this.clip.url,
            type: 'video/mp4'
          }
        )
      })
  }


}
