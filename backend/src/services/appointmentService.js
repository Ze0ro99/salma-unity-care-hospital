const Appointment = require('../models/Appointment'); // Import the Appointment model
const User = require('../models/User'); // Import the User model

// Appointment service class
class AppointmentService {
    // Create a new appointment
    static async createAppointment({ date, time, patientId, doctorId }) {
        // Validate that the patient and doctor exist
        const patient = await User.findById(patientId);
        const doctor = await User.findById(doctorId);
        if (!patient || !doctor) {
            throw new Error('Invalid patient or doctor ID');
        }

        // Create a new appointment
        const appointment = new Appointment({
            date,
            time,
            patient: patientId,
            doctor: doctorId,
        });

        // Save the appointment to the database
        await appointment.save();

        return appointment;
    }

    // Get all appointments for a specific patient
    static async getAppointmentsByPatient(patientId) {
        const appointments = await Appointment.find({ patient: patientId })
            .populate('doctor', 'name email') // Populate doctor details
            .populate('patient', 'name email'); // Populate patient details

        return appointments;
    }

    // Get all appointments for a specific doctor
    static async getAppointmentsByDoctor(doctorId) {
        const appointments = await Appointment.find({ doctor: doctorId })
            .populate('doctor', 'name email') // Populate doctor details
            .populate('patient', 'name email'); // Populate patient details

        return appointments;
    }

    // Update an appointment
    static async updateAppointment(appointmentId, updateData) {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        // Update appointment fields
        Object.assign(appointment, updateData);
        await appointment.save(); // Save changes

        return appointment;
    }

    // Delete an appointment
    static async deleteAppointment(appointmentId) {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        await appointment.remove(); // Remove the appointment from the database
        return { message: 'Appointment deleted successfully' };
    }
}

module.exports = AppointmentService; // Export the AppointmentService class
