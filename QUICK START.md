# 🚀 Quick Start Guide - 5 Minutes Setup

## Step 1: Install Node.js (if not already installed)
Download from: https://nodejs.org/
Choose "LTS" version

## Step 2: Install Dependencies
Open terminal/command prompt in the project folder and run:
```bash
npm install
```

## Step 3: Create .env File

Create a file named `.env` (yes, with a dot at the start) in your project root.

### Using Gmail:

1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your OS)
3. Copy the generated password
4. Create `.env` file with:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=paste-your-app-password-here
CLINIC_EMAIL=doctor@example.com
PORT=3000
NODE_ENV=development
```

**Example:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=zukile@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
CLINIC_EMAIL=zukile@gmail.com
PORT=3000
NODE_ENV=development
```

## Step 4: Start the Server

In terminal, run:
```bash
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

## Step 5: Test the Website

1. Open `index.html` in your web browser
2. Fill out the contact form
3. Click "Send Message"
4. Check your email for confirmation!

## ✅ That's It!

Your website is now live with working email notifications.

---

## 💡 Next Steps

- Customize contact info in `index.html`
- Add your before/after images
- Customize service offerings
- Deploy to the internet (see README.md)

## ⚠️ Common Issues

**"Email not sending"**
- Double-check credentials in `.env`
- Make sure `.env` file exists
- Check spam folder
- Restart server after changing `.env`

**"Cannot find module 'express'"**
- Run: `npm install`

**"Port 3000 in use"**
- Change `PORT=3001` in `.env`
- Or: Stop other applications using port 3000

**"Form submission error"**
- Check server is running
- Open browser DevTools (F12) → Console
- Check for error messages

---

## 🔐 Keep Your Credentials Safe

⚠️ **NEVER**:
- Upload `.env` to GitHub
- Share your email password
- Post your `.env` file anywhere

✅ **DO**:
- Keep `.env` local only
- Use app-specific passwords for Gmail
- Add `.env` to `.gitignore`

---

## 📧 What Happens When Someone Books?

1. ✅ Patient receives confirmation email
2. ✅ You receive notification email with their details
3. ✅ Appointment saved to `appointments.json`
4. ✅ Patient sees success message on website

---

## 🎉 You're All Set!

Your dental practice website now:
- ✨ Looks professional and modern
- 📱 Works on mobile and desktop
- 📧 Sends real email notifications
- 💾 Saves all appointments
- 🚀 Is ready to attract customers

Good luck! 🦷
