const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const axios = require('axios');
const { sendPushNotification } = require('../utils/notificationService'); // Assuming you have a notification service

exports.orchestrateCare = async (req, res) => {
  try {
    const { patientId } = req.body;

    // Validate input
    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    // Fetch medical records for the patient
    const records = await MedicalRecord.findAll({ where: { patientId } });
    if (!records || records.length === 0) {
      return res.status(404).json({ error: 'No medical records found for this patient' });
    }

    // Call AI service to get next steps
    const aiResponse = await axios.post('http://ai-service:5000/orchestrate', {
      patientData: records,
    });

    const { nextSteps } = aiResponse.data;

    // Create an appointment based on AI recommendations
    const appointment = await Appointment.create({
      patientId,
      doctorId: nextSteps.doctorId,
      date: nextSteps.appointmentDate,
      createdAt: new Date(),
    });

    // Send notification to the patient
    await notifyPatient(patientId, nextSteps.message);

    // Respond with success message and appointment details
    res.json({ message: 'Care orchestrated successfully', nextSteps, appointment });
  } catch (error) {
    console.error('Error orchestrating care:', error); // Log the error for debugging
    res.status(500).json({ error: 'An error occurred while orchestrating care' });
  }
};

const notifyPatient = async (patientId, message) => {
  try {
    // Implement notification logic (e.g., push notification, email, SMS)
    await sendPushNotification(patientId, message);
    console.log(`Notification sent to patient ${patientId}: ${message}`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
