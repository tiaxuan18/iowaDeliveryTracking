import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../../providers/loading';
import { TransferLogService } from '../../providers/transferlog';
import { HelperService } from '../../providers/helper';


import { HomePage } from '../home/home';
import { InTransitPage } from '../intransit/intransit';



@Component({
  selector: 'page-logastop',
  templateUrl: 'logastop.html'
})
export class LogAStopPage {

  logastopFrm : FormGroup;
  item : any;
  transitItem : any;
  stopBegan : Boolean;
  t : any;

  constructor(public navCtrl : NavController, 
              private formBuilder : FormBuilder,
              private toast : ToastController,
              private storage : Storage,
              private loading : LoadingService,
              private transfer : TransferLogService,
              private helper : HelperService) {
    this.stopBegan = false;
    this.logastopFrm = this.formBuilder.group({
        reason : ['', Validators.required],
        description : ['', Validators.required]
    });
    this.loading.show();
    this.storage.get('intransit').then((tItem) => {
      this.transitItem = tItem;
      this.storage.get('loggedastop').then((lasItem) => {
        this.loading.hide();
        if (lasItem){
          this.item = lasItem;
          this.logastopFrm.controls['reason'].setValue(lasItem.reason);
          this.logastopFrm.controls['description'].setValue(lasItem.description);
          this.stopBegan = true;
        } 
      });
     
    });
  }
  
  beginStop(){
    this.loading.show();
    var body = {  colNames : ["stop_reason__c", "stop_details__c", "begin_stop__c", "transfer__c"],
                  vals : [this.logastopFrm.value.reason, this.logastopFrm.value.description, this.helper.formatDate(new Date()), this.transitItem.sfid]}

    this.transfer.createLogAStop(body)
          .then( data => {
            this.loading.hide(); 
            let t = this.toast.create({ message: 'Stop Logged', 
                                        duration: 5000, 
                                        position: 'top',
                                        showCloseButton: true});
            t.present();
            let res = <any>{};
            res = data;
            this.item = res.data;
            this.item.reason = this.logastopFrm.value.reason;
            this.item.description = this.logastopFrm.value.description;
            this.storage.set('loggedastop', this.item);
            
          })
          .catch( errorReq => {
              this.loading.hide();  
              var errorObj  = JSON.parse(errorReq._body);
              if (errorObj.message){
                let t = this.toast.create({ message:errorObj.message, 
                                    duration: 5000, 
                                    position: 'top',
                                    showCloseButton: true});
                t.present();
            }
     });
  
  }
  	
  resume(){
    this.loading.show();
    var body = {  colNames : ['finish_stop__c'],
                  vals : [this.helper.formatDate(new Date())]}


    this.transfer.updateTransferLog(this.item.id, body)
          .then( data => {
            this.loading.hide(); 
            let t = this.toast.create({ message: 'Resumed', 
                                        duration: 5000, 
                                        position: 'top',
                                        showCloseButton: true});
            t.present(); 
            this.storage.remove('loggedastop');
            t.onDidDismiss(() => {
               this.navCtrl.setRoot(InTransitPage, {item: this.transitItem});  
            });

            
          })
          .catch( errorReq => {
              this.loading.hide();  
              var errorObj  = JSON.parse(errorReq._body);
              if (errorObj.message){
                let t = this.toast.create({ message:errorObj.message, 
                                    duration: 5000, 
                                    position: 'top',
                                    showCloseButton: true});
                t.present();
            }
     });
  }
}
