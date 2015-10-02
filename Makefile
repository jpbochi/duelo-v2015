.PHONY: all install start test dev

NODE_VERSION=4.1.1
MONGO_VERSION=3.0.6
CRUN_NODE=./sh/crun node:${NODE_VERSION}
CRUN_MONGO=./sh/crun mongo:${MONGO_VERSION}

all: start

travis.before_install:
	./sh/install-docker-compose
	${CRUN_NODE} npm install -g grunt-cli --loglevel warn

install:
	${CRUN_NODE} npm --harmony install --loglevel warn

travis.before_script:
	${CRUN_MONGO} mongo --host mongodb --eval 'db.runCommand({ serverStatus: 1 }).version'

travis.script:
	${CRUN_NODE} npm --harmony test

start: install
	${CRUN_NODE} node --harmony main

test: install mongodb-up
	${CRUN_NODE} grunt ci

mongodb-up:
	docker-compose up -d

dev: mongodb-up
	${CRUN_NODE} bash
