APP_NAME=aus-citizenship-quiz
QUESTION_LIMIT=30

.PHONY: up down build clean logs

up:
	QUESTION_LIMIT=${QUESTION_LIMIT} docker-compose up --build -d && make logs

down:
	docker-compose down

build:
	docker-compose build

clean:
	docker-compose down -v --remove-orphans
	docker rmi -f $(docker images -q)

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend
