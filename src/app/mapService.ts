import { map, runEffects, skip, take, tap } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { createAdapter } from '@most/adapter'
import { LocationService } from "./locationService"
import * as L from 'leaflet';

export class MapService {
    private readonly out: HTMLElement;
    private readonly locationService: LocationService;
    private readonly defaultCoordinates = new Coordinates(47.6089872, -122.3406822);
    private map: L.Map | null = null; // assigned in intializeMap
    private player: L.Marker<any> | null = null; // assigned in updateMapOnce
    private sign: L.Marker<any> | null = null; // assigned in updateMapOnce

    constructor(locationService: LocationService) {
        this.locationService = locationService;
        this.out = document.getElementById('location') as HTMLElement;

        // Store reference to this instance. Retrieved as MapService.Instance()
        (globalThis as any).__MapService = this;

        // String stream:
        let asString = map(MapService.print, this.locationService.coordinate$);
        let stringRendering = (result: String) => {this.out.innerHTML = `${result}`; };
        let renderStringStream = tap(stringRendering, asString);
        runEffects(renderStringStream, newDefaultScheduler());

        // Map updates:
        let initialMapRender = tap(this.updateMapOnce, take(1, this.locationService.coordinate$));
        runEffects(initialMapRender, newDefaultScheduler());
        let renderMapStream = tap(this.updateMap, this.locationService.coordinate$);
        runEffects(renderMapStream, newDefaultScheduler());

        this.initializeMap(this.defaultCoordinates);
    }

    private static Instance(): MapService
    {
        return (globalThis as any).__MapService as MapService;
    }

    private initializeMap(coordinates: GeolocationCoordinates): void {
        let map = L.map('map').setView([coordinates.latitude, coordinates.longitude], 16);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: process.env.MAPBOX_TOKEN
        }).addTo(map);

        MapService.Instance().map = map;
    }

    private updateMapOnce(coordinates: GeolocationCoordinates): void {
        console.log(`First map impression at ${MapService.print(coordinates)}`);
        let map = MapService.Instance().map;
        if (map === null) {
            console.error(`Map unavailable`);
            return;
        }

        let sign = L.marker([coordinates.latitude, coordinates.longitude + 0.001]);
        sign.addTo(MapService.Instance().map!)
            .bindPopup('Sample point of interest.');

        let player = L.marker([coordinates.latitude, coordinates.longitude]);
        player.addTo(MapService.Instance().map!)
            .bindPopup('Your location.')
            .openPopup();

        MapService.Instance().player = player;
        MapService.Instance().sign = sign;
    }

    private updateMap(coordinates: GeolocationCoordinates): void {
        console.log(`Panning the map to ${MapService.print(coordinates)}`);
        if (map === null) {
            console.error(`Map unavailable`);
            return;
        }

        MapService.Instance().map!.panTo([coordinates.latitude, coordinates.longitude]);
        MapService.Instance().player!.setLatLng([coordinates.latitude, coordinates.longitude])
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
