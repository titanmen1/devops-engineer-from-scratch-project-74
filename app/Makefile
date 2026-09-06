setup: prepare install

install:
	npm install

db-migrate:
	npm run migrate

build:
	npm run build

prepare:
	cp -n .env.example .env

start:
	NODE_ENV=production npm run start

dev:
	npx concurrently "make start-frontend" "make start-backend"

start-backend:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-frontend:
	npx vite build --watch

lint:
	npm run lint

lint-fix:
	npm run lint-fix

test:
	npm test -s
