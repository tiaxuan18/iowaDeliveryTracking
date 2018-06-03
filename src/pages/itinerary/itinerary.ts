import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { OpportunityService } from '../../providers/opportunity';
import { ETAPage } from '../eta/eta';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-itinerary',
  templateUrl: 'itinerary.html'
})
export class ItineraryPage {
  items: Array<any>;
  user: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public oppoService : OpportunityService,
              private toast: ToastController,
              private storage: Storage) {
    this.storage.get('user').then((user) => {
    debugger;
      oppoService.getItineraries(user.sfid)
        .then( data => {
          debugger;
          let res = <any>{};
          res = data;
          this.storage.set('itinerary', res.data);
          this.items = [];
          if (res.data instanceof Array) {
            this.items = res.data;
          } else{
            this.items.push(res.data);
          }
        })
        .catch( errorReq => {
            var errorObj  = JSON.parse(errorReq._body);
            if (errorObj.message){
              let t = this.toast.create({ message:errorObj.message, 
                                  duration: 5000, 
                                  position: 'top',
                                  showCloseButton: true});
              t.present();
            }
        });
      });

  }

  itemTapped(item) {
    this.navCtrl.push(ETAPage, {
      item: item
    });
  }

}
