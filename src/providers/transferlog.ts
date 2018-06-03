import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import * as ServiceSettings from './config';

@Injectable()
export class TransferLogService {
	http: any;
	transferLogURL:any;
	headers : any;

    constructor(public httpService: Http) {
     	this.http = httpService;
    	this.transferLogURL = ServiceSettings.SERVER_URL + '/api/transferlog';
    	let headerDict = {
		  'Content-Type': 'application/json',
		  'Access-Control-Allow-Credentials':true,
		  'Authentication': 'Basic ' + btoa(ServiceSettings.USERNAME + ':' + ServiceSettings.PASSWORD)
		}
    	this.headers = new Headers({headers: headerDict, withCredentials:true});
    }


    updateTransferLog(opportunityId, jsonBody) {
        return new Promise( (resolve, reject) => {
            this.http.put(this.transferLogURL, jsonBody)
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
