# Resume Analyzer

Analisis resume/CV secara otomatis menggunakan AI. Dapatkan **ATS compatibility score**, review per-section, analisis keyword, saran rewrite, dan job matching — semuanya dalam hitungan detik.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-orange)

---

## ✨ Fitur

- **📊 ATS Score** — Skor kompatibilitas ATS 0-100 dengan breakdown 6 kategori
- **📝 Section Analysis** — Review detail per section (Summary, Experience, Education, Skills) dengan rating *strong / moderate / weak*
- **🔑 Keyword Analysis** — Daftar keyword yang ditemukan vs yang kurang di resume
- **✏️ Rewrite Suggestions** — Saran perbaikan teks dengan perbandingan *sebelum vs sesudah*
- **🎯 Job Matching** *(opsional)* — Masukkan job title / job description untuk analisis kecocokan dan skill gap
- **📄 Export** — Print / save hasil analisis sebagai PDF
- **🌓 Dark Mode** — Toggle light/dark theme
- **📱 Responsive** — Tampilan optimal di desktop dan mobile

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| AI Provider | [Groq](https://groq.com) (LLaMA 3.3 70B / LLaMA 3.1 8B fallback) |
| PDF Parsing | [pdf-parse](https://www.npmjs.com/package/pdf-parse) |
| DOCX Parsing | [mammoth](https://www.npmjs.com/package/mammoth) |
| Styling | Vanilla CSS (design system editorial) |
| Font | Playfair Display · IBM Plex Mono · Inter |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io) (recommended) atau npm/yarn
- Groq API Key — gratis di [console.groq.com/keys](https://console.groq.com/keys)

### Instalasi

```bash
# Clone repository
git clone https://github.com/username/resume-analyzer.git
cd resume-analyzer

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
```

### Konfigurasi

Buat file `.env.local` di root project:

```env
# Dapatkan API key gratis di https://console.groq.com/keys
GROQ_API_KEY=your_groq_api_key_here
```

> ⚠️ **Jangan pernah commit file `.env.local` ke Git.** File ini sudah di-exclude di `.gitignore`.

### Menjalankan

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📖 Cara Penggunaan

1. **Upload resume** — Drag & drop atau klik untuk pilih file (PDF / DOCX, maks 5MB)
2. **Preview** — Cek teks yang berhasil diekstrak dari file
3. **Job Matching** *(opsional)* — Masukkan job title dan/atau job description
4. **Analisis** — Klik "Analisis Resume" dan tunggu beberapa detik
5. **Hasil** — Lihat skor ATS, review per-section, keyword, saran rewrite, dan job match
6. **Export** — Print atau save sebagai PDF, atau copy saran rewrite

## 📁 Struktur Project

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts    # API: analisis resume via Groq AI
│   │   └── parse/route.ts      # API: parsing PDF/DOCX ke teks
│   ├── globals.css             # Design system & semua styling
│   ├── layout.tsx              # Root layout + metadata
│   └── page.tsx                # Halaman utama (state machine)
├── components/
│   ├── LoadingState.tsx         # Animasi loading dengan progress stages
│   ├── Masthead.tsx             # Header dengan logo, tanggal, theme toggle
│   ├── ResultsDisplay.tsx       # Tampilan hasil analisis (tabbed sections)
│   ├── ThemeProvider.tsx        # Context provider dark/light mode
│   ├── Toast.tsx                # Notifikasi toast
│   └── UploadZone.tsx           # Drag & drop upload area
└── lib/
    ├── groq.ts                  # Groq AI integration & prompt engineering
    ├── report.ts                # HTML report generator untuk export/print
    └── types.ts                 # TypeScript type definitions
```

## 🤖 AI Model

Menggunakan **Groq** sebagai AI provider dengan fallback chain:

1. **LLaMA 3.3 70B Versatile** — Model utama, hasil paling detail
2. **LLaMA 3.1 8B Instant** — Fallback jika model utama rate-limited

Semua analisis ditulis dalam **Bahasa Indonesia** dengan gaya editorial.

## 🔒 Keamanan & Privasi

- ❌ **Tidak ada data yang disimpan** — Resume diproses di memory dan langsung di-discard
- 🔐 **API key server-side** — Groq API key hanya diakses di server, tidak pernah ter-expose ke client
- 📏 **File size limit** — Maksimal 5MB untuk mencegah abuse
- 🔍 **Input validation** — Validasi tipe file dan ukuran di frontend dan backend

## 📄 License

MIT

---

<p align="center">
  <strong>Resume Analyzer</strong> — Powered by AI · No data stored
</p>
