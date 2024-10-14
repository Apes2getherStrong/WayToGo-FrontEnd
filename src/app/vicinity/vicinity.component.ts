import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SidePanelService} from "../shared/side-panel.service";
import {MapService} from "../shared/map/map.service";
import {ScreenSizeService} from "../shared/screen-size.service";
import {MapComponent} from "../shared/map/map.component";
import {CommonModule, NgIf} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MapLocationService} from "../map-location/map-location.service";

@Component({
  selector: 'app-vicinity',
  standalone: true,
  imports: [
    MapComponent,
    NgIf,
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './vicinity.component.html',
  styleUrl: './vicinity.component.css'
})
export class VicinityComponent{
  range: number = 30;

  constructor(private mapService: MapService, private mapLocationService: MapLocationService) {
  }

  onSubmit() {
    this.mapService.clearAllMarkers.emit()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.mapLocationService.getMapLocationsByRange(center.lat, center.lng, this.range * 1000).subscribe(
          locations => {
            this.mapService.routeSelectedEventEmitter.emit(locations.content);

          }
        )
      }, error => {
        console.error('Error getting location: ', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

  }


}
