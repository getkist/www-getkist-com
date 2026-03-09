# =============================================================================
# Makefile - Development Automation
# =============================================================================
#
# Common development tasks for Django static site generation projects.
# Documentation: https://www.gnu.org/software/make/manual/make.html
#
# =============================================================================


# =============================================================================
# Configuration
# =============================================================================

# Include port configuration if exists
-include ports.mk

# Export port variables for Procfile/honcho
export DJANGO_PORT
export VITE_PORT

# Prevent make from treating targets as files
.PHONY: help install install-dev start stop clean clean-ports clean-dist \
        test lint lint-py lint-js format typecheck pre-commit \
        build build-static build-vite collectstatic render fix-paths \
        serve serve-static migrate makemigrations shell runserver \
        translate-make translate-compile translate-validate translate-clean

# Default target
.DEFAULT_GOAL := help


# -----------------------------------------------------------------------------
# Executables
# -----------------------------------------------------------------------------

PYTHON := poetry run python
PYTEST := poetry run pytest
NPM := npm


# -----------------------------------------------------------------------------
# Paths
# -----------------------------------------------------------------------------

SRC_DIR := src
TST_DIR := tst
BIN_DIR := bin
DIST_DIR := dist


# -----------------------------------------------------------------------------
# Ports
# -----------------------------------------------------------------------------

PORTS := 3000 8000 8001 8002 8081 9000 9100 9101 9102 9103


# =============================================================================
# Help
# =============================================================================

help: ## Show this help message
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""


# =============================================================================
# Installation
# =============================================================================

install: ## Install all dependencies (Python + Node.js)
	poetry install
	$(NPM) install

install-dev: install ## Install with dev dependencies and pre-commit hooks
	poetry install --with dev
	pre-commit install
	pre-commit install --hook-type commit-msg


# =============================================================================
# Development Servers
# =============================================================================

start: clean-ports ## Start all development servers (Django + Vite)
	$(PYTHON) -m honcho start

stop: clean-ports ## Stop all processes on development ports
	@echo "Development ports cleaned"

clean-ports: ## Kill processes on development ports
	@for port in $(PORTS); do \
		pid=$$(lsof -ti tcp:$$port 2>/dev/null); \
		if [ -n "$$pid" ]; then \
			echo "Killing process on port $$port (PID: $$pid)"; \
			kill -9 $$pid 2>/dev/null || true; \
		fi \
	done

runserver: ## Run Django development server only
	$(PYTHON) $(SRC_DIR)/manage.py runserver

serve-static: build-static ## Serve static site locally
	$(PYTHON) -m http.server 9103 --directory $(DIST_DIR)


# =============================================================================
# Static Site Generation
# =============================================================================

build-static: clean-dist build-vite collectstatic render fix-paths ## Build complete static site
	@echo "Static site built in $(DIST_DIR)/"

clean-dist: ## Clean dist directory
	rm -rf $(DIST_DIR)
	@echo "Cleaned $(DIST_DIR)/"

build-vite: ## Build frontend assets with Vite
	$(NPM) run build

collectstatic: ## Collect Django static files
	$(PYTHON) $(SRC_DIR)/manage.py collectstatic --noinput --settings=project.settings.settings_render

render: ## Render static HTML pages with django-distill
	$(PYTHON) $(SRC_DIR)/manage.py render_static --settings=project.settings.settings_render

fix-paths: ## Fix static paths for file:// protocol
	$(PYTHON) $(BIN_DIR)/fix_static_paths.py $(DIST_DIR)


# =============================================================================
# Testing
# =============================================================================

test: ## Run tests with coverage
	$(PYTEST) $(TST_DIR)/

test-fast: ## Run tests without coverage (faster)
	$(PYTEST) $(TST_DIR)/ --no-cov -x

test-verbose: ## Run tests with verbose output
	$(PYTEST) $(TST_DIR)/ -v --no-cov


# =============================================================================
# Code Quality
# =============================================================================

lint: ## Run all linters (Python + JavaScript/CSS)
	$(PYTHON) -m flake8 $(SRC_DIR)/ || true
	$(PYTHON) -m pylint $(SRC_DIR)/ || true
	$(NPM) run lint || true

lint-py: ## Run Python linters only
	$(PYTHON) -m flake8 $(SRC_DIR)/
	$(PYTHON) -m pylint $(SRC_DIR)/ || true

lint-js: ## Run JavaScript/CSS linters only
	$(NPM) run lint

format: ## Format all code (Python + JavaScript/CSS)
	$(PYTHON) -m black $(SRC_DIR)/ $(TST_DIR)/ $(BIN_DIR)/ || true
	$(PYTHON) -m isort $(SRC_DIR)/ $(TST_DIR)/ $(BIN_DIR)/ || true
	$(NPM) run format || true

typecheck: ## Run Python type checking (mypy)
	$(PYTHON) -m mypy $(SRC_DIR)/

pre-commit: ## Run pre-commit hooks on all files
	pre-commit run --all-files


# =============================================================================
# Build & Clean
# =============================================================================

build: build-vite ## Build frontend assets
	poetry build

clean: ## Clean all build artifacts and caches
	rm -rf $(DIST_DIR)/ build/ *.egg-info
	rm -rf htmlcov/ .coverage .coverage.* coverage.xml coverage.json
	rm -rf .pytest_cache/ .mypy_cache/ .ruff_cache/
	rm -rf node_modules/.cache/
	rm -rf site/
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo "Build artifacts cleaned"


# =============================================================================
# Django Management
# =============================================================================

migrate: ## Run Django database migrations
	$(PYTHON) $(SRC_DIR)/manage.py migrate

makemigrations: ## Create new Django migrations
	$(PYTHON) $(SRC_DIR)/manage.py makemigrations

shell: ## Open Django interactive shell
	$(PYTHON) $(SRC_DIR)/manage.py shell


# =============================================================================
# Translations (i18n)
# =============================================================================

translate-make: ## Extract translatable strings from source code
	$(PYTHON) $(SRC_DIR)/manage.py makemessages -a \
		--ignore=htmlcov \
		--ignore=node_modules \
		--ignore=.venv \
		--ignore=dist \
		--ignore=build

translate-compile: ## Compile .po files to .mo binary files
	$(PYTHON) $(SRC_DIR)/manage.py compilemessages

translate-validate: ## Validate translation files for syntax errors
	$(PYTHON) $(SRC_DIR)/manage.py compilemessages --check

translate-clean: ## Remove compiled translation files (.mo)
	find . -type f -name "*.mo" -delete
	@echo "Compiled translation files removed"
