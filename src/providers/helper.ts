import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, RequestOptions, Headers } from '@angular/http';

import * as ServiceSettings from './config';

@Injectable()
export class HelperService {
	http:any;
	refreshURL: any;

	constructor(public storage: Storage,
				private httpService: Http) {
		this.http = httpService;
    	this.refreshURL = ServiceSettings.SERVER_URL + '/api/refresh';
     	
    }

 	formatDate(passedDate){
    	return passedDate.toISOString().slice(0, 19).replace('T', ' ');
  	}

  	getTokenHeader(){
  		return new Promise( (resolve, reject) => {
  			this.storage.get('token').then((token) =>{
  				if (token) {
  					let url = this.refreshURL + '/' + token.userid;

  					this.http.get(url).subscribe(
  						data => {
	  						let resp = data.json();
					        let headerDict = {
							  'Content-Type': 'application/json',
							  'x-access-token' : resp.token
							}
							token.token = resp.token;
							this.storage.set('token', token);
				    		resolve({headers: headerDict});
		    			},
		    			error => {
		    			 debugger;
				    	 reject(error);
				  	});
			    } else {
			        reject('No Token exists');
			    }

		    	
	    	});
    	});
   	}
 }