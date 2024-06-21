import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MapLocation} from "../map-location.model";
import {PointSelectMapComponent} from "../point-select-map/point-select-map.component";
import {PointSelectMapService} from "../point-select-map/point-select-map.service";
import {MapLocationService} from "../map-location.service";
import {RouteMapLocationService} from "../../route-map-location/route-map-location.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Audio} from "../../audio/audio.model";
import {AudioService} from "../../audio/audio.service";

@Component({
  selector: 'app-points-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    PointSelectMapComponent,
  ],
  templateUrl: './map-location-edit.component.html',
  styleUrl: './map-location-edit.component.css'
})
export class MapLocationEditComponent implements OnInit {
  routeId: string;
  mapLocationId: string;
  mapLocationForm: FormGroup;
  lat: number | undefined;
  lng: number | undefined;
  selectedFile: File = null;
  selectedAudioFile: File = null;
  audioFiles: Audio[] = [];
  editMode = false;
  mapLocation: MapLocation;
  currentImageUrl: SafeUrl = null;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private mapService: PointSelectMapService,
              private audioService: AudioService,
              private mapLocationService: MapLocationService,
              private routeMapLocationService: RouteMapLocationService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(urlSegments => {
      this.editMode = urlSegments.some(segment => segment.path === 'edit');
    });

    if (!this.editMode) {
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          this.routeId = params['routeId'];
          this.initForm();
        }
      )
    } else {
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          this.mapLocationId = params['pointId'];
          this.initForm();
        }
      )
      this.initForm();
    }


    this.mapService.markerSelectedEmitter.subscribe((position: { lat: number, lng: number }) => {
      this.mapLocationForm.patchValue({
        lat: position.lat,
        lng: position.lng
      });
    })
  }





  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadAudio(): void {
    // Przygotowanie danych audio (bez pliku)
    const newAudio: Audio = {
      id: null, // Jeśli backend generuje id, zostaw null
      name: this.mapLocationForm.get('name').value, // Pobierz nazwę z formularza
      description: this.mapLocationForm.get('description').value, // Pobierz opis z formularza
      user: null, // Ustaw odpowiedniego użytkownika, jeśli jest wymagane
      mapLocation: this.mapLocation, // Ustaw odpowiednią lokalizację, jeśli jest wymagane
      audioFilename: null // Nazwa pliku będzie ustawiona po przesłaniu pliku
    };

    // Wywołanie metody serwisowej do dodawania audio
    this.audioService.postAudio(newAudio).subscribe(
      (audio: Audio) => {
        if (this.selectedAudioFile) {
          this.audioService.uploadAudioFile(audio.id, this.selectedAudioFile).subscribe(
            () => {
              this.audioFiles.push(audio);
              this.selectedAudioFile = null; // Zresetuj wybrany plik
            },
            (error) => {
              console.error('Error uploading audio file:', error);
            }
          );
        } else {
          this.audioFiles.push(audio);
        }
      },
      (error) => {
        console.error('Error adding audio:', error);
      }
    );
  }

  deleteAudio(audioId: string) {
    this.audioService.deleteAudio(audioId).subscribe(
      () => {
        this.audioFiles = this.audioFiles.filter(audio => audio.id !== audioId);
      },
      (error) => {
        console.error('Error deleting audio:', error);
      }
    );
  }

  onSubmit() {
    let newMapLocation = {
      name: this.mapLocationForm.value.name,
      description: this.mapLocationForm.value.description,
      coordinates: {
        type: "Point",
        coordinates: [this.mapLocationForm.value.lat, this.mapLocationForm.value.lng]
      },
    }


    if (this.editMode) {
      this.mapLocationService.putMapLocation(newMapLocation, this.mapLocationId)
        .subscribe((response: MapLocation) => {
          if (this.selectedFile) {
            this.mapLocationService.uploadMapLocationImage(response.id, this.selectedFile)
              .subscribe(() => {
                this.goBack();
              });
          } else {
            this.goBack();
          }
          //this.goBack();
        });
    } else {
      this.mapLocationService.postMapLocation(newMapLocation, this.routeId)
        .subscribe((response: MapLocation) => {
          if (this.selectedFile) {
            this.mapLocationService.uploadMapLocationImage(response.id, this.selectedFile)
              .subscribe(() => {
                this.routeMapLocationService.postRouteMapLocation(this.routeId, response.id)
                  .subscribe(() => {
                    this.goBack();
                  });
              });
          } else {
            this.routeMapLocationService.postRouteMapLocation(this.routeId, response.id)
              .subscribe(() => {
                this.goBack();
              });
          }
        });
    }


  }

  goBack() {
    if (this.editMode) {
      this.router.navigate(['yourRoutes/list'])
    } else {
      this.router.navigate(['routes/' + this.routeId + '/edit']);
    }

  }

  private initForm() {
    let mapLocationName = '';
    let mapLocationDescription = '';
    let mapLocationLat = null;
    let mapLocationLng = null;

    this.mapLocationForm = new FormGroup({
      'name': new FormControl(mapLocationName, Validators.required),
      'description': new FormControl(mapLocationDescription),
      'lat': new FormControl(mapLocationLat, Validators.required),
      'lng': new FormControl(mapLocationLng, Validators.required),
    });

    if (this.editMode) {
      this.mapLocationService.getMapLocationsById(this.mapLocationId).subscribe(response => {
        this.mapLocation = response;

        mapLocationName = this.mapLocation.name;
        mapLocationDescription = this.mapLocation.description;
        mapLocationLat = this.mapLocation.coordinates.coordinates[0];
        mapLocationLng = this.mapLocation.coordinates.coordinates[1];

        this.mapLocationForm.patchValue({
          'name': mapLocationName,
          'description': mapLocationDescription,
          'lat': mapLocationLat,
          'lng': mapLocationLng
        });

        this.mapLocationService.getMapLocationImageById(this.mapLocationId).subscribe({
          next: (response: Blob | null) => {
            if (response) {
              const objectURL = URL.createObjectURL(response);
              this.currentImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            }
          },
          error: (error: any) => {
            console.error('Error fetching current image:', error);
            this.currentImageUrl = null;
          }
        })
      });
    }
  }
}
