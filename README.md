# Duelo

[![Build Status](https://travis-ci.org/jpbochi/duelo.png?branch=master)](https://travis-ci.org/jpbochi/duelo)
[![Dependency Status](https://david-dm.org/jpbochi/duelo.png)](https://david-dm.org/jpbochi/duelo)
[![devDependency Status](https://david-dm.org/jpbochi/duelo/dev-status.png)](https://david-dm.org/jpbochi/duelo#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/jpbochi/duelo.png)](https://codeclimate.com/github/jpbochi/duelo)

See it [running](http://duelo.herokuapp.com/) (not playable yet).

Follow the [Trello board](https://trello.com/board/duelo-js/5105a4da52f437bd250034df).

## running

requirements:

* node ~> 0.10.x
* npm ~> 1.4.x
* mongo running on default port (27017)

to run it, simply do `npm start`

## tests

the test suite uses mocha for both client and server side tests.

### with grunt

requirements:

* grunt cli (`npm install -g grunt-cli`)

to run the tests:

```
npm test
```

### on the browser

`node main` then visit `localhost:3000/tests`

### if you have access to our heroku app

first, download and install [heroku toolbelt](https://toolbelt.herokuapp.com/).

run this once: `heroku git:remote -a duelo`

to deploy, make sure the build is passing, then run this: `npm test && git push heroku master`
