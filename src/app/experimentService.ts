import { combine, map, runEffects, startWith, tap } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { createAdapter } from '@most/adapter'

export class ExperimentService {
    readonly out: HTMLElement;
    inducer: (event: MouseEvent) => void;
    constructor() {
        this.out = document.getElementById('experiment') as HTMLElement;
        if (!this.out) {
            console.error("ExperimentService: output unavailable.");
        }

        let [induceFunction, inducedEvents] = createAdapter<MouseEvent>();
        this.inducer = induceFunction;

        document.addEventListener("mousemove", (event) => this.AddToMyStream(event));

        let double = (x:number, y:number) => x+y;
        let mouseEventToNumber = (e:MouseEvent) => e.clientX;
        let renderResult = (result:number) => { this.out.innerHTML = `${result}`; };

        let mouseX = startWith(0, map(mouseEventToNumber, inducedEvents));
        let result = combine(double, mouseX, mouseX);
        let outputEffects = tap(renderResult, result);
        runEffects(outputEffects, newDefaultScheduler());
    }

    AddToMyStream(event: MouseEvent): void {
        this.inducer(event);
    }
}