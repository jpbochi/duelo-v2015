.PHONY: all npm.install start test dev
.PHONY: docker-compose mongodb-up mongodb-stop mongodb-test
.PHONY: travis.before_install travis.install travis.before_script travis.script

NODE_VERSION=4.1.1
MONGO_VERSION=3.0.6
CRUN_NODE=./sh/crun node:${NODE_VERSION}
CRUN_MONGO=./sh/crun mongo:${MONGO_VERSION}

all: start

npm.install:
	${CRUN_NODE} npm --harmony install --loglevel warn

start: npm.install
	CRUN_OPTS='-p 3000:3000' ${CRUN_NODE} node --harmony main

test: mongodb-up npm.install
	${CRUN_NODE} grunt ci

dev: mongodb-up
	${CRUN_NODE} bash

docker-compose:
	@./sh/install-docker-compose

mongodb-up: docker-compose
	docker-compose up -d
	@${MAKE} mongodb-test

mongodb-stop: docker-compose
	docker-compose stop

mongodb-test:
	${CRUN_MONGO} mongo --host mongodb --quiet --eval 'db.runCommand({ serverStatus: 1 }).version'

travis.before_install: docker-compose

travis.install: npm.install

travis.before_script: mongodb-up

travis.script: test
