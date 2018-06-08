import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { HelperService } from './helper';
import * as ServiceSettings from './config';


@Injectable()
export class TransferLogService {
	http: any;
	transferLogURL:any;

    constructor(private httpService: Http,
                private helper: HelperService) {
     	this.http = httpService;
    	this.transferLogURL = ServiceSettings.SERVER_URL + '/api/transferlog';
    }


    createLogAStop(jsonBody) {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.http.post(this.transferLogURL + '/logastop', jsonBody, header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }

    createTransferOwner(jsonBody) {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.http.post(this.transferLogURL + '/transferowner', jsonBody, header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }

    updateTransferLog(transferLogId, jsonBody) {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.http.post(this.transferLogURL + '/' + transferLogId, jsonBody, header)
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
