all: start

install:
	time npm install --loglevel warn
	which bower || time npm install -g bower --loglevel warn
	time bower install

start: install
	node main

test: install
	grunt ci

