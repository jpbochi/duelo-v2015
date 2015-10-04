.PHONY: all npm.install clean
.PHONY: start urls test dev
.PHONY: docker-compose mongodb-up mongodb-stop mongodb-test
.PHONY: travis.before_install travis.install
.PHONY: travis.before_script travis.script travis.after_script travis.before_deploy
.PHONY: .FORCE

NODE_VERSION=4.1.1
MONGO_VERSION=3.0.6
CRUN_NODE=./sh/crun node:${NODE_VERSION}
CRUN_MONGO=./sh/crun mongo:${MONGO_VERSION}

all: start

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
	./sh/docker-compose stop
	./sh/docker-compose rm -f

mongodb-restart: mongodb-stop mongodb-up

mongodb-test:
	sleep 6
	${CRUN_MONGO} mongo --host mongohost --quiet --eval 'db.runCommand({ serverStatus: 1 }).version'

TEMP_DIRS=node_modules/ bower_components/ .node-gyp/ .local/ .config/ .cache/ .npm/
RM_TEMP_DIRS=$(addprefix clean-dir/,$(TEMP_DIRS))
clean-dir/%: .FORCE
	@rm -rf $*

CHWON_TEMP_DIRS=$(addprefix chown-dir/,$(TEMP_DIRS))
chown-dir/%: .FORCE
	@sudo chown -R `whoami` $*

clean: $(RM_TEMP_DIRS)

travis.before_install: docker-compose

travis.install: npm.install

travis.before_script: mongodb-up mongodb-test

travis.script: test

travis.after_script: mongodb-stop

travis.before_deploy: $(CHWON_TEMP_DIRS)
