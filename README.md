# 🌿 KoneksiDesa - Marketplace UMKM & Hasil Desa

KoneksiDesa adalah platform marketplace modern yang dirancang untuk menjembatani produk unggulan desa (pertanian, buah-buahan, dan kerajinan tangan) langsung ke konsumen. Platform ini mengintegrasikan teknologi **AI Rekomendasi**, **Peta UMKM Terintegrasi**, dan **Sistem Lacak Logistik** yang transparan.

![KoneksiDesa Banner](https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80)

---

## ✨ Fitur Unggulan

* **🛍️ Marketplace Hasil Bumi:** Belanja sayur segar, buah-buahan, dan kerajinan asli desa dengan antarmuka yang bersih.
* **🤖 AI Rekomendasi:** Fitur cerdas yang menyarankan produk berdasarkan preferensi dan musim panen di desa.
* **📍 Peta UMKM COD:** Visualisasi lokasi mitra UMKM untuk memudahkan sistem belanja bayar di tempat (COD).
* **🚚 Lacak Logistik:** Pantau pergerakan paket Anda dari gudang desa hingga ke depan pintu rumah secara real-time.
* **💬 Chat Real-time:** Berkomunikasi langsung dengan petani atau pengrajin desa untuk memastikan kualitas produk.
* **🛒 Keranjang Dinamis:** Perhitungan total belanja otomatis dengan sistem tooltip saldo yang interaktif.

---

## 🛠️ Teknologi yang Digunakan

* **HTML5 & Tailwind CSS:** Untuk struktur dan desain responsif yang modern.
* **Alpine.js:** Digunakan untuk logika interaktif (Dropdown profil, Modal pencarian, Tooltip saldo, dan State navigasi).
* **Lucide Icons:** Ikon vektor yang ringan dan konsisten di seluruh aplikasi.
* **Google Fonts:** Menggunakan font 'Heading' dan 'Body' yang mudah dibaca dan elegan.

---

## 🚀 Cara Menjalankan Projek

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/username/koneksidesa.git](https://github.com/username/koneksidesa.git)
    ```
2.  **Masuk ke direktori projek:**
    ```bash
    cd koneksidesa
    ```
3.  **Jalankan file index:**
    Buka file `index.html` menggunakan browser favorit Anda, atau gunakan ekstensi **Live Server** di VS Code untuk pengalaman pengembangan terbaik.

---

## 📱 Pratinjau Tampilan

### Header Responsif
Header kami mendukung tampilan desktop dengan saldo penuh, dan tampilan mobile yang minimalis dengan **Tooltip Saldo** otomatis saat ikon keranjang di-hover.

### Navigasi Pintar
Sistem navigasi bawah (`Bottom Nav`) dilengkapi dengan logika `isActive` yang secara otomatis memberikan highlight (warna emerald & border-bottom) pada halaman yang sedang dibuka.

---

## 📂 Struktur Folder

```text
koneksidesa/
├── assets/           # Gambar, Ikon, dan Media
├── css/              # File Tailwind CSS / Stylesheet
├── js/               # Logika JavaScript & Alpine.js
├── pages/            # Halaman (rekomendasi, peta, lacak, dll)
└── index.html        # Halaman Utama Marketplace