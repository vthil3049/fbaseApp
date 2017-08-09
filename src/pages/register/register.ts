import {EmailValidator } from '../../validators/email';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  signupForm: FormGroup;
  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder:FormBuilder,
    public firebaseService: FirebaseServiceProvider, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) 
  {
    this.signupForm = formBuilder.group({
      email:['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      name: ['', Validators.compose([Validators.required, Validators.minLength(2)])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  signupUser() {
    if (this.signupForm.valid){
      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.firebaseService.signUp(this.signupForm.value.email,this.signupForm.value.password,this.signupForm.value.name)
      .then((newUser)=> 
      {
        this.loading.dismiss().then(() =>{
          //this.navCtrl.setRoot('LoginPage');
        });
      },
      error => {
        this.loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            title: 'Error',
            message: error.message,
            buttons: [
              { text: 'OK',
            role: 'cancel'}
            ]
          });
          alert.present();

        });
      });

    }
  }

}
