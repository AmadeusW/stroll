import { map, runEffects, tap } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { createAdapter } from '@most/adapter'
import { Stream } from '@most/types'

export class LocationService {
    public readonly coordinate$: Stream<GeolocationCoordinates>;

    readonly isSupported = 'geolocation' in navigator;
    readonly positionOptions: PositionOptions = { // https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
        enableHighAccuracy: true, // if true, we would like to receive the best possible results, but increased power consumption on mobile
        timeout: Infinity, // ms
        maximumAge: 5000, // cached position freshness, ms
    };
    private watchId: number | null;
    private readonly boundEventListener: (event: GeolocationPosition) => void;
    private readonly induceCallback: (event: GeolocationCoordinates) => void;

    constructor() {
        this.watchId = null;
        this.boundEventListener = this.positionHandler.bind(this);
        // Parameter passed to incudeCallback will appear in the coordinate$ stream
        let [induceCallback, eventStream] = createAdapter<GeolocationCoordinates>();
        this.induceCallback = induceCallback;
        this.coordinate$ = eventStream;

        if (this.isSupported) {
            console.info("LocationService: ready");
        } else {
            console.warn("LocationService: unavailable");
            this.showPositionUnavailable();
        }
    }

    private positionHandler(position: GeolocationPosition): void {
        this.induceCallback(position.coords);
        // note position.timestamp is also available,
        // but position.coords computes properties that I need, e.g. speed
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
