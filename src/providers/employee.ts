import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';

import * as ServiceSettings from './config';

@Injectable()
export class EmployeeService {
	http: any;
	employeeURL:any;
	headers : any;
    user: any;

    constructor(private httpService: Http,
                private storage: Storage) {
     	this.http = httpService;
    	this.employeeURL = ServiceSettings.SERVER_URL + '/api/employee';
    }

    findByEmail(email, password) {
        return new Promise( (resolve, reject) => {
            let body = {
                email : email,
                password : btoa(password)
            }
            this.http.post(this.employeeURL, body)
            .subscribe(
                data => {
                    let resp = data.json();
                    this.storage.set('token', {userid: resp.data.sfid, token: resp.token});
                    resolve(data.json())
                },
                err => { 
                    reject(err);
                }
            );
        });
    }

}
