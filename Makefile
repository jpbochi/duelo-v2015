.PHONY: all npm-install clean
.PHONY: start up stop localurl localurl-test
.PHONY: test dev update-deps
.PHONY: mongodb-up mongodb-stop mongodb-test
.PHONY: circle.dependencies circle.test circle.post-test
.PHONY: travis.before_install travis.install
.PHONY: travis.before_script travis.script travis.after_script travis.before_deploy
.PHONY: .FORCE

all: start

npm-install: .FORCE
	./sh/crun-node npm install --harmony --unsafe-perm --loglevel warn

start: npm-install mongodb-up
	DOCKER_OPTS='-p 80:3000' ./sh/crun-node ./sh/web.proc

up: npm-install
	./sh/docker-compose build web
	./sh/docker-compose up -d
	# ./sh/mongohost-ip > .mongohost.ip

stop:
	rm -f .*.ip
	./sh/docker-compose stop
	./sh/docker-compose rm -f

localurl:
	@./sh/verify-duelo-host
	@echo "http://duelo.info"

localurl-test:
	@./sh/verify-duelo-host
	@echo "http://duelo.info/test"

test: mongodb-up npm-install
	./sh/crun-node grunt ci

dev: mongodb-up
	./sh/crun-node bash

update-deps: npm-install
	./sh/crun-node ncu --upgradeAll

mongodb-up:
	./sh/docker-compose up -d --no-recreate mongodb
	# ./sh/mongohost-ip > .mongohost.ip

mongodb-stop:
	rm -f .*.ip
	./sh/docker-compose stop mongodb
	@[ -n "${NO_DOCKER_RM}" ] && echo "possibly, leaving containers behind" || true
	@[ -z "${NO_DOCKER_RM}" ] && ./sh/docker-compose rm -f mongodb || true

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
	make --version
	bash --version
	docker version
	docker info
	./sh/docker-compose version || ./sh/docker-compose --version

docker-fix-iptables:
	@# https://github.com/travis-ci/travis-ci/issues/4778
	@# https://github.com/zuazo/kitchen-in-travis-native/issues/1#issuecomment-142230889
	sudo iptables -L DOCKER || ( echo "DOCKER iptables chain missing" ; sudo iptables -N DOCKER )

circle.dependencies: versions npm-install mongodb-up mongodb-test
circle.test: test
circle.post-test: mongodb-stop

travis.before_install: docker-fix-iptables versions
travis.install: npm-install
travis.before_script: mongodb-up mongodb-test
travis.script: test
travis.after_script: mongodb-stop
travis.before_deploy: $(CHWON_TEMP_DIRS)
