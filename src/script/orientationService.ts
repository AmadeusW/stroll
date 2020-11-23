export class OrientationService {
    readonly isSupported = 'DeviceOrientationEvent' in window;
    readonly positionOptions: PositionOptions = { // https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
        enableHighAccuracy: true, // if true, we would like to receive the best possible results, but increased power consumption on mobile
        timeout: Infinity, // ms
        maximumAge: 5000, // cached position freshness, ms
    };
    private subscribed: boolean;

    constructor() {
        this.subscribed = false;
        if (this.isSupported) {
            console.info("OrientationService: ready");
        } else {
            console.warn("OrientationService: unavailable");
            this.showOrientationUnavailable();
        }
    }

    update(): void {
        console.info("OrientationService.update: Not Applicable. Subscribe instead");
    }

    subscribe(): void {
        if (!this.isSupported) {
            return;
        }

        if (this.subscribed) {
            console.warn("OrientationService.subscribe: Already subscribed");
            return;
        }
        this.subscribed = true;
        window.addEventListener("deviceorientation", this.deviceOrientationListener);
        console.info("OrientationService.subscribe: OK");
    }

    unsubscribe(): void {
        if (!this.isSupported) {
            return;
        }

        if (!this.subscribed) {
            console.warn("OrientationService.unsubscribe: Already unsubscribed");
            return;
        }
        this.subscribed = false;
        window.removeEventListener("deviceorientation", this.deviceOrientationListener);
        console.info("OrientationService.unsubscribe: OK");
    }

    private deviceOrientationListener(event: DeviceOrientationEvent): void {
        let locationContainer = document.getElementById('orientation') as HTMLElement;
        if (locationContainer && event)
            locationContainer.innerHTML = "[" + event.alpha?.toFixed(0) + ", " + event.beta?.toFixed(0) + ", " + event.gamma?.toFixed(0) + "]";
    }

    private showOrientationUnavailable(): void {
        let locationContainer = document.getElementById('orientation') as HTMLElement;
        if (locationContainer)
            locationContainer.innerHTML = 'Orientation is not available';
    }
}