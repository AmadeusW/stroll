let message: string = 'Hello, World!';
// create a new heading 1 element
let heading = document.createElement('h1');
heading.textContent = message;
// add the heading the document
document.body.appendChild(heading);
let watchId: number | null;
let isSupported = 'geolocation' in navigator;

let positionOptions: PositionOptions = {
    enableHighAccuracy: true, // if true, we would like to receive the best possible results, but increased power consumption on mobile
    timeout: Infinity, // ms
    maximumAge: 5000, // cached position freshness, ms
};

function updateLocation() {
    if (isSupported) {
        navigator.geolocation.getCurrentPosition(showPosition, showPositionError, positionOptions);
    }
}

function registerLocationUpdates() {
    if (watchId) {
        console.warn("registerLocationUpdates: Already tracking location");
        return;
    }
    watchId = navigator.geolocation.watchPosition(showPosition, showPositionError, positionOptions)
}

function unregisterLocationUpdates() {
    if (!watchId) {
        console.warn("unregisterLocationUpdates: Location is not tracked");
        return;
    }
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
}

function showPosition(position: GeolocationPosition) {
    let locationContainer = document.getElementById('location') as HTMLElement;
    if (locationContainer)
        locationContainer.innerHTML = "Lat: " + position.coords.latitude + " Long: " + position.coords.longitude;
}

function showPositionError(error: GeolocationPositionError) {
    let locationContainer = document.getElementById('location') as HTMLElement;
    if (locationContainer)
        locationContainer.innerHTML = error.message;
}

function showPositionUnavailable() {
    let locationContainer = document.getElementById('location') as HTMLElement;
    if (locationContainer)
        locationContainer.innerHTML = 'Geolocation is not available';
}

if (isSupported) {
    updateLocation();
    registerLocationUpdates();
} else {
    showPositionUnavailable();
}

