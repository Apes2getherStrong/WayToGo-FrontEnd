import {EventEmitter, Injectable, OnInit} from "@angular/core";
import {MapLocation} from "../../map-location/map-location.model";

@Injectable({providedIn: 'root'})
export class MapService  {
  routeSelectedEventEmitter = new EventEmitter<MapLocation[]>();

}