import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute,Params } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import Iclip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  videoOrder = '1'
  clips :Iclip[]=[]
  activeClip : Iclip | null = null
  sort$:BehaviorSubject<string>    ///observable

  constructor(public router: Router,public _aroute:ActivatedRoute,
    private clipsService:ClipService,
    private modal:ModalService) 
    {
        this.sort$ = new BehaviorSubject(this.videoOrder)
    }

  ngOnInit(): void {
    this._aroute.queryParams.subscribe((params:Params)=>
    {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1'
      this.sort$.next(this.videoOrder)
    })

    this.clipsService.getUserClips(this.sort$).subscribe(docs =>
      {
        this.clips = []
        docs.forEach(doc =>
          {
            this.clips.push(
              {
                docID: doc.id,
                ...doc.data()
              }
            )
          })
      })
  }

  sort(event :Event)
  {
    const {value} = (event.target as HTMLSelectElement)

    // this.router.navigateByUrl(`/manage?sort=${value}`)
    this.router.navigate([],{
      relativeTo: this._aroute,
      queryParams:
      {
        sort:value
      }
    })
  }

  openModal($event:Event, clip:Iclip)
  {
    $event.preventDefault();

    this.activeClip = clip

    this.modal.toggleModal('editClip')
  }

  update($event:Iclip)
  {
    this.clips.forEach((element,index) =>
    {
      if(element.docID == $event.docID)
      {
        this.clips[index].title = $event.title
      }
    })
  }
  deleteClip($event:Event,clip:Iclip)
  {
    $event.preventDefault()
    this.clipsService.deleteClip(clip)

    this.clips.forEach((element,index) =>
    {
      if(element.docID == clip.docID)
      {
        this.clips.splice(index,1)
      }
    })
  }

  async copyToClipBoard($event :MouseEvent, docID: string | undefined)
  {
      $event.preventDefault

      if(!docID)
      {
        return
      }

      const url = `${location.origin}/clip/${docID}`

      await navigator.clipboard.writeText(url)

      alert('Link copied!')
  }
}
