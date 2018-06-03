import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, Headers } from '@angular/http';

declare var google;

@Component({
  selector: 'page-eta',
  templateUrl: 'eta.html'
})
export class ETAPage {
  item: any;
  directionMatrixService = new google.maps.DistanceMatrixService();
  duration: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toast: ToastController,
              private geolocation: Geolocation) {
    this.item = this.navParams.data.item;

    this.geolocation.getCurrentPosition().then((resp) => {
	 	var origin = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
	 	var end = '7220 Raintree Cir, Culver City, CA 90230';
	 	this.directionMatrixService.getDistanceMatrix({
	      origins: [origin],
	      destinations: [end],
	      travelMode: 'DRIVING'
	    }, (response, status) => {
	      if (response.rows[0].elements[0].status === 'OK') {
	      	this.duration = response.rows[0].elements[0].duration.text;
	      } 
	    });
	}).catch((error) => {
	  console.log('Error getting location', error);
	});
  }

}
