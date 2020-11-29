export class OrientationService {
    private subscribed: boolean = false;

    constructor() {

    }

    private isIos = (navigator.userAgent.match(/(iPod|iPhone|iPad)/));

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
                        window.addEventListener("deviceorientation", this.deviceOrientationListener, true);
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
            window.addEventListener("deviceorientationabsolute", this.deviceOrientationListener, true);
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
            window.removeEventListener("deviceorientation", this.deviceOrientationListener, true);
        } else {
            window.removeEventListener("deviceorientationabsolute", this.deviceOrientationListener, true);
        }

        this.subscribed = false;
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