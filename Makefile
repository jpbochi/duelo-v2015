.PHONY: all npm-install clean
.PHONY: start urls test dev update-deps
.PHONY: docker-compose mongodb-up mongodb-stop mongodb-test
.PHONY: travis.before_install travis.install
.PHONY: travis.before_script travis.script travis.after_script travis.before_deploy
.PHONY: .FORCE

all: start

npm-install: .FORCE
	./sh/crun-node npm install --harmony --unsafe-perm --loglevel warn

start: npm-install
	CRUN_OPTS='-p 3000:3000' ./sh/crun-node node --harmony main

urls:
	@echo "app\thttp://$$(./sh/docker-ip):3000"
	@echo "test\thttp://$$(./sh/docker-ip):3000/test"

test: mongodb-up npm-install
	./sh/crun-node grunt ci

dev: mongodb-up
	./sh/crun-node bash

update-deps: npm-install
	./sh/crun-node ncu --upgradeAll

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
	sh/crun-mongo mongo --host mongohost --quiet --eval 'db.runCommand({ serverStatus: 1 }).version'

TEMP_DIRS=node_modules/ bower_components/ .node-gyp/ .local/ .config/ .cache/ .npm/
RM_TEMP_DIRS=$(addprefix clean-dir/,$(TEMP_DIRS))
clean-dir/%: .FORCE
	@rm -rf $*

CHWON_TEMP_DIRS=$(addprefix chown-dir/,$(TEMP_DIRS))
chown-dir/%: .FORCE
	@sudo chown -R `whoami` $*

clean: $(RM_TEMP_DIRS)

versions:
	bash --version
	./sh/docker-compose --version
	docker --version

travis.before_install: docker-compose versions

travis.install: npm-install

travis.before_script: mongodb-up mongodb-test

travis.script: test

travis.after_script: mongodb-stop

travis.before_deploy: $(CHWON_TEMP_DIRS)
