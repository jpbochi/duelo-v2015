# Duelo

[![Build Status](https://travis-ci.org/jpbochi/duelo.png?branch=master)](https://travis-ci.org/jpbochi/duelo)
[![Dependency Status](https://david-dm.org/jpbochi/duelo.png)](https://david-dm.org/jpbochi/duelo)
[![devDependency Status](https://david-dm.org/jpbochi/duelo/dev-status.png)](https://david-dm.org/jpbochi/duelo#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/jpbochi/duelo.png)](https://codeclimate.com/github/jpbochi/duelo)

See it [running](http://duelo.herokuapp.com/) (not playable yet).

Follow the [Trello board](https://trello.com/board/duelo-js/5105a4da52f437bd250034df).

## Development setup

The only requirement is `docker` 1.7.0 or greater, and `make`.

- Run tests with `make test`.
- Start local server with `make start`.
  - Try `make urls` to see where your local server is running. By default, it listens on the port `3000`.
- Get inside a development-ready container with `make dev`. There you'll be able to run `node`, `npm`, and `grunt`

## Deployment

Deployment to heroku is fully automated through travis-ci. Any successful build on master will be deployed.

## If you want to make a manual deploy

1. First, download and install [heroku toolbelt](https://toolbelt.herokuapp.com/).
2. Run this once: `heroku git:remote -a duelo`
3. To deploy, then run this: `make test && git push heroku master`
