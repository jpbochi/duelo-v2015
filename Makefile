all: start

install:
	@which grunt || npm install -g grunt-cli
	npm install --loglevel warn

start: install
	node main

test: install
	grunt ci

