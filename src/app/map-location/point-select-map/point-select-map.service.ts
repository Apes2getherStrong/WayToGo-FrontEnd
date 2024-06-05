import {EventEmitter, Injectable} from "@angular/core";
import {MapLocation} from "../map-location.model";

@Injectable({providedIn: 'root'})
export class PointSelectMapService {
  markerSelectedEmitter = new EventEmitter<{lat: number, lng: number}>();
}