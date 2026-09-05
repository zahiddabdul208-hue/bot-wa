# ⚡ Quick Start Guide - 5 Menit Setup

## 🎯 Tujuan
Setup dan jalankan WhatsApp Bot dalam 5 menit!

---

## ✅ Checklist

- [ ] Node.js sudah terinstall
- [ ] Semua file sudah ter-copy
- [ ] npm install sudah dijalankan
- [ ] Bot sudah berjalan dan QR Code muncul

---

## 📱 Step-by-Step

### Step 1: Download & Ekstrak (1 menit)
```
1. Download 3 file ini:
   - whatsapp_bot.js
   - package.json
   - README.md

2. Buat folder baru di Desktop:
   - Folder: "whatsapp-bot"

3. Pindahkan 3 file ke folder tersebut
```

### Step 2: Buka Terminal/CMD (30 detik)

**Windows:**
- Buka folder `whatsapp-bot`
- Klik kanan → "Open PowerShell here" atau "Open CMD here"

**Mac:**
- Buka Terminal
- Ketik: `cd ~/Desktop/whatsapp-bot`

**Linux:**
- Buka Terminal
- Ketik: `cd ~/Desktop/whatsapp-bot`

### Step 3: Install Dependencies (2 menit)

Ketik di terminal:
```bash
npm install
```

Tunggu sampai selesai (muncul text "added X packages")

### Step 4: Jalankan Bot (30 detik)

```bash
npm start
```

Tunggu sampai muncul **QR Code** di terminal.

### Step 5: Scan QR Code (1 menit)

Di HP:
1. Buka **WhatsApp**
2. Tap **Settings** (3 dots atau gear icon)
3. Pilih **Linked Devices** atau **WhatsApp Web**
4. Tap **Link a device**
5. **Scan QR Code** yang ada di terminal

✓ **SELESAI! Bot sudah aktif!**

---

## 🧪 Test Bot

Sekarang test dengan mengirim pesan ke akun Anda atau grup:

### Test 1: Normal Chat
```
Kamu: Halo
Bot:  Halo juga! 👋 Senang berbicara dengan Anda
```

### Test 2: Teach Bot
```
Kamu: !train
Bot:  Mode training aktif! Kirim pertanyaan yang ingin diajarkan

Kamu: Nama bot apa?
Bot:  ✅ Pertanyaan dicatat: "Nama bot apa?"
     Sekarang kirim jawaban yang sesuai:

Kamu: Saya adalah bot WhatsApp pintar
Bot:  ✓ Berhasil disimpan!
     Q: Nama bot apa?
     A: Saya adalah bot WhatsApp pintar
```

### Test 3: Lihat Knowledge Base
```
Kamu: !list
Bot:  📚 Daftar Pengetahuan
     1. Q: Nama bot apa?
        A: Saya adalah bot WhatsApp pintar
     ...
```

---

## 🎮 Command Cheat Sheet

| Command | Hasil |
|---------|-------|
| `!train` | Mulai mengajarkan bot |
| `!list` | Lihat semua jawaban |
| `!clear` | Hapus semua data |
| `!help` | Bantuan lengkap |

---

## ⚙️ Keep Bot Running

### Option 1: Terminal Tetap Buka
- Biarkan terminal terbuka
- Bot aktif selama komputer menyala

### Option 2: Background (Windows)
Jika mau background:
```bash
npm install pm2 -g
pm2 start whatsapp_bot.js
pm2 startup
pm2 save
```

### Option 3: Scheduled Task (Windows)
- Task Scheduler → Create Basic Task
- Set trigger: Jalankan di startup
- Set action: `node C:\path\to\whatsapp_bot.js`

---

## 🚨 Troubleshooting

| Problem | Solusi |
|---------|--------|
| "command not found: npm" | Instal Node.js dari https://nodejs.org |
| "ENOENT: no such file" | Pastikan file `.js` ada di folder yang sama |
| QR Code tidak muncul | Terminal terlalu kecil, perbesar window |
| Bot tidak respond | Cek koneksi internet dan restart |

---

## 📚 Next Steps

Setelah bot berjalan:

1. **Ajarkan bot** dengan cara yang natural
2. **Test dengan grup** - ajak teman mencoba
3. **Backup data** - copy file `knowledge_base.json`
4. **Upgrade** - lihat README.md untuk customization

---

## 💡 Tips

✓ **Semakin sering dilatih** = Semakin pintar bot
✓ **Natural language** = Bot terasa lebih manusiawi  
✓ **Variasi input** = Bot bisa handle berbagai cara bertanya
✓ **Update berkala** = Tambah jawaban baru setiap minggu

---

## 🎉 Congrats!

Bot Anda sudah aktif! Sekarang mulai ajarkan dan nikmati! 🚀

Perlu bantuan? Baca README.md untuk dokumentasi lengkap.
