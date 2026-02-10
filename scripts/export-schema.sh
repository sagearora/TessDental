#!/bin/bash

# Export PostgreSQL schema to schema.sql
# This script reads database credentials from infra/compose/.env

set -e

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/infra/compose/.env"
OUTPUT_FILE="$PROJECT_ROOT/schema.sql"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found at $ENV_FILE"
  echo "Please ensure the .env file exists in infra/compose/"
  exit 1
fi

# Source the .env file
set -a
source "$ENV_FILE"
set +a

# Check required variables
if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_DB" ] || [ -z "$POSTGRES_PORT" ]; then
  echo "Error: Missing required environment variables"
  echo "Required: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT"
  exit 1
fi

# Check if pg_dump is available
if ! command -v pg_dump &> /dev/null; then
  echo "Error: pg_dump is not installed or not in PATH"
  echo "Please install PostgreSQL client tools"
  exit 1
fi

# Export the schema (schema-only, no data)
echo "Exporting schema from database: $POSTGRES_DB"
echo "Host: localhost:$POSTGRES_PORT"
echo "User: $POSTGRES_USER"
echo "Output: $OUTPUT_FILE"
echo ""

PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
  --host=localhost \
  --port="$POSTGRES_PORT" \
  --username="$POSTGRES_USER" \
  --dbname="$POSTGRES_DB" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --file="$OUTPUT_FILE"

if [ $? -eq 0 ]; then
  echo "✓ Schema exported successfully to $OUTPUT_FILE"
  echo "  File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
else
  echo "✗ Failed to export schema"
  exit 1
fi
