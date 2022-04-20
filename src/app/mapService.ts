import { combine, runEffects, take, tap } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { LocationService } from "./locationService"
import { OrientationService } from "./orientationService"
import { DataService, DataPoint } from "./dataService"
import * as L from 'leaflet';

export class MapService {
    private readonly out: HTMLElement;
    private readonly locationService: LocationService;
    private readonly orientationService: OrientationService;
    private readonly dataService: DataService;
    private readonly defaultCoordinates = new Coordinates(47.6089872, -122.3406822);
    private map: L.Map | null = null; // assigned in intializeMap
    private player: L.Marker<any> | null = null; // assigned in updateMapOnce
    private playerIcon: L.DivIcon | null = null; // assigned in updateMapOnce
    private markers: L.Marker<any>[] = []; // appended to in updateMarkers

    constructor(locationService: LocationService, orientationService: OrientationService, dataService: DataService) {
        this.dataService = dataService;
        this.locationService = locationService;
        this.orientationService = orientationService;
        this.out = document.getElementById('debug') as HTMLElement;

        // Store reference to this instance. Retrieved as MapService.Instance()
        (globalThis as any).__MapService = this;

        let mapScheduler = newDefaultScheduler();

        // Debug stream:
        let stringRendering = (result: String) => {this.out.innerHTML = `${result}`; };
        let asString = combine(
            MapService.combine,
            this.locationService.coordinate$,
            this.orientationService.orientationSymbol$);
        let renderStringStream = tap(stringRendering, asString);
        runEffects(renderStringStream, mapScheduler);

        // Map updates:
        let updateOnceStream = tap(this.updateMapOnce, take(1, this.locationService.coordinate$));
        runEffects(updateOnceStream, mapScheduler);
        let updateStream = tap(this.updateMap, this.locationService.coordinate$);
        runEffects(updateStream, mapScheduler);
        // todo: update orientation only after location started sending data
        let orientationStream = tap(this.updateOrientation, this.orientationService.orientationSymbol$);
        runEffects(orientationStream, mapScheduler);
        let dataStream = tap(this.updateMarkers, this.dataService.data$);
        runEffects(dataStream, mapScheduler);

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

        let playerIcon = L.divIcon( { className: 'characterContainer', html: '<img id="character" />' });
        let player = L.marker([coordinates.latitude, coordinates.longitude],
            { icon: playerIcon });
        player.addTo(MapService.Instance().map!)
            .bindPopup('Your location.');

        MapService.Instance().player = player;
        MapService.Instance().playerIcon = playerIcon;
     }

    private updateMap(coordinates: GeolocationCoordinates): void {
        console.log(`Panning the map to ${MapService.print(coordinates)}`);
        if (MapService.Instance().map === undefined) {
            console.error(`Map unavailable`);
            return;
        }

        MapService.Instance().map!.panTo([coordinates.latitude, coordinates.longitude]);
        MapService.Instance().player!.setLatLng([coordinates.latitude, coordinates.longitude])
    }

    private updateOrientation(orientation: string): void {
        if (MapService.Instance().map === undefined) {
            console.error(`Map unavailable`);
            return;
        }

        let icon = document.getElementById('character') as HTMLImageElement;

        if (icon === undefined || icon === null) {
            console.error(`Icon unavailable, but the map is`);
            return;
        }

        icon.src = `resources/character/${orientation}.png`;
    }

    private updateMarkers(data: DataPoint): void {
        console.log(`Adding marker at ${MapService.print(data.coordinates)}`);
        let map = MapService.Instance().map;
        if (map === null) {
            console.error(`Map unavailable`);
            return;
        }

        let marker = L.marker([data.coordinates.latitude, data.coordinates.longitude]);
        marker.addTo(MapService.Instance().map!)
            .bindPopup(`<b>${data.title}</b><br />${data.description}`);

        MapService.Instance().markers.push(marker);
    }

    private static combine(coordinates: GeolocationCoordinates, orientation: string): string {
        return `${MapService.print(coordinates)}, ${orientation}`;
    }

    private static print(coordinates: GeolocationCoordinates): string {
        // See https://en.wikipedia.org/wiki/ISO_6709
        let latHemi = coordinates.latitude > 0 ? 'N' : 'S';
        let longHemi = coordinates.longitude > 0 ? 'E' : 'W';
        let speed = coordinates.speed?.toFixed(3);
        return `${coordinates.latitude.toFixed(6)}${latHemi}, ${coordinates.longitude.toFixed(6)}${longHemi}. ${speed} speed`;
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
