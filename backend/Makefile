APP_NAME=aus-quiz-backend
PORT=5011
QUESTION_LIMIT=30

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
