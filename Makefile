build:
	go get ./functions/...
	go build -o hello ./functions/hello.go
	yarn build