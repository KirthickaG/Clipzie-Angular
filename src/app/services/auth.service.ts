import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable,of } from 'rxjs';
import {delay,map,filter,switchMap} from 'rxjs/operators'
import IUser from '../models/user.model';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$ :Observable<boolean>
  public isAuthenticatedWithDelay$ :Observable<boolean>
  private redirect = false

  constructor(private auth:AngularFireAuth, private db:AngularFirestore,public router:Router,
    private aroute:ActivatedRoute) {
    this.userCollection = db.collection('users')
    this.isAuthenticated$ = auth.user.pipe(
     map(user => !!user)
   )
   this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
     delay(500)
   )

   this.router.events.pipe(
     filter(e => e instanceof NavigationEnd), // from router getting navigationend event emitted
     map(e => this.aroute.firstChild), // from activated route service user moved new route firstchild observable
     switchMap(route => route?.data ?? of({})) // from that get data observable hence using switchMap operator // nullession operator pushing observable // of operator will create new observable that pushes empty object
   ).subscribe(data => {
     this.redirect = data['authOnly']
   })

}

  public async createUser(userData:IUser)
  {
    const userCreden = await this.auth.createUserWithEmailAndPassword(
      userData.email,userData.password) 
      // console.log(userCreden)
      // this.db.collection<IUser>('users').add(
      //   {
      //     name :userData.name,
      //     email:userData.email,
      //     age:userData.age,
      //     phoneNo:userData.phoneNo,
      //   }
      // )


      await this.userCollection.doc(userCreden.user.uid).set(
          {
            name :userData.name,
            email:userData.email,
            age:userData.age,
            phoneNo:userData.phoneNo,
          }
        )

       await userCreden.user.updateProfile(
          {
            displayName:userData.name
          }
        )
  }

  public async logout($event?: Event)
  {
    if($event)
    {
      $event.preventDefault()
    }

    await this.auth.signOut()

    if(this.redirect) // if user in about page and logout should not go to home page, p.s should be in /about 
    {
      await this.router.navigateByUrl('/') 
    }

  }
}
