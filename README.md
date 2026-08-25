# Dr Zukile Hermans - Dental Practice Website

A minimalist, bold design website with backend email notifications for appointment bookings.

## 📋 Project Structure

```
project/
├── index.html              # Frontend website
├── server.js               # Backend (Node.js/Express)
├── package.json            # Dependencies
├── .env.example            # Environment variables template
├── .env                    # Environment variables (create this)
├── appointments.json       # Appointments database
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Gmail Account** (or other email service)
- **Text Editor** (VS Code recommended)

### Step 1: Setup Backend

#### 1.1 Install Dependencies
```bash
npm install
```

This installs:
- `express` - Web framework
- `nodemailer` - Email sending
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

#### 1.2 Configure Email

**Option A: Using Gmail**

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Create an **App Password**:
   - Go to Security settings
   - Click "App passwords"
   - Select "Mail" and "Windows Computer"
   - Copy the generated password

4. Create `.env` file in project root:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
CLINIC_EMAIL=doctor@example.com
PORT=3000
NODE_ENV=development
```

**Option B: Using Outlook/Hotmail**
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
CLINIC_EMAIL=doctor@example.com
PORT=3000
NODE_ENV=development
```

**Option C: Using Other Services (Gmail, SendGrid, etc.)**
Modify the transporter configuration in `server.js`

### Step 2: Start the Server

```bash
# Development mode (auto-restarts on changes)
npm run dev

# Production mode
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║         Dr Zukile Hermans - Server Running                 ║
║         Server: http://localhost:3000                      ║
║         API: http://localhost:3000/api/health              ║
╚════════════════════════════════════════════════════════════╝
```

### Step 3: Open the Website

1. Open `index.html` in your browser
2. Test the appointment form
3. Check the console for any errors

## 📧 Email Features

### What Happens When Someone Books an Appointment:

1. **Patient Email** - Confirmation email sent to the customer with:
   - Booking details
   - Clinic contact info
   - Business hours
   - Location

2. **Clinic Email** - Notification email sent to you with:
   - Patient information
   - Service requested
   - Message/notes
   - Booking timestamp

3. **Database** - Appointment saved to `appointments.json`

## 🔌 API Endpoints

### POST `/api/book-appointment`
Book a new appointment
```javascript
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+27510114137",
  "service": "General Dentistry",
  "message": "I have tooth pain"
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Appointment booked successfully! Check your email for confirmation.",
  "appointmentId": 1234567890
}
```

### GET `/api/health`
Check if server is running
```
GET http://localhost:3000/api/health
```

**Response:**
```javascript
{ "status": "Server is running ✓" }
```

### GET `/api/appointments`
Get all appointments (admin view)
```
GET http://localhost:3000/api/appointments
```

**Response:**
```javascript
{
  "success": true,
  "count": 5,
  "appointments": [
    {
      "id": 1234567890,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+27510114137",
      "service": "General Dentistry",
      "message": "I have tooth pain",
      "bookingDate": "2024-01-15T10:30:00Z"
    }
    // ... more appointments
  ]
}
```

### GET `/api/appointments/:id`
Get specific appointment
```
GET http://localhost:3000/api/appointments/1234567890
```

### DELETE `/api/appointments/:id`
Delete an appointment
```
DELETE http://localhost:3000/api/appointments/1234567890
```

## 🧪 Testing

### Test Email Sending
```bash
curl -X POST http://localhost:3000/api/test-email
```

### Test Booking
```bash
curl -X POST http://localhost:3000/api/book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "email": "test@example.com",
    "phone": "0510114137",
    "service": "General Dentistry",
    "message": "This is a test booking"
  }'
```

## 🌐 Deployment

### Option 1: Deploy to Heroku (Free)

1. Create Heroku account at [heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Login: `heroku login`
4. Create app: `heroku create your-app-name`
5. Set env variables:
```bash
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set CLINIC_EMAIL=doctor@example.com
```
6. Deploy: `git push heroku main`

### Option 2: Deploy to Render (Free)

1. Create account at [render.com](https://render.com)
2. Connect GitHub repository
3. Create new "Web Service"
4. Set environment variables in dashboard
5. Deploy automatically on push

### Option 3: Deploy to Your Own Server

Use AWS EC2, DigitalOcean, Linode, or any VPS:
1. Upload files via FTP/SSH
2. Install Node.js
3. Run `npm install`
4. Use PM2 to keep server running: `pm2 start server.js`
5. Set up domain with SSL certificate

## 🔐 Security Considerations

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use app-specific passwords** for Gmail
3. **Validate all inputs** on the backend
4. **Rate limiting** - Add to prevent spam
5. **HTTPS only** - Use SSL certificate on production
6. **CORS** - Restrict to your domain only

### Add CORS Restriction:
In `server.js`, replace:
```javascript
app.use(cors());
```

With:
```javascript
const corsOptions = {
  origin: 'https://yourdomain.com',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### Email not sending
1. Check `.env` file is created
2. Verify email credentials
3. Check spam folder
4. Enable "Less secure app access" for Gmail (if not using App Password)

### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

Or change port in `.env`:
```env
PORT=3001
```

### Form submissions not working
1. Check browser console for errors
2. Verify server is running
3. Check API URL in `index.html` (should be `http://localhost:3000`)
4. Check CORS is enabled

## 📱 Mobile Responsiveness

Website is fully responsive for:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

## 🎨 Customization

### Change Colors
Edit `:root` in `index.html`:
```css
:root {
    --primary: #0a6b7c;      /* Main teal color */
    --accent: #ff6b35;       /* Orange accent */
    --text-dark: #1a1a1a;    /* Text color */
}
```

### Update Contact Info
Edit in `index.html`:
- Phone number
- Address
- Business hours
- Email

### Add Before/After Images
Replace placeholder URLs with your images:
```html
<img src="your-image-url.jpg" alt="Before and After">
```

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check server terminal for errors
3. Verify `.env` configuration
4. Test API endpoints with curl/Postman

## 📄 License

Created for Dr Zukile Hermans Inc.

## 📝 Notes

- Appointments are stored in `appointments.json`
- Backup this file regularly
- Email service must be configured for notifications
- Server must be running for form submissions to work

---

**Last Updated:** January 2024
**Version:** 1.0.0
