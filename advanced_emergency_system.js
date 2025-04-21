const express = require('express');
const mongoose = require('mongoose');
const twilio = require('twilio');
const { Translate } = require('@google-cloud/translate').v2;
const axios = require('axios');
const i18n = require('i18n');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/hospitalDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Twilio Setup for Emergency Calls
const twilioClient = twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');

// Google Translate API Setup
const translate = new Translate({ key: 'GOOGLE_TRANSLATE_API_KEY' });

// i18n Configuration for Multilingual Support
i18n.configure({
  locales: ['en', 'ar', 'es', 'fr', 'zh', 'hi'], // Add more as needed
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
});
app.use(i18n.init);

// Schema Definitions
const patientSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  medicalHistory: [String],
  preferredLanguage: { type: String, default: 'en' },
  emergencyContacts: [{ name: String, phone: String }],
});

const volunteerSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  skills: [String], // e.g., CPR, fire safety, etc.
});

const Patient = mongoose.model('Patient', patientSchema);
const Volunteer = mongoose.model('Volunteer', volunteerSchema);

// API Endpoints

// Emergency Assistance Endpoint
app.post('/emergency', async (req, res) => {
  const { patientId, emergencyType, location } = req.body;

  const patient = await Patient.findById(patientId).exec();
  if (!patient) {
    return res.status(404).send({ message: 'Patient not found' });
  }

  // Translate emergency guidance to patient's preferred language
  const guidance = await translateText(
    i18n.__(`emergency.guidance.${emergencyType}`),
    patient.preferredLanguage
  );

  // Notify Emergency Services
  twilioClient.calls
    .create({
      url: `${req.protocol}://${req.get('host')}/twiml/${emergencyType}`,
      to: patient.phoneNumber,
      from: 'YOUR_TWILIO_PHONE_NUMBER',
    })
    .then((call) => {
      console.log('Emergency call initiated:', call.sid);
    })
    .catch((error) => {
      console.error('Error initiating emergency call:', error);
    });

  // Notify Nearby Volunteers
  const volunteers = await findNearbyVolunteers(location, emergencyType);
  volunteers.forEach((volunteer) => {
    twilioClient.messages
      .create({
        body: `Emergency Alert: A ${emergencyType} has occurred nearby. Please assist if possible.`,
        from: 'YOUR_TWILIO_PHONE_NUMBER',
        to: volunteer.phoneNumber,
      })
      .then((message) => {
        console.log('Notification sent to volunteer:', message.sid);
      })
      .catch((error) => {
        console.error('Error notifying volunteer:', error);
      });
  });

  res.status(200).send({
    message: 'Emergency assistance is on the way.',
    guidance,
    volunteersNotified: volunteers.length,
  });
});

// First Aid Booklet API
app.get('/first-aid', async (req, res) => {
  const language = req.query.language || 'en';
  i18n.setLocale(language);

  const booklet = {
    title: res.__('firstAid.title'),
    chapters: [
      { title: res.__('firstAid.chapter1.title'), content: res.__('firstAid.chapter1.content') },
      { title: res.__('firstAid.chapter2.title'), content: res.__('firstAid.chapter2.content') },
    ],
    audioUrl: `${req.protocol}://${req.get('host')}/first-aid/audio/${language}`,
  };

  res.status(200).send(booklet);
});

// First Aid Audio API
app.get('/first-aid/audio/:language', (req, res) => {
  const language = req.params.language || 'en';
  const audioFilePath = `${__dirname}/audio/first-aid-${language}.mp3`;

  res.download(audioFilePath, 'first-aid.mp3', (err) => {
    if (err) {
      res.status(500).send({ message: 'Audio file not found' });
    }
  });
});

// Utility Functions

// Translate Text
async function translateText(text, targetLanguage) {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text
  }
}

// Find Nearby Volunteers
async function findNearbyVolunteers(location, emergencyType) {
  const volunteers = await Volunteer.find().exec();

  return volunteers.filter((volunteer) => {
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      volunteer.location.latitude,
      volunteer.location.longitude
    );
    return distance <= 10 && volunteer.skills.includes(emergencyType); // 10km radius
  });
}

// Calculate Distance (Haversine Formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
