// Filename: pharmacy.module.ts

import express from 'express'; import axios from 'axios'; import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock DBs let prescriptions: any[] = []; let drugInventory: Record<string, any> = {};

//--------------------------------------------- // 1. Resep Elektronik + Notifikasi ke Apotek //---------------------------------------------

router.post('/e-prescription', async (req, res) => { const { doctorId, patientId, drugs, notes } = req.body; const prescriptionId = uuidv4(); const createdAt = new Date();

const newRx = { prescriptionId, doctorId, patientId, drugs, notes, createdAt }; prescriptions.push(newRx);

// Kirim notifikasi ke apotek (via Webhook, Email, atau API internal) try { await axios.post('http://apotek-service.local/notify', { type: 'NEW_PRESCRIPTION', data: newRx, }); } catch (err) { console.error('Gagal kirim notifikasi ke apotek', err); }

res.json({ status: 'success', prescriptionId }); });

//-------------------------------------------------- // 2. Manajemen Stok + QR/Barcode Scanner Support //--------------------------------------------------

// Tambah/Update Obat router.post('/inventory/upsert', (req, res) => { const { code, name, quantity, unit, expiredAt } = req.body; drugInventory[code] = { code, name, quantity, unit, expiredAt }; res.json({ status: 'updated', drug: drugInventory[code] }); });

// Scan Barcode/QR (misalnya dari scanner atau kamera mobile) router.post('/inventory/scan', (req, res) => { const { code } = req.body; const drug = drugInventory[code]; if (drug) { res.json({ found: true, drug }); } else { res.json({ found: false, message: 'Obat tidak ditemukan' }); } });

// Cek stok obat router.get('/inventory/list', (req, res) => { res.json(Object.values(drugInventory)); });

//----------------------------------------------- // 3. Integrasi Layanan Pengantaran Obat (API) //-----------------------------------------------

router.post('/delivery/request', async (req, res) => { const { prescriptionId, deliveryAddress } = req.body; const prescription = prescriptions.find((p) => p.prescriptionId === prescriptionId);

if (!prescription) return res.status(404).json({ error: 'Prescription not found' });

try { const deliveryResponse = await axios.post('https://api.deliverypartner.com/dispatch', { sender: 'Apotek Sehat', recipient: deliveryAddress, items: prescription.drugs.map((d: any) => d.name + ' x ' + d.qty), });

res.json({ status: 'delivery_requested', tracking: deliveryResponse.data });

} catch (err) { res.status(500).json({ error: 'Delivery request failed', detail: err.message }); } });

export default router;

