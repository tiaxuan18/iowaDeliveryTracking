import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { OpportunityService } from '../../providers/opportunity';
import { LoadingService } from '../../providers/loading';

import { TransferDetailPage } from '../transferdetail/transferdetail';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-transfers',
  templateUrl: 'transfers.html'
})
export class TransfersPage {
  transfers: any;
  returns: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toast: ToastController,
              private storage: Storage,
              public oppoService : OpportunityService,
              public loading: LoadingService) {
    this.transfers = [];
    this.returns = [];
    this.loading.show();
    oppoService.getTransfers()
      .then( data => {

        let res = <any>{};
        res = data;
        this.storage.set('transfers', res.data);
        this.transfers = res.data;

        oppoService.getReturns()
        .then( data => {
          this.loading.hide();
          let res = <any>{};
          res = data;
          this.storage.set('returns', res.data);
          this.returns = res.data;
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

  itemTapped(item) {
    this.navCtrl.push(TransferDetailPage, {
      item: item
    });
  }

  goHome() {
    this.navCtrl.setRoot(HomePage); 
  }

}
