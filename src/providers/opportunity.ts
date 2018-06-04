import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { HelperService } from './helper';
import * as ServiceSettings from './config';


@Injectable()
export class OpportunityService {
	http: any;
	opportunityURL:any;

    constructor(private httpService: Http,
                private helper: HelperService) {
     	this.http = httpService;
    	this.opportunityURL = ServiceSettings.SERVER_URL + '/api/opportunity/';
    }

    getTransfers() {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.http.get(this.opportunityURL + 'transfers', header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }

    getReturns() {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.http.get(this.opportunityURL + 'returns', header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }

    getItineraries(userId) {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.http.get(this.opportunityURL + 'itineraries/' + userId, header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }

    getInTransit(userId) {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.http.get(this.opportunityURL + 'intransit/' + userId, header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }
    
    updateOpportunity(oppoId, jsonBody) {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.http.post(this.opportunityURL + oppoId, jsonBody, header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }

}
