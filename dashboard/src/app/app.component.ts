import { Component } from '@angular/core';

import { Papa } from 'ngx-papaparse';
import { interval } from 'rxjs';
import { Chart } from 'chart.js';

import { InternetService } from './internet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  internetSpeed = [];
  downloadSpeed = [];
  uploadSpeed   = [];
  dates = [];
  chart;
  period = '1h';
  fetching = false;

  constructor(private internet:InternetService, private papa: Papa){
   this.fetchInternetSpeed();
    const delay = 1000 * 60; // 1 sec* 60 = 1min
    const source = interval(delay);
    const subscribe = source.subscribe(val => this.setPeriod(this.period));
  }

  fetchInternetSpeed(){
    this.fetching = true;
    this.internet.getInternetSpeed().subscribe( (data) => {
      this.papa.parse(data, {
          complete: (result) => {;
            // Parse CSV file
            this.internetSpeed    = result.data;

            // Remove CSV headers
            this.internetSpeed.shift();

            let reversedRecords = this.internetSpeed.slice(0).reverse();
            let iterations      = 0;

            switch(this.period){
              case '30 min':
                iterations = 6;
                break;
              case '1h':
                iterations = 12;
                break;
              case '3h':
                iterations = 36;
                break;
              case '6h':
                iterations = 72;
                break;
              case '12h':
                iterations = 144;
                break;
              case '24h':
                iterations = 288;
                break;
            }

            for(let i=0; i < iterations; i++){
              let record = reversedRecords[i];
              this.downloadSpeed.push(record[3]);
              this.uploadSpeed.push(record[4]);
              this.dates.push(record[1]);
            }

            this.downloadSpeed  = this.downloadSpeed.reverse();
            this.uploadSpeed    = this.uploadSpeed.reverse();
            this.dates          = this.dates.reverse();

            this.renderChart();
          }
      });
    })
  }

  renderChart(){
    if(this.chart == undefined){
      this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: this.dates,
          datasets: [
            { 
              label : "Download speed (Mbit/s)",
              data: this.downloadSpeed,
              borderColor: "#3cba9f",
              fill: false
            },
            { 
              label : "Upload speed (Mbit/s)",
              data: this.uploadSpeed,
              borderColor: "#ffcc00",
              fill: false
            },
          ]
        },
        options: {
          responsive : true,
          maintainAspectRatio : false,
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });
    }
    else {
      this.chart.data.labels                = this.dates;
      this.chart.data.datasets[0].data = this.downloadSpeed;
      this.chart.data.datasets[1].data = this.uploadSpeed;
      this.chart.update();
    }
    this.fetching = false;
  }

  setPeriod(period:string){
    this.period = period;
    this.downloadSpeed  = [];
    this.uploadSpeed    = [];
    this.dates          = [];
    this.fetchInternetSpeed();
  }
}
