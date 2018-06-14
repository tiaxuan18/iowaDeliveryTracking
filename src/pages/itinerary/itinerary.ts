import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import { OpportunityService } from '../../providers/opportunity';
import { TransferGPSService } from '../../providers/transfergps';
import { LoadingService } from '../../providers/loading';

import { TransfersPage } from '../transfers/transfers';
import { InTransitPage } from '../intransit/intransit';

declare var google;

@Component({
  selector: 'page-itinerary',
  templateUrl: 'itinerary.html'
})
export class ItineraryPage {
  data: any;
  user: any;
  inTransit : any;
  returns:any;
  directionMatrixService = new google.maps.DistanceMatrixService();

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toast: ToastController,
              public alertCtrl: AlertController,
              private storage: Storage,
              private loading: LoadingService,
              private oppoService : OpportunityService,
              private transferGPS : TransferGPSService,
              private geolocation: Geolocation) {

    this.returns = [];
    this.data = {transfers:[], returns:[]};
    this.inTransit = false;
    this.loading.show();
    this.storage.get('user').then((user) => {
      this.user = user;
      oppoService.getInTransit(user.sfid)
      .then( dataInTransit => {
          let inTransitData = <any>{};
          inTransitData = dataInTransit
          if (inTransitData.data.length > 0){
            this.inTransit = true;
            let t = this.toast.create({ message: 'You have items in transit',
                                duration: 5000, 
                                position: 'top',
                                showCloseButton: true,
                                cssClass: 'toast-warn'});
            t.present();
          }
          oppoService.getItineraries(user.sfid)
          .then( data => {
            this.loading.hide();
            this.storage.set('itinerary', data);
            this.data = data;
            for(let ret of this.data.returns) {
              ret.addedToReturn = false;
            }
          })
          .catch( errorReq => {
            this.loading.hide();
            var errorObj  = JSON.parse(errorReq._body);
            if (errorObj.message){
              let t = this.toast.create({ message:errorObj.message, 
                                  duration: 5000, 
                                  position: 'top',
                                  showCloseButton: true,
                                  cssClass: 'toast-error'});
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
                                showCloseButton: true,
                                cssClass: 'toast-error'});
            t.present();
          }
        });
      });

  }

  itemTapped(item, isReturn) {
    if (!this.inTransit){
      this.loading.show();
      this.geolocation.getCurrentPosition().then((resp) => {
        var origin = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        var end = item.receiving_street_address__c + ',' + 
                  item.receiving_city__c +  ',' +
                  item.receiving_state__c +  ',' +
                  item.receiving_zip_code__c ;
        this.directionMatrixService.getDistanceMatrix({
            origins: [origin],
            destinations: [end],
            travelMode: 'DRIVING'
        }, (response, status) => {
            this.loading.hide();
            if (response.rows[0].elements[0].status === 'OK') {
             let alert = this.alertCtrl.create({
                title: 'ETA',
                subTitle: response.rows[0].elements[0].duration.text,
                buttons: [{
                  text: 'Cancel'
                },
                {
                  text: 'Go',
                  handler: data => {
                    if (isReturn){
                      for(let i=0;i<this.returns.length;i++){
                        if (i == this.returns.length -1){
                          this.doGo(this.returns[i], true);
                        } else {
                          this.doGo(this.returns[i], false);
                        }
                      }
                    } else {
                      this.doGo(item, true);
                    }
                  }
                }]
              });
              alert.present();
            } 
          });
      }).catch((error) => {
        this.loading.hide();
         console.log('Error getting location', error);
      });
    }
  }

  doGo(selectedItem, lastItem){
    this.loading.show();
    var body = { colNames : ['driver__c', 'status__c'],
                 vals : [this.user.sfid, 'In Transit']}

    this.oppoService.updateOpportunity(selectedItem.sfid, body)
        .then( data => {
          this.loading.hide(); 
          if (lastItem){
            this.transferGPS.startGPSTracking();
            this.navCtrl.setRoot(InTransitPage, {selectedItem});  
          }
        })
        .catch( errorReq => {
            this.loading.hide();  
            var errorObj  = JSON.parse(errorReq._body);
            if (errorObj.message){
              let t = this.toast.create({ message:errorObj.message, 
                                  duration: 5000, 
                                  position: 'top',
                                  showCloseButton: true,
                                  cssClass: 'toast-error'});
              t.present();
            }
        });
       
  }

  addReturn(item) {
    if (!this.inTransit){

      this.returns.push(item);
      let t = this.toast.create({ message: 'Return added',
                                  duration: 5000, 
                                  position: 'top',
                                  showCloseButton: true,
                                  cssClass: 'toast-success'});
      t.present();
      item.addedToReturn = true;
    }
    
  }

  transferReturns() {
    if (!this.inTransit){
      this.itemTapped(this.returns[0], true);
    }
    
  }

  addTransfers(item) {
    this.navCtrl.push(TransfersPage);
  }

}
