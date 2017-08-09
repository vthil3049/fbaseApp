import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  logout()
  {
    this.firebaseService.logoutUser().then(()=>{
      //this.navCtrl.setRoot('LoginPage');
    })  ;

  }
}
