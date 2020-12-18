import { runEffects, take, tap } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { createAdapter } from '@most/adapter'
import { Stream } from '@most/types'
import { LocationService } from "./locationService"
import { Coordinates } from './mapService'

export class DataService {
    public readonly data$: Stream<DataPoint>;

    private readonly locationService: LocationService;
    private readonly induceCallback: (data: DataPoint) => void;
    private subscribed: boolean = false;

    constructor(locationService: LocationService) {
        this.locationService = locationService;
        let [induceCallback, dataStream] = createAdapter<DataPoint>();
        this.induceCallback = induceCallback;

        (globalThis as any).__DataService = this;

        let updateOnceStream = tap(this.initializeSampleData, take(1, this.locationService.coordinate$));
        runEffects(updateOnceStream, newDefaultScheduler());

        this.data$ = dataStream;
    }

    private static Instance(): DataService
    {
        return (globalThis as any).__DataService as DataService;
    }

    subscribe(): void {
        console.log("OrientationService.subscribe...");
        if (this.subscribed) {
            console.warn("OrientationService.subscribe: Already subscribed");
            return;
        }

        console.info("OrientationService.subscribe: OK");
    }

    private initializeSampleData(currentLocation: GeolocationCoordinates): void {
        for (var i: number = 0; i < 5; i++) {
            let point = new DataPoint(
                `Point ${i}`,
                `Description for sample point ${i}`,
                "",
                new Coordinates(currentLocation.latitude + Math.sin(i) * 0.002, currentLocation.longitude + Math.cos(i) * 0.003));
            DataService.Instance().induceCallback(point);
        }
    }

    unsubscribe(): void {
        console.log("OrientationService.unsubscribe...");

        if (!this.subscribed) {
            console.warn("OrientationService.unsubscribe: Already unsubscribed");
            return;
        }

        this.subscribed = false;
        console.info("OrientationService.unsubscribe: OK");
    }
}

export class DataPoint {
    readonly title: string;
    readonly description: string;
    readonly imageUrl: string;
    readonly coordinates: Coordinates;

    constructor(title: string, description: string, imageUrl: string, coordinates: Coordinates) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.coordinates = coordinates;
    }
}
