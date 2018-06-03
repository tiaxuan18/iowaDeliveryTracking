import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { EmployeeService } from '../../providers/employee';
import { HomePage } from '../home/home';
import { LoadingService } from '../../providers/loading';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginFrm : FormGroup;

  constructor(private navCtrl: NavController, 
              private toast: ToastController,
              private storage: Storage,
              private formBuilder: FormBuilder,
              public employeeService : EmployeeService,
              private loading: LoadingService) {
    this.loginFrm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
   
  }
  	
  onLogin(){
    this.loading.show();
    this.employeeService.findByEmail(this.loginFrm.value.username, this.loginFrm.value.password)
      .then( data => {
        this.loading.hide();
        let res = <any>{};
        res = data;
        this.storage.set('user', res.data);
        this.navCtrl.setRoot(HomePage, {}); 
      })
      .catch( errorReq => {
          this.loading.hide();
          var errorObj  = JSON.parse(errorReq._body);
          let t = this.toast.create({ message:errorObj.message, 
                              duration: 5000, 
                              position: 'top',
                              showCloseButton: true});
          t.present();
      })
  }
  	
}
