
function katApp() {
    return {
        sidebarOpen: false,
        payModal: false,
        activeProposal: {},
        lotCount: 1,
        lotPrice: 1000000,
        list: [
            { id: 1, name: 'Pertanian Cabai Rawit Merah Berbasis Hidroponik', desc: 'Sistem panen 3 kali sebulan menekan angka kerugian.', target: 'Rp 45.000.000', roi: '15-20% YoY', sektor: 'Agraria', img: 'https://images.unsplash.com/photo-1599813295846-996ff762142f?w=500&q=80', rating: 'A' },
            { id: 2, name: 'Ternak Bebek Petelur Skala Ekspor', desc: 'Produksi telur asin oven, butuh modal rantai dingin logistik.', target: 'Rp 110.000.000', roi: '11-14% YoY', sektor: 'Peternakan', img: 'https://images.unsplash.com/photo-1558712739-166297316bbd?w=500&q=80', rating: 'B+' },
            { id: 3, name: 'Sewa Alat Berat Pemanen Padi (Harvester)', desc: 'Skema penyewaan alat berat memotong ongkos petani.', target: 'Rp 350.000.000', roi: '22% YoY', sektor: 'Mesin Tani', img: 'https://images.unsplash.com/photo-1627447781072-d5cbbfc9007f?w=500&q=80', rating: 'AA' },
            { id: 4, name: 'Koperasi Kerajinan Bambu Rotan', desc: 'Rotan jepara meja makan ukir butuh alat otomatis.', target: 'Rp 65.000.000', roi: '14% YoY', sektor: 'Kriya Mebel', img: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=500&q=80', rating: 'A-' }
        ],
        openInvest(p) {
            this.activeProposal = p;
            this.lotCount = 1; // Reset everytime
            this.payModal = true;
        },
        processPayment() {
            this.payModal = false;
            let tot = (this.lotCount * this.lotPrice).toLocaleString('id-ID');
            window.notif('Pembelian Ekuitas Sukses!', 'Rp '+tot+' ditransfer. Menunggu UMKM mencapai target funding.', 'success');
        },
        initApp() { setTimeout(() => { if(window.lucide) lucide.createIcons(); }, 100); }
    }
}
