#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define environment variables
export NODE_ENV=production
export MONGODB_URI="mongodb://username:password@localhost:27017/salma_unity_care_hospital"

# Define the application directory
APP_DIR="/path/to/your/app" # Change this to your application's directory

# Navigate to the application directory
cd $APP_DIR

# Pull the latest code from the repository
echo "Pulling the latest code from the repository..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Run database migrations
echo "Running database migrations..."
node database/migrations/runMigrations.js

# Seed the database (optional)
echo "Seeding the database..."
node seeds/seedUsers.js
node seeds/seedAppointments.js
node seeds/seedMedicalRecords.js

# Start the application
echo "Starting the application..."
pm2 start server.js --name "salma-unity-care-hospital" --watch

# Output the status of the application
pm2 status

echo "Deployment completed successfully!"
