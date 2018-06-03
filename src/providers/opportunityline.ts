import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import * as ServiceSettings from './config';

@Injectable()
export class OpportunityLineService {
	http: any;
	opportunityLineURL:any;
	headers : any;

    constructor(public httpService: Http) {
     	this.http = httpService;
    	this.opportunityLineURL = ServiceSettings.SERVER_URL + '/api/opportunitylines/';
    	let headerDict = {
		  'Content-Type': 'application/json',
		  'Access-Control-Allow-Credentials':true,
		  'Authentication': 'Basic ' + btoa(ServiceSettings.USERNAME + ':' + ServiceSettings.PASSWORD)
		}
    	this.headers = new Headers({headers: headerDict, withCredentials:true});
    }

    getOpportunityLines(oppoId) {
        return new Promise( (resolve, reject) => {
            this.http.get(this.opportunityLineURL  + oppoId)
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
