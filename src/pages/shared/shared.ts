import { Observable } from 'rxjs/Observable';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

/**
 * Generated class for the SharedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shared',
  templateUrl: 'shared.html',
})
export class SharedPage {
  sharedLists: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseService: FirebaseServiceProvider,
     public alertCtrl:AlertController, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharedPage');
    this.firebaseService.authState.subscribe(user => {
      if (user){
        this.sharedLists = this.firebaseService.getSharedLists();
      }
    })
  }
addItemToList(listId, listName){
     let prompt = this.alertCtrl.create({
      title: 'Add new item for '+listName,
      message: 'Enter the name of the item',
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
        text: 'Add item',
        handler: data => {
          //let lName = data.name;
          this.firebaseService.addListItem(listId, data.name).then(data2 =>{
            console.log('Added item '+ data.name );
            this.presentToast('Added '+data.name);
          })
          .catch(err => {
            this.presentToast('Error adding item '+err.message);
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
}
