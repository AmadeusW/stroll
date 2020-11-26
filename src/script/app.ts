import { UiService } from "./uiService.js"
import { LocationService } from "./locationService.js"
import { OrientationService } from "./orientationService.js"

let orientationService = new OrientationService();
let locationService = new LocationService();
let uiService = new UiService(() => {
    orientationService.subscribe();
    locationService.subscribe();
}, () => {
    orientationService.unsubscribe();
    locationService.unsubscribe();
});
