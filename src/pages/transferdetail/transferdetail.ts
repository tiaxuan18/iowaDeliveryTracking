import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { OpportunityLineService } from '../../providers/opportunityline';
import { OpportunityService } from '../../providers/opportunity';

import { LoadingService } from '../../providers/loading';
import { TransfersPage } from '../transfers/transfers';

@Component({
  selector: 'page-transfers',
  templateUrl: 'transferdetail.html'
})
export class TransferDetailPage {
  item: any;
  lines : any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toast: ToastController,
              public loading: LoadingService,
              public oppLineService : OpportunityLineService,
              public oppoService : OpportunityService) {

    this.loading.show();
    this.item = this.navParams.data.item;
    oppLineService.getOpportunityLines(this.item.sfid)
      .then( data => {
        this.loading.hide();  
        let res = <any>{};
        res = data;
        this.lines = res.data;
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

  addToItinerary(){
    this.loading.show();
    //this.storage.get('user').then((user) => {
    debugger;
      var body = { "colNames" : ['drive__c', 'status__c'],
                   "vals" : ['a1cm0000002VU6W', 'Pending']}

      this.oppoService.updateOpportunity(this.item.sfid, body)
        .then( data => {
          this.navCtrl.setRoot(TransfersPage); 
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
     // });


  	
  }

}
