import { combine, map, runEffects, startWith, tap } from '@most/core'
import { mousemove } from '@most/dom-event'
import { newDefaultScheduler } from '@most/scheduler'

export class ExperimentService {
    readonly out: HTMLElement;

    constructor() {
        this.out = document.getElementById('experiment') as HTMLElement;
        if (!this.out) {
            console.error("ExperimentService: output unavailable.");
        }

        //document.addEventListener("mousemove", (event) => this.mouseMoveHandler(event));

        let double = (x:number, y:number) => x+y;
        let mouseEventToNumber = (e:MouseEvent) => e.clientX;
        let renderResult = (result:number) => { this.out.innerHTML = `${result}`; };

        let mouseStream = mousemove(document, false);
        let mouseX = startWith(0, map(mouseEventToNumber,  mouseStream));
        let result = combine(double, mouseX, mouseX);
        let outputEffects = tap(renderResult, result);
        runEffects(outputEffects, newDefaultScheduler());
    }

    mouseMoveHandler(event: MouseEvent): void {
        this.out.innerHTML = `${event.clientX}`;
    }
}