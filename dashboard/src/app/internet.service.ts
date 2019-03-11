import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class InternetService {
  CSV = '/assets/speedtest.csv';

  constructor(private http: HttpClient) {
      
  }

  getInternetSpeed() : any {
    const options = {responseType: 'text' as 'text'};
    return this.http.get(this.CSV, options);
  }
}
