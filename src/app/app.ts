import { UiService } from "./uiService"
import { DataService } from "./dataService"
import { LocationService } from "./locationService"
import { OrientationService } from "./orientationService"
import { MapService } from "./mapService"

let orientationService = new OrientationService();
let locationService = new LocationService();
let dataService = new DataService(locationService);
let mapService = new MapService(locationService, orientationService, dataService);
let uiService = new UiService(() => {
    // todo IService.Start and pass all services to UiService
    orientationService.subscribe();
    locationService.subscribe();
}, () => {
    orientationService.unsubscribe();
    locationService.unsubscribe();
});
//let experimentService = new ExperimentService();
