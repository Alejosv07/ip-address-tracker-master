import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import L from 'leaflet';

@Component({
  selector: 'app-map-api',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-api.component.html',
  styleUrls: ['./map-api.component.css']
})
export class MapApiComponent implements OnInit{
  map: any;  

  ngOnInit() {
    this.initMap();
  }



  private initMap(): void {
    // Replace the IP address with the corresponding geographical coordinates
    const ipAddress = '190.87.166.51';
    const url = `https://freegeoip.app/json/${ipAddress}`;
    // Fetch the coordinates from a free IP geolocation API
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const { latitude, longitude } = data;
        this.map = L.map('map').setView([latitude, longitude], 13);
        console.log("soy data: "+data);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        L.marker([latitude, longitude]).addTo(this.map)
          .bindPopup(`Location for IP address ${ipAddress}`).openPopup();
      })
      .catch(error => {
        console.error('Error fetching geolocation data:', error);
      });
  }
}
