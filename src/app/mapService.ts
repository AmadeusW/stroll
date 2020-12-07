import { map, runEffects, skip, take, tap } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { createAdapter } from '@most/adapter'
import { LocationService } from "./locationService"
import * as L from 'leaflet';

export class MapService {
    private readonly out: HTMLElement;
    private readonly locationService: LocationService;
    private readonly defaultCoordinates = new Coordinates(47.6089872, -122.3406822);

    constructor(locationService: LocationService) {
        this.locationService = locationService;
        this.out = document.getElementById('location') as HTMLElement;

        // String stream:
        let asString = map(MapService.print, this.locationService.coordinate$);
        let stringRendering = (result: String) => {this.out.innerHTML = `${result}`; };
        let renderStringStream = tap(stringRendering, asString);
        runEffects(renderStringStream, newDefaultScheduler());

        // Map updates:
        let renderMapStream = tap(this.updateMap, this.locationService.coordinate$);
        runEffects(renderMapStream, newDefaultScheduler());

        this.initializeMap(this.defaultCoordinates);
    }

    private initializeMap(coordinates: GeolocationCoordinates): void {
        let mymap = L.map('map').setView([coordinates.latitude, coordinates.longitude], 16);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: process.env.MAPBOX_TOKEN
        }).addTo(mymap);

        // Store the map in a global variable for later access
        (window as any).__MAP = mymap;
    }

    private updateMap(coordinates: GeolocationCoordinates): void {
        console.log(`Panning the map to ${MapService.print(coordinates)}`);
        let map = (window as any).__MAP as L.Map;
        map.panTo([coordinates.latitude, coordinates.longitude]);
    }

    private static print(coordinates: GeolocationCoordinates): string {
        // See https://en.wikipedia.org/wiki/ISO_6709
        let latHemi = coordinates.latitude > 0 ? 'N' : 'S';
        let longHemi = coordinates.longitude > 0 ? 'E' : 'W';
        return `${coordinates.latitude.toFixed(6)}${latHemi}, ${coordinates.longitude.toFixed(6)}${longHemi}`;
    }
}

export class Coordinates implements GeolocationCoordinates {
    constructor(latitude: number, longitude: number) {
        this.accuracy = 1;
        this.altitude = 36;
        this.altitudeAccuracy = 1;
        this.heading = null;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = null;
    }

    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    latitude: number;
    longitude: number;
    speed: number | null;
}
