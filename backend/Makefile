APP_NAME=aus-quiz-backend
PORT?=5011
QUESTION_LIMIT?=20
VERSION?=0.0.1
.PHONY: run build clean test fmt

run:
	QUESTION_LIMIT=${QUESTION_LIMIT} go run .
build:
	go build -o $(APP_NAME)
test:
	go test ./...
fmt:
	go fmt ./...
clean:
	rm -f $(APP_NAME)

docker-run:
	docker build -t $(APP_NAME):$(VERSION) .
	docker run -e QUESTION_LIMIT=${QUESTION_LIMIT} \
		-e PORT=${PORT} $(APP_NAME):$(VERSION)
