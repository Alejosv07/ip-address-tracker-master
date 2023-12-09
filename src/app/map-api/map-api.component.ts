import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import L from 'leaflet';

@Component({
  selector: 'app-map-api',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './map-api.component.html',
  styleUrls: ['./map-api.component.css']
})
export class MapApiComponent implements OnInit{
  map: any;  

  ipadress:string = "";
  location:string = "";
  timezone:string = "";
  isp:string = "";
  inputSearch = new FormControl('',Validators.pattern("([+-]?([0-9]*[.])?[0-9]+){3}"));
  manyRequest:boolean = false;
  ngOnInit() {
    this.initMap();
  }


  public searchMap():void{
    if(this.inputSearch.valid){
      this.map.remove();
      this.initMap(this.inputSearch.value!);
    }
  }

  private initMap(ipAddress:string = ""): void {
    const url = `https://api.ipbase.com/v1/json/${ipAddress}`;
    // Fetch the coordinates from a free IP geolocation API
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const { ip, region_name,city,zip_code,time_zone,country_code,latitude, longitude } = data;
        this.ipadress = ip;
        this.location = region_name +","+ city +" "+ zip_code;
        this.timezone = time_zone;
        this.isp = country_code;
        this.map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        L.marker([latitude, longitude]).addTo(this.map)
          .bindPopup(`Location for IP address ${ipAddress}`).openPopup();
      })
      .catch(error => {
        this.manyRequest = true;
        this.ipadress = "";
        this.location = "";
        this.timezone = "";
        this.isp = "";
        console.error('Error fetching geolocation data:', error);
      });
  }


}
