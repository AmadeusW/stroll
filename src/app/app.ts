import { UiService } from "./uiService"
import { LocationService } from "./locationService"
import { OrientationService } from "./orientationService"
import { MapService } from "./mapService"

let orientationService = new OrientationService();
let locationService = new LocationService();
let mapService = new MapService(locationService);
let uiService = new UiService(() => {
    // todo IService.Start and pass all services to UiService
    orientationService.subscribe();
    locationService.subscribe();
}, () => {
    orientationService.unsubscribe();
    locationService.unsubscribe();
});
//let experimentService = new ExperimentService();
