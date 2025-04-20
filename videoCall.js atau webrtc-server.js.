// Struktur proyek berbasis MERN (MongoDB, Express, React, Node.js) // Ditambah WebSocket (Socket.IO) dan WebRTC untuk video call real-time

// 1. Backend - Express & Socket.IO // File: server.js

const express = require('express'); const http = require('http'); const socketIo = require('socket.io'); const cors = require('cors'); const mongoose = require('mongoose'); const app = express(); const server = http.createServer(app); const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors()); app.use(express.json());

mongoose.connect('mongodb://localhost:27017/telemedicine', { useNewUrlParser: true, useUnifiedTopology: true });

const Appointment = mongoose.model('Appointment', new mongoose.Schema({ patientName: String, doctorName: String, date: String, time: String, status: { type: String, default: 'pending' } }));

// Booking endpoint app.post('/api/appointments', async (req, res) => { const newApp = new Appointment(req.body); await newApp.save(); res.send({ success: true, message: 'Appointment booked' }); });

app.get('/api/appointments', async (req, res) => { const list = await Appointment.find(); res.send(list); });

// WebSocket - Chat dan Video Call Signaling io.on('connection', (socket) => { console.log('New client connected:', socket.id);

socket.on('send-message', (msg) => { io.emit('receive-message', msg); });

socket.on('video-call', ({ to, offer }) => { io.to(to).emit('video-offer', { from: socket.id, offer }); });

socket.on('video-answer', ({ to, answer }) => { io.to(to).emit('video-answer', { from: socket.id, answer }); });

socket.on('ice-candidate', ({ to, candidate }) => { io.to(to).emit('ice-candidate', { from: socket.id, candidate }); });

socket.on('join-room', (roomId) => { socket.join(roomId); }); });

server.listen(5000, () => console.log('Server running on port 5000'));

// 2. Frontend (React) - Chat, Booking, Video Call // File: App.js

import React, { useEffect, useRef, useState } from 'react'; import io from 'socket.io-client'; const socket = io('http://localhost:5000');

function App() { const [message, setMessage] = useState(''); const [chat, setChat] = useState([]); const [appointments, setAppointments] = useState([]); const localVideo = useRef(null); const remoteVideo = useRef(null); const peerConn = useRef(null);

useEffect(() => { socket.on('receive-message', (msg) => setChat(prev => [...prev, msg]));

socket.on('video-offer', async ({ from, offer }) => {
  peerConn.current = new RTCPeerConnection();
  peerConn.current.onicecandidate = e => e.candidate && socket.emit('ice-candidate', { to: from, candidate: e.candidate });
  peerConn.current.ontrack = e => remoteVideo.current.srcObject = e.streams[0];
  await peerConn.current.setRemoteDescription(new RTCSessionDescription(offer));
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  stream.getTracks().forEach(track => peerConn.current.addTrack(track, stream));
  localVideo.current.srcObject = stream;
  const answer = await peerConn.current.createAnswer();
  await peerConn.current.setLocalDescription(answer);
  socket.emit('video-answer', { to: from, answer });
});

socket.on('video-answer', async ({ from, answer }) => {
  await peerConn.current.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('ice-candidate', ({ candidate }) => {
  peerConn.current.addIceCandidate(new RTCIceCandidate(candidate));
});

}, []);

const sendMessage = () => { socket.emit('send-message', message); setMessage(''); };

const startCall = async () => { peerConn.current = new RTCPeerConnection(); peerConn.current.onicecandidate = e => e.candidate && socket.emit('ice-candidate', { to: 'other-client-id', candidate: e.candidate }); peerConn.current.ontrack = e => remoteVideo.current.srcObject = e.streams[0]; const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); stream.getTracks().forEach(track => peerConn.current.addTrack(track, stream)); localVideo.current.srcObject = stream; const offer = await peerConn.current.createOffer(); await peerConn.current.setLocalDescription(offer); socket.emit('video-call', { to: 'other-client-id', offer }); };

const bookAppointment = async () => { await fetch('http://localhost:5000/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patientName: 'Ali', doctorName: 'Dr. Budi', date: '2025-04-20', time: '10:00' }) }); const res = await fetch('http://localhost:5000/api/appointments'); const data = await res.json(); setAppointments(data); };

return ( <div> <h2>Chat</h2> <input value={message} onChange={e => setMessage(e.target.value)} /> <button onClick={sendMessage}>Send</button> <div>{chat.map((msg, idx) => <p key={idx}>{msg}</p>)}</div>

<h2>Video Call</h2>
  <button onClick={startCall}>Start Call</button>
  <video ref={localVideo} autoPlay muted></video>
  <video ref={remoteVideo} autoPlay></video>

  <h2>Booking Konsultasi</h2>
  <button onClick={bookAppointment}>Book</button>
  <ul>
    {appointments.map((a, i) => <li key={i}>{a.patientName} - {a.date} {a.time}</li>)}
  </ul>
</div>

); }

export default App;

