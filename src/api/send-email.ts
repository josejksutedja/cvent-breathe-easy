// src/api/send-email.ts
import { Request, Response } from 'express';
import dotenv from "dotenv";

dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
// const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/emailCampaigns';

interface FormData {
  company: string;
  pic: string;
  email: string;
  phone: string;
  location: string;
  buildingType: string;
  roofArea: string;
  message: string;
}

const getBuildingTypeLabel = (value: string): string => {
  const buildingTypes: { [key: string]: string } = {
    'pabrik': 'Pabrik/Industri',
    'gudang': 'Gudang/Warehouse',
    'office': 'Perkantoran',
    'retail': 'Retail/Mall',
    'restaurant': 'Restoran/F&B',
    'sport': 'Gedung Olahraga',
    'education': 'Sekolah/Universitas',
    'healthcare': 'Rumah Sakit/Klinik',
    'religious': 'Tempat Ibadah',
    'other': 'Lainnya'
  };
  return buildingTypes[value] || value;
};

const generateEmailHTML = (data: FormData): string => {
  const currentDate = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Permintaan Konsultasi Baru - C Vent</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 300;
        }
        .content {
          background: white;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }
        .info-grid {
          display: grid;
          gap: 20px;
          margin-bottom: 30px;
        }
        .info-item {
          padding: 15px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #2563eb;
        }
        .label {
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 5px;
          display: block;
        }
        .value {
          color: #374151;
          font-size: 16px;
        }
        .message-box {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .footer {
          background: #f3f4f6;
          padding: 20px 30px;
          border-radius: 0 0 10px 10px;
          border: 1px solid #e5e7eb;
          border-top: none;
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }
        .urgent-badge {
          background: #ef4444;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="urgent-badge">PERMINTAAN KONSULTASI BARU</div>
        <h1>C Vent - Turbin Ventilator</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Konsultasi Ventilasi Industri</p>
      </div>
      
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 25px;">
          <strong>Waktu Permintaan:</strong> ${currentDate}
        </p>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="label">🏢 Nama Perusahaan</span>
            <div class="value">${data.company}</div>
          </div>
          
          <div class="info-item">
            <span class="label">👤 Penanggung Jawab</span>
            <div class="value">${data.pic}</div>
          </div>
          
          <div class="info-item">
            <span class="label">📧 Email</span>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          
          <div class="info-item">
            <span class="label">📱 Telepon/WhatsApp</span>
            <div class="value">
              <a href="https://wa.me/${data.phone.replace(/\D/g, '')}" target="_blank">${data.phone}</a>
            </div>
          </div>
          
          <div class="info-item">
            <span class="label">📍 Lokasi Proyek</span>
            <div class="value">${data.location}</div>
          </div>
          
          <div class="info-item">
            <span class="label">🏗️ Jenis Bangunan</span>
            <div class="value">${getBuildingTypeLabel(data.buildingType)}</div>
          </div>
          
          ${data.roofArea ? `
          <div class="info-item">
            <span class="label">📐 Perkiraan Luas Atap</span>
            <div class="value">${data.roofArea} m²</div>
          </div>
          ` : ''}
        </div>
        
        ${data.message ? `
        <div class="message-box">
          <span class="label">💬 Pesan/Kebutuhan Khusus:</span>
          <div class="value" style="margin-top: 10px; white-space: pre-line;">${data.message}</div>
        </div>
        ` : ''}
        
        <div style="background: #fef3cd; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin-top: 25px;">
          <h3 style="margin: 0 0 10px 0; color: #92400e;">🚀 Tindakan Selanjutnya:</h3>
          <ul style="margin: 0; color: #92400e;">
            <li>Hubungi klien dalam 24 jam</li>
            <li>Jadwalkan survei lokasi jika diperlukan</li>
            <li>Siapkan proposal penawaran</li>
            <li>Follow up progress konsultasi</li>
          </ul>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>C Vent - Turbin Ventilator</strong></p>
        <p>Jl. Raya Bekasi Blok KM No.18, RT.1/RW.3, Jatinegara, Kec. Cakung, Jakarta Timur 13930</p>
        <p>WhatsApp: +62 8121 0017 168 | Email: cvent.ventilator@gmail.com</p>
      </div>
    </body>
    </html>
  `;
};

export async function sendEmail(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const formData: FormData = req.body;

    // Validate required fields
    const requiredFields = ['company', 'pic', 'email', 'phone', 'location', 'buildingType'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        missingFields 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const emailHTML = generateEmailHTML(formData);
    
    // Prepare email data for Brevo
    const emailData = {
      sender: {
        name: "C Vent Website",
        email: "noreply@cvent.co.id" // Ganti dengan domain yang sudah diverifikasi di Brevo
      },
      to: [
        {
          email: "melisaolivia18@gmail.com",
          name: "Melissa Olivia"
        }
      ],
      replyTo: {
        email: formData.email,
        name: formData.pic
      },
      subject: `🔥 KONSULTASI BARU: ${formData.company} - ${getBuildingTypeLabel(formData.buildingType)}`,
      htmlContent: emailHTML,
      textContent: `
PERMINTAAN KONSULTASI BARU - C VENT

Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

INFORMASI KLIEN:
- Perusahaan: ${formData.company}
- Penanggung Jawab: ${formData.pic}
- Email: ${formData.email}
- Telepon: ${formData.phone}
- Lokasi: ${formData.location}
- Jenis Bangunan: ${getBuildingTypeLabel(formData.buildingType)}
${formData.roofArea ? `- Luas Atap: ${formData.roofArea} m²` : ''}

${formData.message ? `PESAN KLIEN:\n${formData.message}` : ''}

Segera follow up klien untuk konsultasi lebih lanjut.
      `.trim()
    };

    // Send email via Brevo API
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Brevo API Error:', errorData);
      throw new Error(`Brevo API Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: result.messageId 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}