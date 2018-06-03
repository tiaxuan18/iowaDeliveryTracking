import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';


@Component({
  selector: 'page-logastop',
  templateUrl: 'logastop.html'
})
export class LogAStopPage {

  logastopFrm : FormGroup;

  constructor(public navCtrl: NavController, 
              private formBuilder: FormBuilder,
              private toast: ToastController,
              private storage: Storage) {
    this.logastopFrm = this.formBuilder.group({
    	reason: ['', Validators.required]
    });
  }
  	
  resume(){
  /*
    this.employeeService.findByEmail(this.loginFrm.value.username, this.loginFrm.value.password)
      .then( data => {
        let res = <any>{};
        res = data;
        this.storage.set('user', res.data);
        this.navCtrl.setRoot(HomePage, {}); 
      })
      .catch( errorReq => {
          var errorObj  = JSON.parse(errorReq._body);
          let t = this.toast.create({ message:errorObj.message, 
                              duration: 5000, 
                              position: 'top',
                              showCloseButton: true});
          t.present();
      })*/
  }
  	
}
