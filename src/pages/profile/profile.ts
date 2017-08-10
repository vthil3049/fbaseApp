import { Observable } from 'rxjs/Observable';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';



/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  invitations: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public firebaseService: FirebaseServiceProvider, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.firebaseService.authState.subscribe(user => {
      if (user){
        this.invitations = this.firebaseService.getUserInvitations();
      }
    });
  }

  acceptInvitation(invitation){
    this.firebaseService.acceptInvitation(invitation).then(() => {
      this.presentToast('Invitation Accepted');
    });
  }

  discardInvitation(inviteId){
    this.firebaseService.discardInvitation(inviteId);
  }


  presentToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
