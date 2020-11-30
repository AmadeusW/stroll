import { map, runEffects, tap } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { createAdapter } from '@most/adapter'

export class LocationService {
    readonly isSupported = 'geolocation' in navigator;
    readonly positionOptions: PositionOptions = { // https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
        enableHighAccuracy: true, // if true, we would like to receive the best possible results, but increased power consumption on mobile
        timeout: Infinity, // ms
        maximumAge: 5000, // cached position freshness, ms
    };
    private watchId: number | null;
    private readonly out: HTMLElement;
    private readonly boundEventListener: (event: GeolocationPosition) => void;
    private readonly induceCallback: (event: GeolocationCoordinates) => void;

    constructor() {
        this.watchId = null;
        this.out = document.getElementById('location') as HTMLElement;
        this.boundEventListener = this.positionHandler.bind(this);
        let [induceCallback, eventStream] = createAdapter<GeolocationCoordinates>();
        this.induceCallback = induceCallback;

        let render = (result: String) => {this.out.innerHTML = `${result}`; };
        let trimmed = map(this.toString, eventStream);
        let rendering = tap(render, trimmed);
        runEffects(rendering, newDefaultScheduler());

        if (this.isSupported) {
            console.info("LocationService: ready");
        } else {
            console.warn("LocationService: unavailable");
            this.showPositionUnavailable();
        }
    }

    private positionHandler(position: GeolocationPosition): void {
        this.induceCallback(position.coords); // there's also timestamp
    }

    private toString(coordinates: GeolocationCoordinates): string {
        // See https://en.wikipedia.org/wiki/ISO_6709
        let latHemi = coordinates.latitude > 0 ? 'N' : 'S';
        let longHemi = coordinates.longitude > 0 ? 'E' : 'W';
        return `${coordinates.latitude.toFixed(6)}${latHemi}, ${coordinates.longitude.toFixed(6)}${longHemi}`;
    }

    subscribe(): void {
        if (!this.isSupported) {
            return;
        }

        if (this.watchId) {
            console.warn("LocationService.subscribe: Already subscribed");
            return;
        }
        navigator.geolocation.getCurrentPosition(this.boundEventListener, this.showPositionError, this.positionOptions);
        this.watchId = navigator.geolocation.watchPosition(this.boundEventListener, this.showPositionError, this.positionOptions)
        console.info("LocationService.subscribe: OK");
    }

    unsubscribe(): void {
        if (!this.isSupported) {
            return;
        }

        if (!this.watchId) {
            console.warn("LocationService.unsubscribe: Already unsubscribed");
            return;
        }
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
        console.info("LocationService.unsubscribe: OK");
    }
/*
    private showPosition(position: GeolocationPosition): void {
        let locationContainer = document.getElementById('location') as HTMLElement;
        if (locationContainer)
            locationContainer.innerHTML = "Lat: " + position.coords.latitude + " Long: " + position.coords.longitude;
    }
*/
    private showPositionError(error: GeolocationPositionError): void {
        let locationContainer = document.getElementById('location') as HTMLElement;
        if (locationContainer)
            locationContainer.innerHTML = error.message;
    }

    private showPositionUnavailable(): void {
        let locationContainer = document.getElementById('location') as HTMLElement;
        if (locationContainer)
            locationContainer.innerHTML = 'Geolocation is not available';
    }
}