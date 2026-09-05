// WhatsApp Bot dengan Fitur Training
// Install:
// npm install whatsapp-web.js qrcode-terminal

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// ===============================
// KONFIGURASI
// ===============================

const KNOWLEDGE_BASE_FILE = path.join(__dirname, 'knowledge_base.json');

// ===============================
// INISIALISASI WHATSAPP CLIENT
// ===============================

const client = new Client({
  authStrategy: new LocalAuth(),

  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
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
      const data = fs.readFileSync(KNOWLEDGE_BASE_FILE, 'utf8');

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
    console.error('❌ Gagal membaca knowledge base:', error.message);
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
    console.error('❌ Gagal menyimpan knowledge base:', error.message);
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
  const normalizedInput = userInput.toLowerCase().trim();

  let bestMatch = null;
  let bestScore = 0;

  for (const [question, answer] of Object.entries(knowledgeBase)) {
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

client.on('qr', (qr) => {
  console.log('\n📱 Scan QR Code dengan WhatsApp:\n');

  // small: true supaya QR lebih kecil
  qrcode.generate(qr, {
    small: true
  });
});

// ===============================
// READY
// ===============================

client.on('ready', () => {
  console.log('\n================================');
  console.log('✓ BOT WHATSAPP SIAP!');
  console.log('================================');
  console.log(
    `📚 Knowledge Base: ${Object.keys(knowledgeBase).length} data`
  );
  console.log('🤖 Bot sedang menunggu pesan...\n');
});

// ===============================
// MESSAGE HANDLER
// ===============================

client.on('message', async (msg) => {
  try {
    const userInput = msg.body.trim();

    // Abaikan pesan kosong
    if (!userInput) {
      return;
    }

    console.log(
      `[${new Date().toLocaleTimeString()}] Pesan: ${userInput}`
    );

    // ===============================
    // COMMAND !HELP
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

Contoh:

!train

Pertanyaan:
Halo

Jawaban:
Halo juga! 👋
      `.trim();

      await msg.reply(helpText);
      return;
    }

    // ===============================
    // COMMAND !TRAIN
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
    // COMMAND !STOP
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
    // COMMAND !LIST
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
    // COMMAND !CLEAR
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

      // Belum ada pertanyaan
      if (pendingQuestion === '') {

        pendingQuestion = userInput;

        await msg.reply(
          `✅ Pertanyaan dicatat:\n\n` +
          `"${userInput}"\n\n` +
          `Sekarang kirim *jawaban* untuk pertanyaan tersebut.`
        );

        return;
      }

      // Sudah ada pertanyaan → sekarang menerima jawaban
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

      // Menampilkan status mengetik
      await chat.sendStateTyping();

      // Delay agar terlihat natural
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
        Math.floor(Math.random() * fallbackResponses.length)
      ];

    await msg.reply(randomReply);

  } catch (error) {
    console.error('❌ Error saat memproses pesan:');
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
  console.error('❌ Authentication gagal:', message);
});

// ===============================
// ERROR
// ===============================

client.on('error', (error) => {
  console.error('❌ Client error:', error);
});

// ===============================
// START BOT
// ===============================

loadKnowledgeBase();

console.log('🚀 Memulai WhatsApp Bot...\n');

client.initialize();