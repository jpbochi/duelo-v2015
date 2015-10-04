.PHONY: all clean npm.install
.PHONY: start urls test dev
.PHONY: docker-compose mongodb-up mongodb-stop mongodb-test
.PHONY: travis.before_install travis.install travis.before_script travis.script

NODE_VERSION=4.1.1
MONGO_VERSION=3.0.6
CRUN_NODE=./sh/crun node:${NODE_VERSION}
CRUN_MONGO=./sh/crun mongo:${MONGO_VERSION}

all: start

clean:
	rm -rf node_modules/
	rm -rf bower_components/
	rm -rf .npm/
	rm -rf .node-gyp/
	rm -rf .cache/
	rm -rf .config/

npm.install:
	${CRUN_NODE} npm install --harmony --unsafe-perm --loglevel warn

start: npm.install
	CRUN_OPTS='-p 3000:3000' ${CRUN_NODE} node --harmony main

urls:
	@echo "app\thttp://$$(./sh/docker-ip):3000"
	@echo "test\thttp://$$(./sh/docker-ip):3000/test"

test: mongodb-up npm.install
	${CRUN_NODE} grunt ci

dev: mongodb-up
	${CRUN_NODE} bash

docker-compose:
	@./sh/install-docker-compose

mongodb-up: docker-compose
	./sh/docker-compose up -d
	docker inspect --format='{{.NetworkSettings.IPAddress}}' mongohost > .mongohost.ip

mongodb-stop: docker-compose
	rm -f .*.ip
	docker-compose stop
	docker-compose rm -f

mongodb-restart: mongodb-stop mongodb-up

mongodb-test:
	sleep 6
	${CRUN_MONGO} mongo --host mongohost --quiet --eval 'db.runCommand({ serverStatus: 1 }).version'

travis.before_install: docker-compose

travis.install: npm.install

travis.before_script: mongodb-up mongodb-test

travis.script: test
