import { Component, OnInit,Input,OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() modalID=''
  constructor(public modal: ModalService,public el:ElementRef) { 
  }

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement)
  }

  ngOnDestroy(): void{
    document.body.removeChild(this.el.nativeElement)
  }

  closeModal($event: Event)
  {
    $event.preventDefault();
    this.modal.toggleModal(this.modalID)
  }
}
