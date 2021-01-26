# Stroll

A mobile web experience for discovering history of a neighborhood.

Data by Gabi. Inspired by Gabi.

Current direction is to facilitate something similar to [Jane's Walk](https://en.wikipedia.org/wiki/Jane's_Walk) on a [Pokemon Go map](https://en.wikipedia.org/wiki/Pok%C3%A9mon_Go).

## How to run

* Prepare
  * Install node.js
  * Paste `secrets.env` into `.`
  * Create ssl cert and key in `.`
  * `npm install --global http-server`
* `npm install`
* `npm run build`
* `http-server dist -S`
