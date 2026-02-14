#!/bin/bash
set -e

# Get the root directory of the monorepo (two levels up from this script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
DOCKER_COMPOSE_FILE="$ROOT_DIR/infra/compose/docker-compose.test.yml"

cd "$ROOT_DIR"

echo "🧹 Cleaning up existing test infrastructure..."
docker compose -f "$DOCKER_COMPOSE_FILE" down -v || true

echo "🚀 Starting test infrastructure..."
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

echo "⏳ Waiting for services to be ready..."
max_attempts=30
attempt=0

# Wait for postgres-test
while [ $attempt -lt $max_attempts ]; do
  if docker compose -f "$DOCKER_COMPOSE_FILE" ps postgres-test | grep -q "healthy"; then
    echo "✓ postgres-test is ready"
    break
  fi
  attempt=$((attempt + 1))
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Timeout waiting for postgres-test"
  exit 1
fi

# Wait for hasura-test
attempt=0
while [ $attempt -lt $max_attempts ]; do
  if docker compose -f "$DOCKER_COMPOSE_FILE" ps hasura-test | grep -q "Up"; then
    # Give Hasura a moment to fully initialize
    sleep 3
    echo "✓ hasura-test is ready"
    break
  fi
  attempt=$((attempt + 1))
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Timeout waiting for hasura-test"
  exit 1
fi

# Wait for auth-test if it exists
if docker compose -f "$DOCKER_COMPOSE_FILE" ps auth-test > /dev/null 2>&1; then
  attempt=0
  while [ $attempt -lt $max_attempts ]; do
    if docker compose -f "$DOCKER_COMPOSE_FILE" ps auth-test | grep -q "Up"; then
      echo "✓ auth-test is ready"
      break
    fi
    attempt=$((attempt + 1))
    sleep 2
  done
fi

echo "📦 Applying Hasura migrations and metadata..."
# Wait a bit more for Hasura to be fully ready
sleep 5

# Apply migrations using Hasura CLI
cd "$ROOT_DIR"
hasura migrate apply --project infra/hasura --database-name default --endpoint http://localhost:8082 --admin-secret testadminsecret || {
  echo "⚠️  Warning: Failed to apply migrations. This might be expected if migrations are already applied."
}

# Apply metadata
hasura metadata apply --project infra/hasura --endpoint http://localhost:8082 --admin-secret testadminsecret || {
  echo "⚠️  Warning: Failed to apply metadata."
}

echo "✅ Test infrastructure is ready!"
