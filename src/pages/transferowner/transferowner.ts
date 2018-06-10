import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';
import { LoadingService } from '../../providers/loading';
import { OpportunityService } from '../../providers/opportunity';
import { TransferLogService } from '../../providers/transferlog';
import { TransferGPSService } from '../../providers/transfergps';
import { HelperService } from '../../providers/helper';


@Component({
  selector: 'page-transferowner',
  templateUrl: 'transferowner.html'
})
export class TransferOwnerPage {

  transOwnerFrm : FormGroup;
  transitItem : any;

  constructor(public navCtrl: NavController, 
              private formBuilder: FormBuilder,
              private toast: ToastController,
              private storage: Storage,
              private oppoService : OpportunityService,
              private loading: LoadingService,
              private transfer : TransferLogService,
              private transferGPS : TransferGPSService,
              private helper : HelperService) {
    this.transOwnerFrm = this.formBuilder.group({
    	reason: ['', Validators.required]
    });
    this.storage.get('intransit').then((tItem) => {
      this.transitItem = tItem;
    });
  }

  transferItem(){
    this.loading.show();
    debugger;
    var body = { colNames : ['transfer_ownership_reason__c'],
                   vals : [this.transOwnerFrm.value.reason]}
    this.transferGPS.stopGPSTracking();
    this.transfer.createTransferOwner(body)
      .then( data => {
          this.transferOpportunity();
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
  	
  transferOpportunity(){
    var bodyOppo = { colNames : ['arrival_time__c', 'status__c', 'driver__c'],
                   vals : [this.helper.formatDate(new Date()), 'Pending', '']}

    this.oppoService.updateOpportunity(this.transitItem.sfid, bodyOppo)
          .then( data => {
            this.loading.hide();
            let t = this.toast.create({ message: 'The item has been put back in process', 
                                        duration: 5000, 
                                        position: 'top',
                                        showCloseButton: true});
            t.present(); 
            this.storage.remove('intransit');
            t.onDidDismiss(() => {
               this.navCtrl.setRoot(HomePage);  
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
