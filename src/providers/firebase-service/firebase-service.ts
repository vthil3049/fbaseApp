import { AngularFireAuthModule } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase } from 'angularfire2/database';
import {Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
/*
  Generated class for the FirebaseServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FirebaseServiceProvider {
  user: firebase.User;
  authState: Observable<firebase.User>;

  constructor(public http: Http, private afAuth:AngularFireAuth, public afd:AngularFireDatabase) {
    console.log('Hello FirebaseServiceProvider Provider');
    this.authState = afAuth.authState;
    this.authState.subscribe(user => {
      this.user = user;
    });
  }

  signUp(email, password, name){
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(newUser=>{
      this.afd.list('/userProfile').update(newUser.uid, {email:email, name:name});
    });
  }

  loginUser(email, password){
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(user =>{
      console.log("User is "+user.displayName+" email is "+user.email);
    });
  }

  logoutUser()
  {
    return this.afAuth.auth.signOut();
  }

}
