# Duelo

[![Circle CI](https://circleci.com/gh/jpbochi/duelo.png)](https://circleci.com/gh/jpbochi/duelo)
[![duelo@heroku](https://heroku-badge.herokuapp.com/?app=duelo&style=flat)](http://duelo.herokuapp.com/)

[![Dependency Status](https://david-dm.org/jpbochi/duelo.png)](https://david-dm.org/jpbochi/duelo)
[![devDependency Status](https://david-dm.org/jpbochi/duelo/dev-status.png)](https://david-dm.org/jpbochi/duelo#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/jpbochi/duelo.png)](https://codeclimate.com/github/jpbochi/duelo)

[![Trello board](http://i.picresize.com/images/2015/10/04/7KGth.png)](https://trello.com/board/duelo-js/5105a4da52f437bd250034df)

## Development setup

The only requirement is `docker` 1.7.0 or greater, and `make`.

- Run tests with `make test`.
- Start local server with `make dev-up`.
  - Try `make localurl` to see where your local server is running.
- Get inside a development-ready container with `make dev`. There you'll be able to run `node`, `npm`, and `grunt`

## Deployment

Deployment to heroku is fully automated through travis-ci. Any successful build on master will be deployed.

## If you want to make a manual deploy

1. First, download and install [heroku toolbelt](https://toolbelt.herokuapp.com/).
2. Run this once: `heroku git:remote -a duelo`
3. To deploy, then run this: `make test && git push heroku master`
