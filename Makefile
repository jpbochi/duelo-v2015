all: start

install:
	npm install --loglevel warn
	which bower || npm install -g bower --loglevel warn
	bower install

start: install
	node main

test: install
	grunt ci

