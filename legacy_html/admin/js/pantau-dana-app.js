function danaApp() { 
    return { 
        sidebarOpen: false, 
        fundingList: [
            { id: 'PRJ-1029', title: 'Ekspansi Lahan Tani Kopi', target: 'Rp 150.000.000', current: 'Rp 150.000.000', percent: 100, released: false },
            { id: 'PRJ-2031', title: 'Mesin Giling Padi Modern', target: 'Rp 85.000.000', current: 'Rp 42.500.000', percent: 50, released: false },
            { id: 'PRJ-0982', title: 'Pengadaan Bibit Jagung Bisi', target: 'Rp 20.000.000', current: 'Rp 20.000.000', percent: 100, released: true },
            { id: 'PRJ-3044', title: 'Sistem Irigasi Tetes', target: 'Rp 50.000.000', current: 'Rp 5.000.000', percent: 10, released: false }
        ],
        releaseFunds(p) {
            if(confirm('Peringatan: Dana Escrow Rp ' + p.current + ' akan diteruskan rekening bank UMKM pembuat proposal. Lanjutkan?')) {
                p.released = true;
                window.notif('Pencairan Sukses', 'Dana untuk ' + p.title + ' berhasil disalurkan ke rekening UMKM pendaftar.', 'success');
            }
        },
        initApp() { 
            setTimeout(() => { if(window.lucide) lucide.createIcons(); }, 100); 
        } 
    } 
}