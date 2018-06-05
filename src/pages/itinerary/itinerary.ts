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

    this.data = {transfers:[], returns:[]};
    this.loading.show();
    this.storage.get('user').then((user) => {
      this.user = user;
      oppoService.getItineraries(user.sfid)
        .then( data => {
          this.loading.hide();
          this.storage.set('itinerary', data);
          this.data = data
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
      });

  }

  itemTapped(item) {
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
                  this.doGo(item);
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


  doGo(selectedItem){
    this.loading.show();
    var body = { colNames : ['driver__c', 'status__c'],
                 vals : [this.user.sfid, 'In Transit']}

    this.oppoService.updateOpportunity(selectedItem.sfid, body)
        .then( data => {
          this.loading.hide(); 
          this.transferGPS.startGPSTracking();
          this.navCtrl.setRoot(InTransitPage, {selectedItem});  
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

  addTransfers(item) {
    this.navCtrl.push(TransfersPage);
  }

}
