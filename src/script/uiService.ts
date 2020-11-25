export class UiService {
    constructor() {

    }

    initialize(callback: Function): void {
        let button = document.getElementById('button') as HTMLElement;
        if (button) {
            button.addEventListener("click", () => { callback() });
        } else {
            console.warn("UiService.initialize: button unavailable.");
        }

    }
}