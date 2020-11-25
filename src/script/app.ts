import { UiService } from "./uiService.js"
import { LocationService } from "./locationService.js"
import { OrientationService } from "./orientationService.js"

let orientationService = new OrientationService();
let locationService = new LocationService();
let uiService = new UiService();
uiService.initialize(() => {
    orientationService.subscribe();
    locationService.subscribe();
});
