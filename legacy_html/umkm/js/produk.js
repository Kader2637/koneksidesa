function produkApp() {
            return {
                sidebarOpen: false, showAdd: false, search: '',
                items: [
                    { id: '110A', name: 'Biji Kopi Robusta Mentah 1Kg', cat: 'Agrikultur', price: '65.000', stock: 120, img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80' },
                    { id: '110B', name: 'Gula Aren Cair Kemasan 500ml', cat: 'Konsumsi', price: '45.000', stock: 8, img: 'https://images.unsplash.com/photo-1620853503254-8c01bc954ff4?w=200&q=80' },
                    { id: '110C', name: 'Pot Tanah Liat Ulir Tradisional', cat: 'Kriya', price: '85.000', stock: 35, img: 'https://images.unsplash.com/photo-1629881657876-b6fb1a6a58bc?w=200&q=80' },
                ],
                get filteredList() {
                    return this.items.filter(i => i.name.toLowerCase().includes(this.search.toLowerCase()));
                },
                initApp() { setTimeout(() => lucide.createIcons(), 100); },
                del(id) { if(confirm('Yakin ingin menghapus produk ini secara permanen dari etalase?')) { this.items = this.items.filter(i => i.id !== id); } }
            }
        }