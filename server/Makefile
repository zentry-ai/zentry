build:
	docker build -t zentry-api-server .

run_local:
	docker run -p 8000:8000 -v $(shell pwd):/app zentry-api-server --env-file .env

.PHONY: build run_local
