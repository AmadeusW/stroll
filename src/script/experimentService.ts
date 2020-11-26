export class ExperimentService {
    readonly out: HTMLElement;

    constructor() {
        this.out = document.getElementById('experiment') as HTMLElement;
        if (!this.out) {
            console.error("ExperimentService: output unavailable.");
        }

        document.addEventListener("mousemove", (event) => this.mouseMoveHandler(event));
    }

    mouseMoveHandler(event: MouseEvent): void {
        this.out.innerHTML = `${event.clientX}`;
    }
}