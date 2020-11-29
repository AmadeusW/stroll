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
* Started working with mostjs, but ran into issues with non-relative module resolution for @most/
  * Reading up at https://www.typescriptlang.org/docs/handbook/module-resolution.html

### 2020-11-26: Attempt to use rxjs instead of mostjs
* With little poking around, perhaps I can find a way to get it running.
  * rxjs has a few examples showing commonjs, es6 and cdn scenarios.
* I'm reading more about module loading in TS
  * CommonJS is for server side apps: https://auth0.com/blog/javascript-module-systems-showdown/
  * This answer seems great, it explains everything: https://stackoverflow.com/questions/64242513/using-npm-modules-in-namespaced-typescript-project

### 2020-11-28: Dive deep into webpack
* I chatted with Nick who shared his setup. Few main takeaways:
  * Host on netify or vercel
  * Use Webpack. This will also offer treeshaking
  * There is no effort to using babel so I should go with it. Many resources online assume I have babel.
  * Look at kriasoft starter kits, as well as https://github.com/Microsoft/TypeScript-Babel-Starter
  * For self signed certs, I can use a range of IPs. I can use xip.io since certs are for domains not bare ips.

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
