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

  removeItem(itemId, listId){
    this.firebaseService.removeShoppingItem(listId, itemId);
  }

  shareList(listId, listName){
        let prompt = this.alertCtrl.create({
      title: 'Share your list '+listName,
      message: 'Enter the email of the person you want to share with',
      inputs: [
        {
          name: 'email',
          type: 'email'
        }
      ],
      buttons: [
      {
        text: 'Cancel',
        role: 'cancel',

      },
      {
        text: 'Share List',
        handler: data => {
          //let lName = data.name;
          this.firebaseService.shareList(listId, listName, data.email).then(data2 =>{
            //console.log('Shared list '+ data.email );
            this.presentToast('Shared list with '+data.email);
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

}
