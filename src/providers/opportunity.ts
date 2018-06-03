import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import * as ServiceSettings from './config';

@Injectable()
export class OpportunityService {
	http: any;
	opportunityURL:any;
	headers : any;

    constructor(public httpService: Http) {
     	this.http = httpService;
    	this.opportunityURL = ServiceSettings.SERVER_URL + '/api/opportunity/';
    	let headerDict = {
		  'Content-Type': 'application/json',
		  'Access-Control-Allow-Credentials':true,
		  'Authentication': 'Basic ' + btoa(ServiceSettings.USERNAME + ':' + ServiceSettings.PASSWORD)
		}
    	this.headers = new Headers({headers: headerDict, withCredentials:true});
    }

    getTransfers() {
        return new Promise( (resolve, reject) => {
            this.http.get(this.opportunityURL + 'transfers')
            .map(res=>res.json())
            .subscribe(
                data => {resolve(data)},
                err => { 
                    reject(err);
                }
            );
        });
    }

    getReturns() {
        return new Promise( (resolve, reject) => {
            this.http.get(this.opportunityURL + 'returns')
            .map(res=>res.json())
            .subscribe(
                data => {resolve(data)},
                err => { 
                    reject(err);
                }
            );
        });
    }

    getItineraries(userId) {
        return new Promise( (resolve, reject) => {
            this.http.get(this.opportunityURL + 'itineraries/' + userId)
            .map(res=>res.json())
            .subscribe(
                data => {resolve(data)},
                err => { 
                    reject(err);
                }
            );
        });
    }
    
    updateOpportunity(oppoId, jsonBody) {
        return new Promise( (resolve, reject) => {
            this.http.post(this.opportunityURL + oppoId, "", jsonBody)
            .map(res=>res.json())
            .subscribe(
                data => {resolve(data)},
                err => { 
                    reject(err);
                }
            );
        });
    }

}
