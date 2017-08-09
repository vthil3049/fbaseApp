import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
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
  shoppingLists: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider,
  public alertCtrl:AlertController, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.firebaseService.authState.subscribe(user => {
      if (user) {
        this.shoppingLists = this.firebaseService.getUserLists();
      }
      else {
         this.shoppingLists = null;       
      }
    });
    console.log('ionViewDidLoad HomePage');
  }
  newList() {
    let prompt = this.alertCtrl.create({
      title: 'Create a Shopping List',
      message: 'Enter a name for your list',
      inputs: [
        {
          name: 'name',
          type: 'text'
        }
      ],
      buttons: [
      {
        text: 'Cancel',
        role: 'cancel',

      },
      {
        text: 'Create',
        handler: data => {
          //let lName = data.name;
          this.firebaseService.createNewList(data.name).then(data2 =>{
            console.log('Shopping list created '+ data.name );
            this.presentToast('Created list '+data.name);
          })
          .catch(err => {
            this.presentToast('Error creating list '+err.message);
          });
        }
      }
    ]
    });
    prompt.present();
  }

  presentToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  logout() {
    this.firebaseService.logoutUser();
  }

  removeList(id){
    this.firebaseService.removeList(id);
  }
}
