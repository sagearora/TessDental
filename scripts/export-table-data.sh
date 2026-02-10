#!/bin/bash

# Export table row counts and sample data to markdown
# This script reads database credentials from infra/compose/.env

set -e

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/infra/compose/.env"
OUTPUT_FILE="$PROJECT_ROOT/table-data-export.md"

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

# Check if psql is available
if ! command -v psql &> /dev/null; then
  echo "Error: psql is not installed or not in PATH"
  echo "Please install PostgreSQL client tools"
  exit 1
fi

# Check if python3 is available
if ! command -v python3 &> /dev/null; then
  echo "Error: python3 is not installed or not in PATH"
  echo "Please install Python 3"
  exit 1
fi

echo "Connecting to database..."
echo "Database: $POSTGRES_DB"
echo ""

# Export PGPASSWORD for psql
export PGPASSWORD="$POSTGRES_PASSWORD"

# Start building the output file
cat > "$OUTPUT_FILE" <<EOF
# Database Table Statistics and Sample Data

Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

---

EOF

# Get list of tables
TABLES_QUERY="SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema IN ('public', 'audit') AND table_type = 'BASE TABLE' ORDER BY table_schema, table_name;"

TABLES=$(PGPASSWORD="$POSTGRES_PASSWORD" psql \
  -h localhost \
  -p "$POSTGRES_PORT" \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  -t \
  -c "$TABLES_QUERY" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | grep -v '^$')

TOTAL_TABLES=$(echo "$TABLES" | wc -l | tr -d ' ')
echo "Found $TOTAL_TABLES tables"
echo ""

PROCESSED=0

# Process each table
while IFS='|' read -r schema table; do
  # Trim whitespace
  schema=$(echo "$schema" | xargs)
  table=$(echo "$table" | xargs)
  
  if [ -z "$schema" ] || [ -z "$table" ]; then
    continue
  fi
  
  PROCESSED=$((PROCESSED + 1))
  echo "[$PROCESSED/$TOTAL_TABLES] Processing $schema.$table..."
  
  # Append table header to output file
  {
    echo ""
    echo "## $schema.$table"
    echo ""
  } >> "$OUTPUT_FILE"
  
  # Get row count
  COUNT_QUERY="SELECT COUNT(*) FROM \"$schema\".\"$table\";"
  ROW_COUNT=$(PGPASSWORD="$POSTGRES_PASSWORD" psql \
    -h localhost \
    -p "$POSTGRES_PORT" \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DB" \
    -t \
    -c "$COUNT_QUERY" | xargs)
  
  # Format row count with commas
  ROW_COUNT_FORMATTED=$(printf "%'d" "$ROW_COUNT" 2>/dev/null || echo "$ROW_COUNT")
  
  {
    echo "**Row Count:** $ROW_COUNT_FORMATTED"
    echo ""
  } >> "$OUTPUT_FILE"
  
  if [ "$ROW_COUNT" -eq 0 ]; then
    {
      echo "_No rows in table_"
      echo ""
    } >> "$OUTPUT_FILE"
    continue
  fi
  
  # Get sample rows (limit 3)
  SAMPLE_QUERY="SELECT * FROM \"$schema\".\"$table\" LIMIT 3;"
  
  # Create a temporary file for CSV data
  TEMP_CSV=$(mktemp)
  
  # Use psql to get data in CSV format
  PGPASSWORD="$POSTGRES_PASSWORD" psql \
    -h localhost \
    -p "$POSTGRES_PORT" \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DB" \
    -c "$SAMPLE_QUERY" \
    --csv > "$TEMP_CSV" 2>/dev/null || true
  
  if [ ! -s "$TEMP_CSV" ] || [ "$(wc -l < "$TEMP_CSV")" -le 1 ]; then
    rm -f "$TEMP_CSV"
    {
      echo "_Unable to fetch sample rows_"
      echo ""
    } >> "$OUTPUT_FILE"
    continue
  fi
  
  {
    echo "### Sample Rows"
    echo ""
  } >> "$OUTPUT_FILE"
  
  # Convert CSV to markdown table using Python
  python3 << PYTHON_SCRIPT >> "$OUTPUT_FILE"
import csv
import sys

def format_value(value):
    if value is None or value == '':
        return 'NULL'
    value_str = str(value)
    # Escape pipe characters for markdown
    value_str = value_str.replace('|', '\\\\|')
    # Truncate long values
    if len(value_str) > 100:
        value_str = value_str[:100] + '...'
    return value_str

try:
    with open('$TEMP_CSV', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        rows = list(reader)
        
        if not rows:
            print("_No data available_")
            sys.exit(0)
        
        # Header row
        headers = rows[0]
        print("| " + " | ".join(headers) + " |")
        print("| " + " | ".join(["---"] * len(headers)) + " |")
        
        # Data rows (skip header, limit to 3)
        for row in rows[1:4]:
            # Pad row if needed
            while len(row) < len(headers):
                row.append('')
            # Truncate if too long
            row = row[:len(headers)]
            formatted_row = [format_value(cell) for cell in row]
            print("| " + " | ".join(formatted_row) + " |")
except Exception as e:
    print(f"_Error processing data: {e}_")
PYTHON_SCRIPT
  
  rm -f "$TEMP_CSV"
  
  echo "" >> "$OUTPUT_FILE"
  
done <<< "$TABLES"

echo ""
echo "✓ Export complete!"
echo "  Output file: $OUTPUT_FILE"
echo "  File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
