import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HelperService } from './helper';
import { LoadingService } from './loading';

import * as ServiceSettings from './config';

@Injectable()
export class TransferGPSService {
	http: any;
	transferGPSURL:any;
    interval: any;
    gpsData : any;

    constructor(private httpService: Http,
                private storage: Storage,
                private helper: HelperService,
                private toast : ToastController,
                private loading: LoadingService,
                private geolocation: Geolocation) {
     	this.http = httpService;
    	this.transferGPSURL = ServiceSettings.SERVER_URL + '/api/transfergps';
    	
    }


    createTransferGPS(jsonBody) {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.http.post(this.transferGPSURL, jsonBody, header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }


    startGPSTracking() {
        this.trackGPS();
        this.interval = setInterval(() => {
            this.trackGPS();
        }, ServiceSettings.TRACK_INTERVAL);
        this.storage.set('intervalID', this.interval);
        
    }

    trackGPS() {
        this.storage.get('user').then((user) => {
            this.storage.get('gpsData').then((gps) => {
                this.geolocation.getCurrentPosition().then((resp) => {
                    if (gps == null){
                        gps = [];
                    }
                    gps.push(resp.coords.latitude);
                    gps.push(resp.coords.longitude);
                    gps.push(user.sfid);
                    gps.push(this.helper.formatDate(new Date()));
                    this.storage.set('gpsData', gps);
                });
            });
        });
        
    }

    stopGPSTracking() {
         this.storage.get('intervalID').then((iId) => {
            clearInterval(iId);
             this.storage.get('gpsData').then((gps) => {
                if (gps.length > 0){
                    var body = { colNames : ['latitude__c', 'longitude__c', 'driver__c', 'createddate'],
                                 vals : gps};
                    this.createTransferGPS(body).then( data => {
                        this.storage.remove('gpsData');
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
                }
             });
         });
    }

   

}
