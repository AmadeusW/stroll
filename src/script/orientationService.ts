export class OrientationService {
    private isSupported = false;
    private subscribed: boolean = false;

    constructor() {

    }

    private isIos = (navigator.userAgent.match(/(iPod|iPhone|iPad)/));

    update(): void {
        console.info("OrientationService.update: Not Applicable. Subscribe instead");
    }

    subscribe(): void {
        if (this.subscribed) {
            console.warn("OrientationService.subscribe: Already subscribed");
            return;
        }
        this.subscribed = true;
        if (this.isIos) {
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response == 'granted') {
                        console.info("OrientationService: ready");
                        window.addEventListener("deviceorientation", this.deviceOrientationListener, true);
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
            window.addEventListener("deviceorientationabsolute", this.deviceOrientationListener, true);
        }
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