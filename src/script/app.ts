import { LocationService } from "./locationService.js"
import { OrientationService } from "./orientationService.js"

let message: string = 'Hello, World!';
// create a new heading 1 element
let heading = document.createElement('h1');
heading.textContent = message;
// add the heading the document
document.body.appendChild(heading);

let locationService = new LocationService();
locationService.update();
locationService.subscribe();

let orientationService = new OrientationService();
orientationService.subscribe();

