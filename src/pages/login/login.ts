import { EmailValidator } from '../../validators/email';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    public firebaseService: FirebaseServiceProvider, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  goToSignUp() {
    this.navCtrl.push('RegisterPage');
  }

  loginUser() {
    if (this.loginForm.valid) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.firebaseService.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then((newUser) => {
          this.loading.dismiss().then(() => {
            //this.navCtrl.setRoot('TabsPage');
          });
        },
        error => {
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              title: 'Error',
              message: error.message,
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel'
                }
              ]
            });
            alert.present();

          });
        });
    }
  }

  resetPassword() {
    let prompt = this.alertCtrl.create({
      title: 'Reset Password',
      message: 'Enter your email below',
      inputs: [
        {
          name: 'email',
          placeholder: 'youremail@domain.com',
          type: 'email'
        }
      ],
      buttons: [
      {
        text: 'Cancel',
        role: 'cancel',

      },
      {
        text: 'Reset',
        handler: data => {
          this.firebaseService.resetPassword(data.email).then(data => {
            this.showBasicAlert('Success', 'Check your email for further instructions');
          })
          .catch(err => {
            this.showBasicAlert('Failed to reset', err.message);
          });
        }
      }
    ]
    });
    prompt.present();
  }

  showBasicAlert(title, text){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();

  }
}
