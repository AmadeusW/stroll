# Dev notes

## TODO

* Rendering
  * Consider https://leafletjs.com/examples.html
    * Fixed zoom
    * Overlay avatar
* Reactive programming
  * Correctly handle error conditions
    * Currently i'm using imperative calls
* Composition
  * Subscribe\unsubscribe should be done by base abstract class or something like this
    * So that each class can just provide business logic

## Log

### 2022-04-19
* Pivot
  * I'd like to use this as a speedometer when riding a bike
  * `GeolocationCoordinates` contains the `speed` and `altitude` property
* Library idea
  * To best dogfood, I'd like to gather data on a phone and reuse it during development
  * Create a library which records a stream and then replays it
  * Since recording happens on the phone, I should find or write an API on line which accepts an arbitrary object

### 2020-12-17
* Got the data!
  * Added DataService to serve data
  * For now, using sample data
  * Really happe with how in TypeScript I can code non stop for half an hour and end up with a perfectly working code.
* Did some RX refactoring
  * Use only one scheduler, in mapService
  * Use combine method to produce debug output from two streams

### 2020-12-16
* Swap player marker's image with orientation
* Updates are limited to only when orientation symbol actually changes

### 2020-12-14
* Rotate the player marker with orientation
  * Prototype to show I can pushthe data to the correct location
  * Next step is to use a player icon
  * And to enable this stream only if location streams, too

### 2020-12-06: Refactor, added points of interest
* It's great to come back when new ideas are ripe
* Split MapService off LocationService
  * Its responsibility is to draw points on the map
  * Next service will provide data
* Refactor retrieval from global variable
  *  use `static Instance()` method to get instance stored in `globalThis`

### 2020-12-01: Storing the map in a global variable
* leaflet.js initializes the map exactly once
  * I need to store its reference in a global variable
  * using (window as any) to access that reference
  * With the reference to the map, I get panning to work. Now the map follows the user.
* I made a utility method static
  * I can use it within mostjs callbacks

### 2020-11-30: Mapping integration
* I integrated with mapbox using leaflet.js
  * Used an old API key I used a few years ago to make laser-cut coasters
  * dotenv webpack plugin helped me hide the API key in a file
  * I need to add that environment variable to netlify
* mostjs is strictly functional
  * `this` is not available in a callback working on a stream
  * I can access `this` in an inline lambda, but not in a dedicated function
  * 🙋‍♂️ How can I use utility functions available in my class?
    * I should try making them static
* netlify deployment is smooth
  * gotta try setting environment variables on netlify and see if dotenv picks them up

### 2020-11-29: Got webpack to work
* I got webpack to bundle all necessary js into a single file
  * The observable package works fine
  * I'm not using Babel whose compiler was throwing syntax errors 
* I can enqueue arbitrary data onto the stream using @most/adapters.createAdapter
  * Demostrated in experimentService
  * Refactoring locationService and orientationService
* I learned how to pass bind to event handlers
  * create event handler with .bind(this)
  * store the reference to event handler for future use in addEventHandler and removeEventHandler

### 2020-11-28: Dive deep into webpack
* I chatted with Nick who shared his setup. Few main takeaways:
  * Host on netify or vercel
  * Use Webpack. This will also offer treeshaking
  * There is no effort to using babel so I should go with it. Many resources online assume I have babel.
  * Look at kriasoft starter kits, as well as https://github.com/Microsoft/TypeScript-Babel-Starter
  * For self signed certs, I can use a range of IPs. I can use xip.io since certs are for domains not bare ips.

### 2020-11-26: Attempt to use rxjs instead of mostjs
* With little poking around, perhaps I can find a way to get it running.
  * rxjs has a few examples showing commonjs, es6 and cdn scenarios.
* I'm reading more about module loading in TS
  * CommonJS is for server side apps: https://auth0.com/blog/javascript-module-systems-showdown/
  * This answer seems great, it explains everything: https://stackoverflow.com/questions/64242513/using-npm-modules-in-namespaced-typescript-project

### 2020-11-25: Cleaned up the subscribe\unsubscribe code. Thoughts on rx library
* There are no runtime warnings, I can start and stop both services with a push of a button
* I considered rxjs, cyclejs, kefir and mostjs.
  * kefir - 👎 it's not typescript. I want to take full advantage of typescript and don't want to go through extra hoops
  * rxjs - 👎 not very sure where to start. Is this a framework which underlies other libraries?
  * cyclejs - tempting, but all examples use the virtual DOM. I don't think I want to go all the way functional
  * mostjs - 👍 it seems the most lean, and it seems that I can easily hook it up to HTML5 events
* Started working with mostjs, but ran into issues with non-relative module resolution for @most/
  * Reading up at https://www.typescriptlang.org/docs/handbook/module-resolution.html

### 2020-11-24: Compass heading is available on ios
* iOS has a few requirements for accessing the compass
  * Permission may be granted only from user's action, e.g. mouse click
  * https might be necessary. I added self signed certificates
  * demo: https://dev.to/gigantz/real-compass-on-mobile-browsers-with-javascript-3emi

### 2020-11-23: It seems that compass doesn't work
* It doesn't seem like orientation is available on iOS. I guess this project is over; I want to keep this a website and not an app

### 2021-01-25: Welcome back
* Back in development on another machine. Updated readme.md with steps how to set it up
* Converted .kml to .geojson. Working on loading it up

## Thoughts

App Organization: Consider using Promises everywhere for uniform API.

Based on the last few geolocation data points, which direction am I headed to?
How do I average out frequent and noisy input?

Example solutions:
get delta from last known location

if below threshold:
  don't change the known location

if above threshold:
  move to new location

the threshold should be larger than jitter

not a problem:
  what if user moves very slowly, always under threshold?
  at some point, the difference will be large enough
