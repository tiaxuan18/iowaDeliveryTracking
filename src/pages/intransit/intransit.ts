import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

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
	map: any;
	directionsService = new google.maps.DirectionsService;
  	directionsDisplay = new google.maps.DirectionsRenderer;

  	constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toast: ToastController,
              private geolocation: Geolocation) {

        this.geolocation.getCurrentPosition().then((resp) => {
		 	var origin = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
		 	var end = '7220 Raintree Cir, Culver City, CA 90230';
		 	this.map = new google.maps.Map(this.mapElement.nativeElement, {
		      zoom: 7,
		      center: origin
		    });

		    this.directionsDisplay.setMap(this.map);

		 	this.directionsService.route({
		      origin: origin,
		      destination: end,
		      travelMode: 'DRIVING'
		    }, (response, status) => {
		      this.directionsDisplay.setDirections(response);
		    });
		}).catch((error) => {
		  console.log('Error getting location', error);
		});
  	}

	logAStop(){
		this.navCtrl.push(LogAStopPage, {}); 
   	}

   	transferOwnership(){
   		this.navCtrl.push(TransferOwnerPage, {}); 
   	}

   	delivered(){
   		this.navCtrl.setRoot(ItineraryPage, {}); 
   	}



}
