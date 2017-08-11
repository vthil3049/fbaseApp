import { AngularFireAuthModule } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
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

  constructor(public http: Http, private afAuth: AngularFireAuth, public afd: AngularFireDatabase) {
    console.log('Hello FirebaseServiceProvider Provider');
    this.authState = afAuth.authState;
    this.authState.subscribe(user => {
      this.user = user;
    });
  }

  signUp(email, password, name) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        this.afd.list('/userProfile').update(newUser.uid, { email: email, name: name });
      });
  }

  loginUser(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        console.log("User is " + user.displayName + " email is " + user.email);
      });
  }

  logoutUser() {
    return this.afAuth.auth.signOut();
  }

  resetPassword(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  createNewList(name) {
    return this.afd.list('/shoppingLists').push({
      name: name,
      creator: this.user.email
    });
  }

  getUserLists() {
    return this.afd.list('/shoppingLists', {
      query: {
        orderByChild: 'creator',
        equalTo: this.user.email
      }
    })
      .map(lists => {
        return lists.map(oneList => {
          oneList.shoppingItems = this.afd.list('/shoppingLists/' + oneList.$key + '/items');
          return oneList;
        });
      });
  }

  removeList(id) {
    this.afd.list('/shoppingLists').remove(id);

  }

  addListItem(listId, item) {
    return this.afd.list('/shoppingLists/' + listId + '/items').push({ name: item });

  }

  removeShoppingItem(listId, itemId) {
    this.afd.list('/shoppingLists/' + listId + '/items').remove(itemId);
  }

  shareList(listId, listName, shareWithEmail) {
    return this.afd.list('/invitations').push({ listId: listId, listName: listName, toEmail: shareWithEmail, fromEmail: this.user.email });

  }
  getUserInvitations() {
    return this.afd.list('/invitations', {
      query: {
        orderByChild: 'toEmail',
        equalTo: this.user.email
      }
    });

  }

  acceptInvitation(invitation) {
    this.discardInvitation(invitation.$key);
    let data = {
      [this.user.uid]: true
    }
    return this.afd.object('/shoppingLists/' + invitation.listId).update( data);
  }

  discardInvitation(inviteId) {
    this.afd.list('/invitations').remove(inviteId);
  }

  getSharedLists() {
    return this.afd.list('/shoppingLists', {
      query: {
        orderByChild: this.user.uid,
        equalTo: true
      },
    })
      .map(lists => {
        console.log(lists);
        return lists.map(oneList => {
          oneList.shoppingItems = this.afd.list('/shoppingLists/' + oneList.$key + '/items');
          return oneList;
        });
      });
  }

}

