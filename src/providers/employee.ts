import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import * as ServiceSettings from './config';

@Injectable()
export class EmployeeService {
	http: any;
	employeeURL:any;
	headers : any;
    user: any;

    constructor(public httpService: Http) {
     	this.http = httpService;
    	this.employeeURL = ServiceSettings.SERVER_URL + '/api/employee';
    	let headerDict = {
          "Content-Type" : "application/json",
		  "Authorization" : "Basic " + btoa(ServiceSettings.USERNAME + ":" + ServiceSettings.PASSWORD)
		}
    	//this.headers = new RequestOptions({headers: headerDict});
    }


    findByEmail(email, password) {
        return new Promise( (resolve, reject) => {
            this.http.get(this.employeeURL + '/' +email + '/' + btoa(password))
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
