function modApp() {
        return {
            sidebarOpen: false,
            list: [
                { id: 1, title: 'Obat Kuat Mujarab Ilegal', reason: 'Produk Terlarang / Ilegal', category: 'Produk', reporter: '3 Laporan Anonim', img: 'https://images.unsplash.com/photo-1584308666744-24d5e1628d05?w=500&q=80' },
                { id: 2, title: '"UMKM ini nipu uang saya hilang!"', reason: 'Ujaran Kebencian / Fitnah', category: 'Komentar', reporter: 'Hadi Prabowo', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80' },
                { id: 3, title: 'Foto Profil Tidak Beli', reason: 'Gambar Mengandung SARA', category: 'Konten Profil', reporter: 'Sistem Deteksi AI', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80' }
            ],
            ignore(id) { this.list = this.list.filter(l => l.id !== id); window.notif('Laporan Diabaikan', 'Konten dianggap aman secara manual.'); },
            takedown(id) { this.list = this.list.filter(l => l.id !== id); window.notif('Konten Dihapus', 'Takedown konten pelanggaran berhasil dieksekusi.', 'success'); },
            initApp() { setTimeout(() => { if(window.lucide) lucide.createIcons(); }, 100); }
        }
    }