import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { AngularFireModule } from 'angularfire2';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  fbName: FirebaseObjectObservable<any>;
  todos: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, public db: AngularFireDatabase) {
    this.fbName = this.db.object('/myname');
    this.todos = this.db.list('/todos');

  }
  setName(newName) {
    this.fbName.set({name:newName});
  }

  addTodo(newTodo){
    this.todos.push({text: newTodo});
  }

  removeTodo(key){
    this.todos.remove(key);
  }

}
