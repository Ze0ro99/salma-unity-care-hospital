const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

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

// Environment variables (replace with your own values)
const JWT_SECRET = 'your_jwt_secret';
const EMAIL_USER = 'your-email@gmail.com';
const EMAIL_PASS = 'your-email-password';

// Schema Definitions
const roomSchema = new mongoose.Schema({
  department: String,
  roomNumber: Number,
  totalBeds: Number,
  occupiedBeds: Number,
  dischargeTime: Date, // If scheduled for discharge
});

const requestSchema = new mongoose.Schema({
  patientName: String,
  reason: String,
  requestedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Accepted', 'Denied', 'Pending'], default: 'Pending' },
  handledBy: String, // Receptionist ID or name
  roomAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  denialReason: String, // Reason for denial
});

const Room = mongoose.model('Room', roomSchema);
const Request = mongoose.model('Request', requestSchema);

// Middleware for Authentication
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
}

// Admin Notification Utility
function notifyAdministration(patientName, handledBy, denialReason) {
  const adminEmail = 'admin@hospital.com';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: adminEmail,
    subject: 'Flagged Room Request - Review Needed',
    text: `Patient: ${patientName}\nHandled By: ${handledBy}\nReason for Denial: ${denialReason}\n\nPlease investigate this case.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Notification sent to administration:', info.response);
    }
  });
}

// API Endpoints

// Add or Update Room Information
app.post('/rooms', authenticateToken, async (req, res) => {
  const { department, roomNumber, totalBeds, occupiedBeds, dischargeTime } = req.body;

  let room = await Room.findOne({ roomNumber, department });
  if (!room) {
    room = new Room({ department, roomNumber, totalBeds, occupiedBeds, dischargeTime });
  } else {
    room.totalBeds = totalBeds;
    room.occupiedBeds = occupiedBeds;
    room.dischargeTime = dischargeTime;
  }

  await room.save();
  res.status(200).send({ message: 'Room information updated successfully', room });
});

// Get Room Availability
app.get('/rooms/availability', authenticateToken, async (req, res) => {
  const rooms = await Room.find();
  const availableRooms = rooms.filter((room) => room.totalBeds > room.occupiedBeds);
  res.status(200).send({ availableRooms });
});

// Handle Patient Room Requests
app.post('/requests', authenticateToken, async (req, res) => {
  const { patientName, reason, handledBy } = req.body;

  const availableRoom = await Room.findOne({ totalBeds: { $gt: 0 }, occupiedBeds: { $lt: '$totalBeds' } });

  if (availableRoom) {
    availableRoom.occupiedBeds += 1;
    await availableRoom.save();

    const request = new Request({
      patientName,
      reason,
      handledBy,
      status: 'Accepted',
      roomAssigned: availableRoom._id,
    });
    await request.save();
    res.status(200).send({ message: 'Room assigned successfully', request });
  } else {
    const request = new Request({
      patientName,
      reason,
      handledBy,
      status: 'Denied',
      denialReason: 'No available rooms or beds',
    });
    await request.save();

    // Notify Administration
    notifyAdministration(patientName, handledBy, 'No available rooms or beds');
    res.status(400).send({ message: 'No rooms available. Request flagged for review.', request });
  }
});

// Automated Check for Rooms Scheduled for Discharge
cron.schedule('*/30 * * * *', async () => {
  const now = new Date();
  const soonToBeAvailableRooms = await Room.find({
    dischargeTime: { $gte: now, $lte: new Date(now.getTime() + 2 * 60 * 60 * 1000) }, // Within 2 hours
  });

  soonToBeAvailableRooms.forEach((room) => {
    console.log(`Room ${room.roomNumber} in ${room.department} is scheduled to be vacated soon.`);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
