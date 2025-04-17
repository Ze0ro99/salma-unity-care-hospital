#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define environment variables
export MONGODB_URI="mongodb://username:password@localhost:27017/salma_unity_care_hospital"
BACKUP_DIR="/path/to/backup/directory" # Change this to your desired backup directory
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_$TIMESTAMP.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform the backup
echo "Starting database backup..."
mongodump --uri="$MONGODB_URI" --gzip --archive="$BACKUP_DIR/$BACKUP_FILE"

# Check if the backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_FILE"
else
    echo "Backup failed!"
    exit 1
fi

# Retain only the last 5 backups
echo "Cleaning up old backups..."
cd $BACKUP_DIR
ls -tp | grep -v '/$' | tail -n +6 | xargs -I {} rm -- {}

echo "Backup process completed successfully!"
