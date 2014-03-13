all: start

install:
	npm install --loglevel warn

start: install
	node main

test: install
	grunt ci

