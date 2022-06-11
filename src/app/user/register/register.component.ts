import { Component} from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  constructor(private auth:AuthService,private emailTaken: EmailTaken){}
  insubmission = false
  name = new FormControl("", [Validators.required,Validators.minLength(3)]);
  email = new FormControl('',[Validators.required,Validators.email],[this.emailTaken.validate]);
  age = new FormControl('',[Validators.required,Validators.min(18),Validators.max(100)]);
  password = new FormControl('',[Validators.required,Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)]);
  confirmpwd = new FormControl('',[Validators.required]);
  phoneNo = new FormControl('',[Validators.required,Validators.minLength(12),Validators.maxLength(12)]);

  showAlert = false;
  alertMsg = 'Your account is being created'
  alertColor ='blue'

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmpwd: this.confirmpwd,
    phoneNo: this.phoneNo
    },[RegisterValidators.match('password','confirmpwd')]);

 async register()
 {
   this.showAlert =true;
   this.alertMsg = 'Your account is being created'
   this.alertColor ='blue'
   this.insubmission = true
   try
   {
    this.auth.createUser(this.registerForm.value)
   }
   catch(e)
   {
      this.alertMsg ="Unexpected error occured";
      this.alertColor = "red"
      this.insubmission = false
      return
   }

   this.alertMsg = "Successfully created"
   this.alertColor ="green"
 }

}
