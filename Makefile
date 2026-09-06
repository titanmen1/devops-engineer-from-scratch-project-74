setup: prepare-env
	docker compose run --rm app make setup

prepare-env:
	test -f .env || cp .env.example .env

build:
	docker compose build

up: prepare-env
	docker compose up

down:
	docker compose down

test: prepare-env
	docker compose -f docker-compose.yml run --rm test

ci: test
