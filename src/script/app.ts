let message: string = 'Hello, World!';
// create a new heading 1 element
let heading = document.createElement('h1');
heading.textContent = message;
// add the heading the document
document.body.appendChild(heading);

function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocation, showLocationError);
    } else {
        showLocationUnavailable();
    }
}

function showLocation(position: GeolocationPosition) {
    let locationContainer = document.getElementById('location') as HTMLElement;
    if (locationContainer)
        locationContainer.innerHTML = "Lat: " + position.coords.latitude + " Long: " + position.coords.longitude;
}

function showLocationError(error: GeolocationPositionError) {
    let locationContainer = document.getElementById('location') as HTMLElement;
    if (locationContainer)
        locationContainer.innerHTML = error.message;
}

function showLocationUnavailable() {
    let locationContainer = document.getElementById('location') as HTMLElement;
    if (locationContainer)
        locationContainer.innerHTML = 'Geolocation is not available';
}

updateLocation();
