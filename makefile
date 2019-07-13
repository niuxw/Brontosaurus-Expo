# Paths

main: run

run: 
	@expo start

install:
	@yarn install

android:
	@expo start --android

ios:
	@expo start --ios

web:
	@expo start --web
