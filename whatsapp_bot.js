
// WhatsApp Bot dengan Fitur Training
// Railway version dengan QR Code melalui halaman web

const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const express = require('express');
const fs = require('fs');
const path = require('path');

// ===============================
// WEB SERVER UNTUK QR
// ===============================

const app = express();
const PORT = process.env.PORT || 3000;

let currentQR = null;

app.get('/', (req, res) => {
  if (currentQR) {
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhatsApp Bot - QR Code</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #111;
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
    }

    .container {
      background: #1e1e1e;
      padding: 30px;
      border-radius: 20px;
      max-width: 400px;
      width: 90%;
      box-sizing: border-box;
    }

    h1 {
      margin-top: 0;
    }

    img {
      width: 300px;
      max-width: 100%;
      background: white;
      padding: 10px;
      border-radius: 10px;
      box-sizing: border-box;
    }

    .waiting {
      color: #ffaa00;
      font-size: 18px;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>🤖 WhatsApp Bot</h1>

    <p class="waiting">
      📱 Scan QR ini dengan WhatsApp
    </p>

    <img src="${currentQR}" alt="WhatsApp QR Code">

    <p>
      WhatsApp → Perangkat tertaut → Tautkan perangkat
    </p>
  </div>
</body>
</html>
    `);
  } else {
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhatsApp Bot</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #111;
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
    }

    .container {
      background: #1e1e1e;
      padding: 30px;
      border-radius: 20px;
      max-width: 400px;
      width: 90%;
    }

    .success {
      color: #00ff88;
      font-size: 20px;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>🤖 WhatsApp Bot</h1>

    <p class="success">
      ✓ Bot sudah terhubung!
    </p>

    <p>
      QR Code tidak diperlukan.
    </p>
  </div>
</body>
</html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Web server berjalan di port ${PORT}`);
});

// ===============================
// KONFIGURASI
// ===============================

const KNOWLEDGE_BASE_FILE = path.join(
  __dirname,
  'knowledge_base.json'
);

// ===============================
// WHATSAPP CLIENT
// ===============================

const client = new Client({
  authStrategy: new LocalAuth(),

  puppeteer: {
    headless: true,

    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  }
});

// ===============================
// KNOWLEDGE BASE
// ===============================

let knowledgeBase = {};

function loadKnowledgeBase() {
  try {
    if (fs.existsSync(KNOWLEDGE_BASE_FILE)) {
      const data = fs.readFileSync(
        KNOWLEDGE_BASE_FILE,
        'utf8'
      );

      if (data.trim() !== '') {
        knowledgeBase = JSON.parse(data);
      } else {
        knowledgeBase = {};
      }

      console.log('✓ Knowledge base loaded');
    } else {
      knowledgeBase = {};
      saveKnowledgeBase();

      console.log('✓ Knowledge base dibuat');
    }
  } catch (error) {
    console.error(
      '❌ Gagal membaca knowledge base:',
      error.message
    );

    knowledgeBase = {};
  }
}

function saveKnowledgeBase() {
  try {
    fs.writeFileSync(
      KNOWLEDGE_BASE_FILE,
      JSON.stringify(knowledgeBase, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error(
      '❌ Gagal menyimpan knowledge base:',
      error.message
    );
  }
}

// ===============================
// SIMILARITY
// ===============================

function calculateSimilarity(str1, str2) {
  const s1 = str1
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const s2 = str2
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (s1.length === 0 || s2.length === 0) {
    return 0;
  }

  let matches = 0;

  for (const word of s1) {
    if (s2.includes(word)) {
      matches++;
    }
  }

  return matches / Math.max(s1.length, s2.length);
}

function findSimilarQuestion(userInput) {
  const normalizedInput = userInput
    .toLowerCase()
    .trim();

  let bestMatch = null;
  let bestScore = 0;

  for (const [question, answer] of Object.entries(
    knowledgeBase
  )) {
    const score = calculateSimilarity(
      normalizedInput,
      question.toLowerCase()
    );

    if (score > bestScore && score >= 0.5) {
      bestScore = score;
      bestMatch = answer;
    }
  }

  return bestMatch;
}

// ===============================
// TRAINING MODE
// ===============================

let learningMode = false;
let pendingQuestion = '';

// ===============================
// QR CODE
// ===============================

client.on('qr', async (qr) => {
  try {
    currentQR = await QRCode.toDataURL(qr, {
      width: 500,
      margin: 2,
      errorCorrectionLevel: 'M'
    });

    console.log('');
    console.log('================================');
    console.log('📱 QR CODE TERSEDIA');
    console.log('================================');
    console.log('Buka URL Railway bot kamu.');
    console.log('Scan QR dari halaman tersebut.');
    console.log('================================');
    console.log('');
  } catch (error) {
    console.error(
      '❌ Gagal membuat QR:',
      error.message
    );
  }
});

// ===============================
// READY
// ===============================

client.on('ready', () => {
  currentQR = null;

  console.log('');
  console.log('================================');
  console.log('✓ BOT WHATSAPP SIAP!');
  console.log('================================');

  console.log(
    `📚 Knowledge Base: ${
      Object.keys(knowledgeBase).length
    } data`
  );

  console.log('🤖 Bot sedang menunggu pesan...');
  console.log('');
});
client.on('message_create', (msg) => {
  console.log(
    '📩 MESSAGE_CREATE:',
    msg.from,
    '|',
    msg.body
  );
});

client.on('change_state', (state) => {
  console.log('🔄 WhatsApp State:', state);
});

// ===============================
// MESSAGE DEBUG
// ===============================

client.on('message_create', (msg) => {
  console.log(
    '📩 MESSAGE_CREATE:',
    msg.from,
    '|',
    msg.body
  );
});

client.on('change_state', (state) => {
  console.log('🔄 WhatsApp State:', state);
});

// ===============================
// MESSAGE HANDLER
// ===============================

client.on('message', async (msg) => {
  try {
    console.log(
      '📥 MESSAGE EVENT:',
      msg.from,
      '|',
      msg.body
    );

    const userInput = msg.body.trim();

    if (!userInput) {
      return;
    }

    console.log(
      `[${new Date().toLocaleTimeString()}] Pesan: ${userInput}`
    );
    // ===============================
    // HELP
    // ===============================

    if (userInput.toLowerCase() === '!help') {
      const helpText = `
🤖 *WHATSAPP BOT*

*Command:*
• !train - Mulai mode training
• !list - Lihat pengetahuan
• !clear - Hapus semua pengetahuan
• !stop - Keluar dari mode training
• !help - Bantuan

*Cara training:*
1. Ketik !train
2. Kirim pertanyaan
3. Bot akan meminta jawaban
4. Kirim jawabannya
5. Data otomatis disimpan
      `.trim();

      await msg.reply(helpText);
      return;
    }

    // ===============================
    // TRAIN
    // ===============================

    if (userInput.toLowerCase() === '!train') {
      learningMode = true;
      pendingQuestion = '';

      await msg.reply(
        '🎓 *Mode Training Aktif!*\n\n' +
        'Kirim pertanyaan yang ingin diajarkan kepada bot.'
      );

      return;
    }

    // ===============================
    // STOP
    // ===============================

    if (userInput.toLowerCase() === '!stop') {
      learningMode = false;
      pendingQuestion = '';

      await msg.reply(
        '✓ Mode training dihentikan.\n' +
        '🤖 Bot kembali ke mode normal.'
      );

      return;
    }

    // ===============================
    // LIST
    // ===============================

    if (userInput.toLowerCase() === '!list') {
      const entries = Object.entries(knowledgeBase);

      if (entries.length === 0) {
        await msg.reply(
          '📭 Knowledge base masih kosong.\n\n' +
          'Gunakan *!train* untuk mengajarkan bot.'
        );

        return;
      }

      let list = '📚 *DAFTAR PENGETAHUAN*\n\n';

      entries.forEach(([question, answer], index) => {
        const shortAnswer =
          answer.length > 80
            ? answer.substring(0, 80) + '...'
            : answer;

        list += `${index + 1}. *Q:* ${question}\n`;
        list += `   *A:* ${shortAnswer}\n\n`;
      });

      await msg.reply(list);
      return;
    }

    // ===============================
    // CLEAR
    // ===============================

    if (userInput.toLowerCase() === '!clear') {
      knowledgeBase = {};
      saveKnowledgeBase();

      await msg.reply(
        '🗑️ Semua data knowledge base berhasil dihapus.'
      );

      return;
    }

    // ===============================
    // TRAINING MODE
    // ===============================

    if (learningMode) {

      if (pendingQuestion === '') {

        pendingQuestion = userInput;

        await msg.reply(
          `✅ Pertanyaan dicatat:\n\n` +
          `"${userInput}"\n\n` +
          `Sekarang kirim *jawaban* untuk pertanyaan tersebut.`
        );

        return;
      }

      const answer = userInput;

      knowledgeBase[pendingQuestion] = answer;

      saveKnowledgeBase();

      await msg.reply(
        `✅ *Berhasil disimpan!*\n\n` +
        `*Q:* ${pendingQuestion}\n` +
        `*A:* ${answer}\n\n` +
        `📚 Data tersimpan di knowledge base.\n\n` +
        `Kirim pertanyaan lain untuk melatih bot lagi.\n` +
        `Atau ketik *!stop* untuk selesai.`
      );

      pendingQuestion = '';

      return;
    }

    // ===============================
    // MODE NORMAL
    // ===============================

    const response = findSimilarQuestion(userInput);

    if (response) {

      const chat = await msg.getChat();

      await chat.sendStateTyping();

      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      await msg.reply(response);

      console.log('→ ✓ Jawaban dikirim');

      return;
    }

    // ===============================
    // FALLBACK
    // ===============================

    const fallbackResponses = [
      'Hmm, saya belum tahu tentang itu 🤔\nKetik *!train* untuk mengajari saya.',
      'Pertanyaan bagus! Tapi saya belum mempelajarinya.\nGunakan *!train* untuk mengajari saya.',
      'Maaf, saya belum memahami pertanyaan itu.\nCoba gunakan *!train* 📚',
      'Saya belum punya jawaban untuk itu.\nBantu saya belajar dengan *!train* 🤖'
    ];

    const randomReply =
      fallbackResponses[
        Math.floor(
          Math.random() * fallbackResponses.length
        )
      ];

    await msg.reply(randomReply);

  } catch (error) {

    console.error(
      '❌ Error saat memproses pesan:'
    );

    console.error(error);

    try {
      await msg.reply(
        '⚠️ Terjadi kesalahan saat memproses pesan.'
      );
    } catch (replyError) {
      console.error(
        '❌ Tidak bisa mengirim pesan error:',
        replyError.message
      );
    }
  }
});

// ===============================
// DISCONNECTED
// ===============================

client.on('disconnected', (reason) => {
  console.log('\n❌ WhatsApp terputus.');
  console.log('Alasan:', reason);
});

// ===============================
// AUTHENTICATION
// ===============================

client.on('authenticated', () => {
  console.log('✓ WhatsApp authentication berhasil');
});

client.on('auth_failure', (message) => {
  console.error(
    '❌ Authentication gagal:',
    message
  );
});

// ===============================
// ERROR
// ===============================

client.on('error', (error) => {
  console.error(
    '❌ Client error:',
    error
  );
});

// ===============================
// START BOT
// ===============================

loadKnowledgeBase();

console.log('🚀 Memulai WhatsApp Bot...\n');

client.initialize();

