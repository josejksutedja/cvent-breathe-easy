import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendEmail } from '../api/send-email';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/api/send-email', sendEmail);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Brevo API Key configured: ${process.env.BREVO_API_KEY ? 'Yes' : 'No'}`);
});