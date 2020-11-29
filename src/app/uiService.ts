export class UiService {
    subscribed: boolean = false;
    readonly subscribeCallback: Function;
    readonly unsubscribeCallback: Function;
    readonly goButton: HTMLElement;

    constructor(subscribeCallback: Function, unsubscribeCallback: Function) {
        if (!subscribeCallback) {
            console.error("UiService: subscribeCallback unavailable")
        }
        if (!unsubscribeCallback) {
            console.error("UiService: unsubscribeCallback unavailable")
        }
        this.goButton = document.getElementById('button') as HTMLElement;
        if (!this.goButton) {
            console.error("UiService: button unavailable.");
        }
        this.subscribeCallback = subscribeCallback;
        this.unsubscribeCallback = unsubscribeCallback;

        this.goButton.innerHTML = "Go";
        this.goButton.addEventListener("click", () => this.buttonClickHandler());
    }

    buttonClickHandler(): void {
        if (this.subscribed) {
            this.subscribed = false;
            this.goButton.innerHTML = "Go";
            this.unsubscribeCallback();
        } else {
            this.subscribed = true;
            this.goButton.innerHTML = "Pause";
            this.subscribeCallback();
        }
    }
}