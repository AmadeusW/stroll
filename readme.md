# Stroll
## a work in progress

## Development

* Get SSL certificate and serve https
* Make the app event driven or reactive.
  * Cursory read suggests reactive programming, which deals with changes to data
  * https://rxjs.dev/guide/overview
* Take in the inputs, process them in a separate module
  * Inputs: orientation, geolocation
  * This will make the code very testable
  * And I will learn something new, too
* Rendering
  * Consider https://leafletjs.com/examples.html
    * Fixed zoom
    * Overlay avatar

## Dev log

### 2020-11-23: It seems that compass doesn't work
* It doesn't seem like orientation is available on iOS. I guess this project is over; I want to keep this a website and not an app

### 2020-11-24: Compass heading is available on ios
* iOS has a few requirements for accessing the compass
  * Permission may be granted only from user's action, e.g. mouse click
  * https might be necessary. I added self signed certificates
  * demo: https://dev.to/gigantz/real-compass-on-mobile-browsers-with-javascript-3emi

### 2020-11-25: Cleaned up the subscribe\unsubscribe code. Thoughts on rx library
* There are no runtime warnings, I can start and stop both services with a push of a button
* I considered rxjs, cyclejs, kefir and mostjs.
  * kefir - 👎 it's not typescript. I want to take full advantage of typescript and don't want to go through extra hoops
  * rxjs - 👎 not very sure where to start. Is this a framework which underlies other libraries?
  * cyclejs - tempting, but all examples use the virtual DOM. I don't think I want to go all the way functional
  * mostjs - 👍 it seems the most lean, and it seems that I can easily hook it up to HTML5 events

### Thoughts

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
