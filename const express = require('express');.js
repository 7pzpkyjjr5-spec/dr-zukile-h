const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Verify transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.log('Email configuration error:', error);
    } else {
        console.log('✓ Email service is ready');
    }
});

// Create appointments database file if it doesn't exist
const appointmentsFile = path.join(__dirname, 'appointments.json');
if (!fs.existsSync(appointmentsFile)) {
    fs.writeFileSync(appointmentsFile, JSON.stringify([], null, 2));
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running ✓' });
});

// Handle appointment bookings
app.post('/api/book-appointment', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;

        // Validate input
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and phone are required',
            });
        }

        // Save to appointments.json
        const appointments = JSON.parse(fs.readFileSync(appointmentsFile, 'utf8'));
        const appointment = {
            id: Date.now(),
            name,
            email,
            phone,
            service: service || 'Not specified',
            message: message || '',
            bookingDate: new Date().toISOString(),
        };
        appointments.push(appointment);
        fs.writeFileSync(appointmentsFile, JSON.stringify(appointments, null, 2));

        // Send email to clinic
        const clinicEmailBody = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #0a6b7c;">New Appointment Booking</h2>
                <p><strong>Patient Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Service Interested:</strong> ${service || 'Not specified'}</p>
                <p><strong>Message:</strong></p>
                <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
                    ${message || 'No message provided'}
                </p>
                <p style="margin-top: 20px; font-size: 12px; color: #999;">
                    Booking received on: ${new Date().toLocaleString()}
                </p>
            </div>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.CLINIC_EMAIL,
            subject: `New Appointment Booking - ${name}`,
            html: clinicEmailBody,
        });

        // Send confirmation email to patient
        const patientEmailBody = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #0a6b7c;">Appointment Booking Confirmation</h2>
                <p>Hi ${name},</p>
                <p>Thank you for booking an appointment with <strong>Dr Zukile Hermans Inc.</strong></p>
                
                <h3>Your Booking Details:</h3>
                <ul style="background: #f5f5f5; padding: 15px; border-radius: 5px; list-style: none;">
                    <li><strong>Service:</strong> ${service || 'Not specified'}</li>
                    <li><strong>Booking Date:</strong> ${new Date().toLocaleString()}</li>
                </ul>

                <h3>Contact Information:</h3>
                <p>
                    📞 <strong>Phone:</strong> <a href="tel:0510114137" style="color: #0a6b7c;">051 011 4137</a><br>
                    📍 <strong>Location:</strong> Shop No 7, Cornerstone Building, Van Riebeeck St, Thaba Nchu 9780<br>
                    🕐 <strong>Hours:</strong> Mon-Fri: 9:00 AM - 5:00 PM | Sat: 9:00 AM - 1:00 PM
                </p>

                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
                    We will contact you shortly to confirm your appointment time.<br>
                    Looking forward to seeing you!<br><br>
                    Best regards,<br>
                    <strong>Dr Zukile Hermans Inc.</strong><br>
                    Excellence and Access for Every Home
                </p>
            </div>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Appointment Booking Confirmation - Dr Zukile Hermans',
            html: patientEmailBody,
        });

        res.json({
            success: true,
            message: 'Appointment booked successfully! Check your email for confirmation.',
            appointmentId: appointment.id,
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error booking appointment. Please try again.',
            error: error.message,
        });
    }
});

// Get all appointments (admin endpoint)
app.get('/api/appointments', (req, res) => {
    try {
        const appointments = JSON.parse(fs.readFileSync(appointmentsFile, 'utf8'));
        res.json({
            success: true,
            count: appointments.length,
            appointments: appointments.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)),
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get appointment by ID
app.get('/api/appointments/:id', (req, res) => {
    try {
        const appointments = JSON.parse(fs.readFileSync(appointmentsFile, 'utf8'));
        const appointment = appointments.find(a => a.id === parseInt(req.params.id));

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        res.json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
    try {
        let appointments = JSON.parse(fs.readFileSync(appointmentsFile, 'utf8'));
        appointments = appointments.filter(a => a.id !== parseInt(req.params.id));
        fs.writeFileSync(appointmentsFile, JSON.stringify(appointments, null, 2));

        res.json({ success: true, message: 'Appointment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Send test email
app.post('/api/test-email', async (req, res) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.CLINIC_EMAIL,
            subject: 'Test Email from Dr Zukile Hermans Website',
            html: '<h2>If you see this, email is working!</h2>',
        });

        res.json({ success: true, message: 'Test email sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║         Dr Zukile Hermans - Server Running                 ║
    ║         Server: http://localhost:${PORT}                        ║
    ║         API: http://localhost:${PORT}/api/health                ║
    ╚════════════════════════════════════════════════════════════╝
    `);
});