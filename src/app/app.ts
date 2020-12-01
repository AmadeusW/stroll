import { UiService } from "./uiService"
import { LocationService } from "./locationService"
import { OrientationService } from "./orientationService"
//import { ExperimentService } from "./experimentService"

let orientationService = new OrientationService();
let locationService = new LocationService();
let uiService = new UiService(() => {
    orientationService.subscribe();
    locationService.subscribe();
}, () => {
    orientationService.unsubscribe();
    locationService.unsubscribe();
});
//let experimentService = new ExperimentService();
