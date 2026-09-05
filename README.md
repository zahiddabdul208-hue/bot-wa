# 🤖 WhatsApp Bot dengan Fitur Training

Bot WhatsApp yang bisa dipelajari dan memberikan respons seperti manusia!

## 📋 Requirements

- **Node.js** v14+ (Download: https://nodejs.org)
- **WhatsApp** (harus terinstall di HP)
- **Terminal/CMD**

## 🚀 Setup & Instalasi

### 1. Install Node.js
Download dan install dari https://nodejs.org (pilih LTS)

### 2. Siapkan Folder Project
```bash
mkdir whatsapp-bot
cd whatsapp-bot
```

### 3. Copy File Bot
Copy 2 file ini ke folder:
- `whatsapp_bot.js`
- `package.json`

### 4. Install Dependencies
```bash
npm install
```

### 5. Jalankan Bot
```bash
npm start
```

Tunggu sampai muncul **QR Code** di terminal.

### 6. Scan QR Code
- Buka WhatsApp di HP
- Pergi ke Settings → Linked Devices
- Tap tombol "Link a device"
- Scan QR Code yang muncul di terminal

✓ Bot siap digunakan!

---

## 📚 Cara Menggunakan

### Mode Normal (Chat)
Kirim pertanyaan apa saja ke bot. Jika sudah pernah diajari, bot akan menjawab dengan jawaban yang sama atau mirip.

```
Kamu: Halo, siapa namamu?
Bot: Maaf, saya belum tahu tentang itu. Mau mengajarkan saya? Ketik !train
```

### Mode Training (Mengajarkan Bot)

#### Langkah 1: Aktifkan Training Mode
```
Ketik: !train
Bot akan reply: "Mode training aktif!"
```

#### Langkah 2: Kirim Pertanyaan
```
Kamu: Halo, siapa namamu?
Bot akan balik: "✅ Pertanyaan dicatat. Sekarang kirim jawaban"
```

#### Langkah 3: Kirim Jawaban
```
Kamu: Saya adalah bot WhatsApp Anda
Bot akan reply: "✓ Berhasil disimpan!"
```

#### Langkah 4: Ulangi atau Selesai
- Untuk menambah lagi: kirim pertanyaan baru
- Untuk selesai: ketik `!train` lagi

---

## 🎮 Daftar Command

| Command | Fungsi |
|---------|--------|
| `!train` | Mulai mode pembelajaran |
| `!list` | Tampilkan semua jawaban yang sudah dilatih |
| `!clear` | Hapus semua data pembelajaran |
| `!help` | Tampilkan bantuan |

---

## 💾 Data Penyimpanan

Semua jawaban yang dilatih disimpan di file **`knowledge_base.json`**

Contoh isi file:
```json
{
  "Halo, siapa namamu?": "Saya adalah bot WhatsApp Anda",
  "Apa kabar?": "Saya baik-baik saja, terima kasih sudah bertanya!",
  "Siapa developer mu?": "Saya dibuat dengan cinta oleh Anda"
}
```

---

## 🧠 Cara Kerja Bot

1. **Similarity Matching**: Bot mencari pertanyaan di knowledge base yang mirip dengan input
2. **Scoring**: Setiap pertanyaan diberi skor kesamaan (0-1)
3. **Response**: Jika skor > 0.5, bot akan jawab dengan jawaban yang tersimpan
4. **Fallback**: Jika tidak ada yang mirip, bot minta untuk diajari

---

## 🔧 Troubleshooting

### "Module not found" error
**Solusi:**
```bash
npm install whatsapp-web.js qrcode-terminal
```

### QR Code tidak muncul
- Pastikan terminal cukup lebar
- Coba tutup dan jalankan lagi: `npm start`
- Pastikan WhatsApp sudah login di HP

### Bot tidak menjawab
- Pastikan HP terhubung internet
- Cek di console apakah pesan diterima
- Coba restart bot: `Ctrl+C` kemudian `npm start`

### Ingin reset semua data
```
Kirim: !clear
```
Semua jawaban akan terhapus dan bisa mulai dari awal.

---

## 📊 Tips Melatih Bot yang Baik

1. **Variasikan pertanyaan**: Jangan hanya satu varian pertanyaan
   ```
   ✓ Ajarkan: "Halo", "Apa kabar?", "Siapa kamu?"
   ✗ Jangan hanya: "Halo" terus-terusan
   ```

2. **Jawaban yang natural**: Buat jawaban seperti manusia berbicara
   ```
   ✓ "Halo juga! Senang berbicara dengan Anda 😊"
   ✗ "HELLO_USER_INPUT_RECEIVED"
   ```

3. **Context-aware**: Ajarkan jawaban yang sesuai konteks
   ```
   Q: "Jam berapa sekarang?"
   A: "Sayangnya saya tidak bisa cek jam real-time, tapi Anda bisa lihat di HP Anda"
   ```

4. **Update berkala**: Terus tambah variasi pertanyaan dan jawaban

---

## 🎯 Contoh Training Lengkap

```
1. Ketik: !train

2. Kamu: Siapa nama Anda?
   Bot: Pertanyaan dicatat. Sekarang kirim jawaban

3. Kamu: Nama saya adalah ChatBot Indonesia
   Bot: ✓ Berhasil disimpan!

4. Kamu: Apa nama Anda?
   Bot: Pertanyaan dicatat. Sekarang kirim jawaban

5. Kamu: Saya adalah ChatBot Indonesia, senang berkenalan
   Bot: ✓ Berhasil disimpan!

6. Ketik: !train
   Bot: Mode training selesai. Bot siap menjawab!

7. Kamu: Siapa kamu?
   Bot: Nama saya adalah ChatBot Indonesia
```

---

## 🚨 Catatan Penting

- **Privasi**: Bot berjalan lokal di komputer Anda
- **Internet**: Perlu koneksi internet untuk WhatsApp
- **24/7**: Komputer harus tetap menyala agar bot aktif
- **Backup**: Backup file `knowledge_base.json` secara berkala

---

## 📈 Upgrade dan Customization

Bot ini bisa diupgrade dengan:
- Natural Language Processing (NLP) lebih canggih
- Database (MongoDB/SQLite)
- API integration
- Multi-language support
- Sentiment analysis
- Auto-learning dari percakapan

---

## 📞 Support

Jika ada error atau pertanyaan, cek:
1. Console output saat running
2. Pastikan file `package.json` dan `whatsapp_bot.js` ada
3. Coba install ulang: `npm install`
4. Restart bot

---

**Happy Chatting! 🎉**
