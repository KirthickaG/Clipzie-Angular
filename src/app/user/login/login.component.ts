import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email:'',
    password:''
  }
  constructor(private auth:AngularFireAuth) { }

  showAlert = false;
  alertMsg = 'You are Logging In'
  alertColor ='blue'
  insubmission = false

  ngOnInit(): void {
  }

  async login()
  {
    this.showAlert = true;
    this.alertMsg = 'You are Logging In'
    this.alertColor ='blue'
    this.insubmission = true

    try{
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,this.credentials.password
      )
    }
    catch(e)
    {
      this.alertMsg ="Unexpected error occured";
      this.alertColor = "red"
      this.insubmission = false
      return
    }
    this.alertMsg = "Successfully Logged In"
    this.alertColor ="green"
  }
}
