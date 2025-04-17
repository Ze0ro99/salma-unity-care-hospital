#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define environment variables
export MONGODB_URI="mongodb://username:password@localhost:27017/salma_unity_care_hospital"

# Define the directory containing migration scripts
MIGRATION_DIR="./database/migrations" # Change this to your migrations directory

# Check if the migration directory exists
if [ ! -d "$MIGRATION_DIR" ]; then
    echo "Migration directory does not exist: $MIGRATION_DIR"
    exit 1
fi

# Navigate to the migration directory
cd $MIGRATION_DIR

# Run each migration script in the directory
for migration in $(ls *.js | sort); do
    echo "Running migration: $migration"
    node "$migration"
done

echo "All migrations completed successfully!"
