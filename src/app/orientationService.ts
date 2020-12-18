import { map, skipRepeats } from '@most/core'
import { createAdapter } from '@most/adapter'
import { Stream } from '@most/types'

interface WebkitDeviceOrientationEvent extends DeviceOrientationEvent {
    webkitCompassHeading: number;
}

export class OrientationService {
    public readonly orientationSymbol$: Stream<string>;

    private readonly boundEventListener: (event: DeviceOrientationEvent) => void;
    private readonly induceCallback: (event: number) => void;
    private subscribed: boolean = false;
    private isIos = (navigator.userAgent.match(/(iPod|iPhone|iPad)/));

    constructor() {
        this.boundEventListener = this.deviceOrientationListener.bind(this);
        let [induceCallback, eventStream] = createAdapter<number>();
        this.induceCallback = induceCallback;

        // TODO: Use combine to augment the stream with portrait/landscape mode information
        let orientationSymbol = map(this.getOrientationFromAlpha, eventStream);
        this.orientationSymbol$ = skipRepeats(orientationSymbol);
    }

    private deviceOrientationListener(event: DeviceOrientationEvent): void {
        let alpha = 0;
        let webkitCompassHeading = (event as WebkitDeviceOrientationEvent).webkitCompassHeading;
        if (webkitCompassHeading) {
            alpha = webkitCompassHeading;
        }
        else if (event.alpha) {
            alpha = Math.abs(event.alpha - 360);
        }
        this.induceCallback(alpha);
    }

    getOrientationFromAlpha(a: number | null): string {
        if (!a)
            return "x";
        else if (a < 22.5)
            return "N";
        else if (a < 67.5)
            return "NE";
        else if (a < 112.5)
            return "E";
        else if (a < 157.5)
            return "SE";
        else if (a < 202.5)
            return "S";
        else if (a < 247.5)
            return "SW";
        else if (a < 292.5)
            return "W";
        else if (a < 337.5)
            return "NW";
        else if (a < 360.5)
            return "N";
        else
            return "x";
    }

    subscribe(): void {
        console.log("OrientationService.subscribe...");
        if (this.subscribed) {
            console.warn("OrientationService.subscribe: Already subscribed");
            return;
        }

        if (this.isIos) {
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response == 'granted') {
                        console.info("OrientationService: ready");
                        window.addEventListener("deviceorientation", this.boundEventListener);
                        this.subscribed = true;
                        console.info("OrientationService.subscribe: OK");
                    }
                    else
                    {
                        console.warn("OrientationService: unavailable");
                        this.subscribed = false;
                        this.showOrientationUnavailable();
                    }
                })
                .catch((error) => {
                    console.warn("OrientationService: " + error);
                    this.subscribed = false;
                    alert("OrientationService: " + error)
                });
        } else {
            window.addEventListener("deviceorientationabsolute", this.boundEventListener);
            this.subscribed = true;
        }
        console.info("OrientationService.subscribe: OK");
    }

    unsubscribe(): void {
        console.log("OrientationService.unsubscribe...");

        if (!this.subscribed) {
            console.warn("OrientationService.unsubscribe: Already unsubscribed");
            return;
        }

        if (this.isIos) {
            window.removeEventListener("deviceorientation", this.boundEventListener);
        } else {
            window.removeEventListener("deviceorientationabsolute", this.boundEventListener);
        }

        this.subscribed = false;
        console.info("OrientationService.unsubscribe: OK");
    }

    private showOrientationUnavailable(): void {
        let locationContainer = document.getElementById('orientation') as HTMLElement;
        if (locationContainer)
            locationContainer.innerHTML = 'Orientation is not available';
    }
}