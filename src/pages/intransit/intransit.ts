import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

import { OpportunityService } from '../../providers/opportunity';
import { LoadingService } from '../../providers/loading';
import { TransferGPSService } from '../../providers/transfergps';

import { LogAStopPage } from '../logastop/logastop';
import { TransferOwnerPage } from '../transferowner/transferowner';
import { ItineraryPage } from '../itinerary/itinerary';

declare var google;

@Component({
  selector: 'page-intransit',
  templateUrl: 'intransit.html'
})
export class InTransitPage {
	
	@ViewChild('map') mapElement: ElementRef;
	@ViewChild('directionsPanel') directionsPanel: ElementRef;
	map: any;
	directionsService = new google.maps.DirectionsService;
  	directionsDisplay = new google.maps.DirectionsRenderer;
  	item : any;
  	user : any;
  	returns: any;
  	destination : any;
  	hasTransfer: any;


  	constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toast: ToastController,
              private storage: Storage,
              private loading: LoadingService,
              private oppoService : OpportunityService,
              private geolocation: Geolocation,
              private transferGPS : TransferGPSService,
              private launchNavigator: LaunchNavigator) {

        this.hasTransfer = false;
       	this.loading.show();
    	this.storage.get('user').then((user) => {
	      	this.user = user;
	      	oppoService.getInTransit(user.sfid)
	        	.then( data => {
	          		let res = <any>{};
			        res = data;
			        if (res.data.length > 0){
			        	this.hasTransfer = true;
			        	this.item = res.data[0];
			        	this.returns = res.data;
			        	this.storage.set('intransit', res.data[0]);
			        	this.loadMap();
			        } else {
			        	this.loading.hide();
			        	let t = this.toast.create({ message: 'Nothing in transit!', 
		                                duration: 5000, 
		                                position: 'top',
		                                showCloseButton: true});
		            	t.present();
			        }
			        
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

  	loadMap(){
  		this.geolocation.getCurrentPosition().then((resp) => {
		 	var origin = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
		 	this.destination = this.item.receiving_street_address__c + ',' + 
                this.item.receiving_city__c +  ',' +
                this.item.receiving_state__c +  ',' +
                this.item.receiving_zip_code__c ;
		 	this.map = new google.maps.Map(this.mapElement.nativeElement, {
		      zoom: 15,
		      center: origin,
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    });

		    this.directionsDisplay.setMap(this.map);
        	this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);

		 	this.directionsService.route({
		      origin: origin,
		      destination: this.destination,
		      travelMode: google.maps.TravelMode['DRIVING']
		    }, (response, status) => {
		      this.loading.hide();
		      this.directionsDisplay.setDirections(response);
		    });
		}).catch((error) => {
			this.loading.hide();
			let t = this.toast.create({ message:'Error getting location' + error, 
			                                duration: 5000, 
			                                position: 'top',
			                                showCloseButton: true});
			 t.present();
		});

  	}

  	googleMaps(){
		let options: LaunchNavigatorOptions = {
		  app: this.launchNavigator.APP.GOOGLE_MAPS
		};

		this.launchNavigator.navigate(this.destination, options)
			.then(
		    	success => console.log('Launched navigator'),
		    	error => {
		    		let t = this.toast.create({ message:'Error launching navigator', 
	                                  duration: 5000, 
	                                  position: 'top',
	                                  showCloseButton: true});
	              	t.present();
		    	}
		  	);
   	}

	logAStop(){
		this.navCtrl.push(LogAStopPage, {
	      item: this.item
	    }); 
   	}

   	transferOwnership(){
   		this.navCtrl.push(TransferOwnerPage, {
	      item: this.item
	    }); 
   	}

   	delivered(){
   		this.loading.show();
	    var body = { colNames : ['arrival_time__c', 'status__c'],
	                 vals : [Date.now, 'Arrived']}
	     for(let i=0;i<this.returns.length;i++){
         	this.oppoService.updateOpportunity(this.returns[i].sfid, body)
		        .then( data => {
		        	if (i == this.returns.length -1){
                        this.transferGPS.stopGPSTracking();
		          		this.loading.hide();  
		          		this.navCtrl.setRoot(InTransitPage, {item: this.item});  
                  	}
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
   		this.navCtrl.setRoot(ItineraryPage); 
	}


}
