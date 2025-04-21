const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const axios = require('axios');
const twilio = require('twilio');

// Initialize Express app
const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/hospitalDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schema Definitions
const patientSchema = new mongoose.Schema({
  name: String,
  insuranceNumber: String,
  medications: [
    {
      name: String,
      dosage: String,
      frequencyPerDay: Number,
      timing: String, // e.g., "Before meals", "After meals"
      reminders: [Date], // Auto-generated reminder times
    },
  ],
  prescriptions: [
    {
      medication: String,
      dosage: String,
      date: { type: Date, default: Date.now },
    },
  ],
  deliveryRequests: [{ date: { type: Date, default: Date.now }, status: String }],
});

const pharmacySchema = new mongoose.Schema({
  name: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  workingHours: {
    open: String,
    close: String,
  },
  medications: [
    {
      name: String,
      stock: Number,
    },
  ],
});

const Patient = mongoose.model('Patient', patientSchema);
const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);

// Initialize Twilio for SMS
const twilioClient = twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');

// API Endpoints

// Add or Update Patient Record
app.post('/patients', async (req, res) => {
  const { name, insuranceNumber, medications, prescriptions } = req.body;

  let patient = await Patient.findOne({ insuranceNumber });
  if (!patient) {
    patient = new Patient({ name, insuranceNumber });
  }

  // Add medications and prescriptions
  if (medications) {
    patient.medications = medications.map((med) => {
      const reminders = generateReminders(med.frequencyPerDay, med.timing);
      return { ...med, reminders };
    });
  }
  if (prescriptions) {
    patient.prescriptions.push(...prescriptions);
  }

  await patient.save();
  res.status(200).send({ message: 'Patient record updated successfully', patient });
});

// Find Nearby Hospitals and Pharmacies
app.get('/nearby', async (req, res) => {
  const { latitude, longitude } = req.query;

  // Use Google Maps API (or similar) to find nearby hospitals and pharmacies
  const apiKey = 'GOOGLE_MAPS_API_KEY'; // Replace with your API key
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=hospital|pharmacy&key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    const places = response.data.results.map((place) => ({
      name: place.name,
      address: place.vicinity,
      status: place.opening_hours?.open_now ? 'Open' : 'Closed',
    }));
    res.status(200).send(places);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching nearby places', error });
  }
});

// Check Medication Availability
app.get('/medications/:name', async (req, res) => {
  const { name } = req.params;
  const pharmacies = await Pharmacy.find({ 'medications.name': name });

  const result = pharmacies.map((pharmacy) => ({
    pharmacy: pharmacy.name,
    location: pharmacy.location,
    stock: pharmacy.medications.find((med) => med.name === name).stock,
  }));

  res.status(200).send(result);
});

// Request Delivery Service
app.post('/delivery', async (req, res) => {
  const { insuranceNumber, medication } = req.body;

  const patient = await Patient.findOne({ insuranceNumber });
  if (!patient) {
    return res.status(404).send({ message: 'Patient not found' });
  }

  patient.deliveryRequests.push({ medication, status: 'Pending' });
  await patient.save();

  res.status(200).send({ message: 'Delivery request submitted', deliveryRequests: patient.deliveryRequests });
});

// Medication Reminder Notifications
cron.schedule('*/15 * * * *', async () => {
  const now = new Date();
  const patients = await Patient.find();

  patients.forEach((patient) => {
    patient.medications.forEach((med) => {
      med.reminders.forEach((reminder) => {
        if (Math.abs(reminder - now) < 15 * 60 * 1000) {
          // Send SMS reminder
          twilioClient.messages.create({
            body: `Reminder: It's time to take your medication ${med.name}. ${med.timing}. Dosage: ${med.dosage}.`,
            from: 'YOUR_TWILIO_PHONE_NUMBER',
            to: 'PATIENT_PHONE_NUMBER', // Replace with actual phone number
          });
        }
      });
    });
  });

  console.log('Medication reminders sent.');
});

// Utility Functions

// Generate Reminder Times
function generateReminders(frequency, timing) {
  const hours = Math.floor(24 / frequency);
  const reminders = [];
  let currentTime = new Date();
  for (let i = 0; i < frequency; i++) {
    reminders.push(new Date(currentTime.getTime() + i * hours * 60 * 60 * 1000));
  }
  return reminders;
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
