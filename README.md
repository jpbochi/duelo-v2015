# Duelo

[![Build Status](https://travis-ci.org/jpbochi/duelo.png?branch=master)](https://travis-ci.org/jpbochi/duelo)

[![Dependencies](https://david-dm.org/jpbochi/duelo.png)](https://david-dm.org/jpbochi/duelo)

[running app](http://duelo.herokuapp.com/)

[Trello board](https://trello.com/board/duelo-js/5105a4da52f437bd250034df)

## running

requirements:

* node ~> 0.8
* npm ~> 1.1
* mongo running on default port (27017)

to run it, simply:

```
npm install
node main
```

## tests

the test suite uses qunit.

### with grunt

requirements:

* grunt cli (`npm install -g grunt-cli`)

to run the tests:

```
grunt
```

### on the browser

`node main` then visit `localhost:3000/tests`

### if you have access to our heroku app

first, download and install [heroku toolbelt](https://toolbelt.herokuapp.com/).

run this once: `heroku git:remote -a duelo`

to deploy, make sure the build is passing, then run this: `grunt && git push heroku master`
