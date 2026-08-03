.PHONY: help build build-dev up down logs clean dev prod test lint typecheck

help:
	@echo "cargo-auction tasks:"
	@echo "  make dev          - Start development environment with hot reload"
	@echo "  make prod         - Build and run production image"
	@echo "  make build        - Build production Docker image"
	@echo "  make build-dev    - Build development Docker image"
	@echo "  make up           - Start all services"
	@echo "  make down         - Stop all services"
	@echo "  make logs         - View logs from running containers"
	@echo "  make clean        - Stop containers and remove images"
	@echo "  make test         - Run tests"
	@echo "  make test-watch   - Run tests in watch mode"
	@echo "  make lint         - Run linter"
	@echo "  make typecheck    - Check TypeScript types"

dev:
	docker compose up frontend-dev

prod:
	docker compose up frontend

build:
	docker build -f Dockerfile.prod -t cargo-auction:latest .

build-dev:
	docker build -f Dockerfile.dev -t cargo-auction-dev:latest .

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

clean:
	docker compose down
	docker rmi cargo-auction:latest cargo-auction-dev:latest 2>/dev/null || true
	docker system prune -f

test:
	docker compose run --rm frontend-dev npm run test

test-watch:
	docker compose run --rm frontend-dev npm run test:watch

lint:
	docker compose run --rm frontend-dev npm run lint

typecheck:
	docker compose run --rm frontend-dev npm run typecheck
