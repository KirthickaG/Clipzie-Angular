import { Component, OnInit, OnDestroy,Input,OnChanges, Output,EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import Iclip from 'src/app/models/clip.model';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit,OnChanges {

  @Input() activeClip:Iclip | null = null  
  @Output() update = new EventEmitter()

  clipID = new FormControl('')

  title = new FormControl('',[
  Validators.required,
  Validators.minLength(3)
  ])

  showAlert = false;
  alertMsg = 'Please wait the its getting edited...'
  alertColor ='blue'
  insubmission = false


  editForm = new FormGroup(
    {
      title : this.title
    }
  )

  constructor(private modal:ModalService, private clipService : ClipService) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnDestroy():void{
    this.modal.unregister('editClip')
  }

  ngOnChanges(): void {
    if(!this.activeClip)
    {
      return
    }
    this.insubmission = false
    this.showAlert = false
    this.clipID.setValue(this.activeClip.docID)
    this.title.setValue(this.activeClip.title)
  }

  async submit()
  {
    if(!this.activeClip)
    {
      return
    }
    this.showAlert = true;
    this.alertMsg = 'Please wait Updating Clip'
    this.alertColor ='blue'
    this.insubmission = true
    try
    {

      await this.clipService.updateClip(this.clipID.value,this.title.value)
    }
    catch(e)
    {
      this.insubmission = false
      this.alertColor = 'red'
      this.alertMsg = "Something went wrong, try gain later"
      return
    }
    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip)

    this.alertMsg = 'Success! Your clip is uploaded'
    this.alertColor ='green'
    this.insubmission= false

  }

}
