import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isAuthenticate = false
  constructor(public modal:ModalService, public auth :AuthService,
    public router:Router) {

    this.auth.isAuthenticated$.subscribe(status =>{
      this.isAuthenticate = status
    })
   }

  ngOnInit(): void {
  }

  openModal($event: Event)
  {
    $event.preventDefault();
    this.modal.toggleModal('auth')
  }
  
}
