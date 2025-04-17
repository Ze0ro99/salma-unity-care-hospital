#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define the application directory
APP_DIR="/path/to/your/app" # Change this to your application's directory

# Navigate to the application directory
cd $APP_DIR

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js before running this script."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm before running this script."
    exit 1
fi

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Create a .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat <<EOL > .env
# Environment variables for Salma Unity Care Hospital
NODE_ENV=development
MONGODB_URI=mongodb://username:password@localhost:27017/salma_unity_care_hospital
PORT=3000
EOL
    echo ".env file created. Please update the database credentials."
else
    echo ".env file already exists. Please check and update the database credentials if necessary."
fi

# Run database migrations
echo "Running database migrations..."
node database/migrations/runMigrations.js

# Seed the database (optional)
echo "Seeding the database..."
node seeds/seedUsers.js
node seeds/seedAppointments.js
node seeds/seedMedicalRecords.js

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 is not installed. Installing PM2 globally..."
    npm install -g pm2
fi

# Start the application with PM2
echo "Starting the application with PM2..."
pm2 start server.js --name "salma-unity-care-hospital" --watch

# Output the status of the application
pm2 status

echo "Setup completed successfully!"
