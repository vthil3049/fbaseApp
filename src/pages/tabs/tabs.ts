import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TabsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1= "HomePage";
  tab2= "SharedPage";
  tab3= "ProfilePage";
  invitationCount: number=0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
        this.firebaseService.authState.subscribe(user => {
        if (user){
          this.firebaseService.getUserInvitations().subscribe(data => {
            this.invitationCount = data.length;
          });
        }
    });
  }

}
