export class LocationService {
    readonly isSupported = 'geolocation' in navigator;
    readonly positionOptions: PositionOptions = { // https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
        enableHighAccuracy: true, // if true, we would like to receive the best possible results, but increased power consumption on mobile
        timeout: Infinity, // ms
        maximumAge: 5000, // cached position freshness, ms
    };
    private watchId: number | null;

    constructor() {
        this.watchId = null;
        if (this.isSupported) {
            console.info("LocationService: ready");
        } else {
            console.warn("LocationService: unavailable");
            this.showPositionUnavailable();
        }
    }

    update(): void {
        navigator.geolocation.getCurrentPosition(this.showPosition, this.showPositionError, this.positionOptions);
        console.info("LocationService.update: OK");
    }

    subscribe(): void {
        if (!this.isSupported) {
            return;
        }

        if (this.watchId) {
            console.warn("LocationService.subscribe: Already subscribed");
            return;
        }
        this.watchId = navigator.geolocation.watchPosition(this.showPosition, this.showPositionError, this.positionOptions)
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

    private showPosition(position: GeolocationPosition): void {
        let locationContainer = document.getElementById('location') as HTMLElement;
        if (locationContainer)
            locationContainer.innerHTML = "Lat: " + position.coords.latitude + " Long: " + position.coords.longitude;
    }

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