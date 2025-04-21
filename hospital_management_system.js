const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

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

// Patient Schema
const patientSchema = new mongoose.Schema({
  name: String,
  insuranceNumber: String,
  medicalHistory: [
    {
      date: { type: Date, default: Date.now },
      condition: String,
      treatment: String,
      images: [String], // Paths to x-ray or MRI images
    },
  ],
  insuranceDetails: {
    provider: String,
    policyNumber: String,
    validUntil: Date,
  },
  appointments: [
    {
      date: Date,
      reason: String,
    },
  ],
});

const Patient = mongoose.model('Patient', patientSchema);

// Add or Update Patient Record
app.post('/patients', async (req, res) => {
  const { name, insuranceNumber, condition, treatment, images, insuranceDetails, appointment } = req.body;

  let patient = await Patient.findOne({ insuranceNumber });
  if (!patient) {
    patient = new Patient({ name, insuranceNumber, insuranceDetails });
  }

  // Add medical history entry
  if (condition || treatment || images) {
    patient.medicalHistory.push({ condition, treatment, images });
  }

  // Add appointment
  if (appointment) {
    patient.appointments.push(appointment);
  }

  await patient.save();
  res.status(200).send({ message: 'Patient record updated successfully', patient });
});

// Retrieve Patient Medical History
app.get('/patients/:insuranceNumber', async (req, res) => {
  const { insuranceNumber } = req.params;
  const patient = await Patient.findOne({ insuranceNumber });

  if (!patient) {
    return res.status(404).send({ message: 'Patient not found' });
  }

  res.status(200).send({ medicalHistory: patient.medicalHistory, insuranceDetails: patient.insuranceDetails });
});

// Notify Patients of Appointments
cron.schedule('0 9 * * *', async () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const patients = await Patient.find({
    appointments: {
      $elemMatch: {
        date: {
          $gte: today,
          $lt: tomorrow,
        },
      },
    },
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  patients.forEach((patient) => {
    const upcomingAppointments = patient.appointments.filter(
      (appointment) => appointment.date >= today && appointment.date < tomorrow
    );

    const emailBody = `
      Dear ${patient.name},
      
      This is a reminder for your upcoming appointment(s):
      ${upcomingAppointments.map((appt) => `- ${appt.date.toDateString()}: ${appt.reason}`).join('\n')}

      Thank you,
      Salma Unity Care Hospital
    `;

    transporter.sendMail({
      from: 'your-email@gmail.com',
      to: 'patient-email@example.com', // Replace with actual patient email
      subject: 'Appointment Reminder',
      text: emailBody,
    });
  });

  console.log('Appointment notifications sent.');
});

// Backup Data Daily
cron.schedule('0 2 * * *', async () => {
  const backupPath = path.join(__dirname, 'backups', `backup_${Date.now()}.json`);
  const patients = await Patient.find();

  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.writeFileSync(backupPath, JSON.stringify(patients, null, 2));
  console.log('Backup created at', backupPath);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
