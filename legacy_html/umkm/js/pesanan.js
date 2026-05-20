function pesananApp() {
            return {
                sidebarOpen: false,
                data: [
                    { id: 'TRX-8291A', status: 'Baru', time: 'Hari ini, 10:24', buyer: 'Rahmat H.', item: '2x Biji Kopi Arabica Premium (Roast)', price: '130.000' },
                    { id: 'TRX-8100C', status: 'Dikemas', time: 'Kemarin, 14:10', buyer: 'Lisa K.', item: '1x Gula Aren Cair 500ml', price: '45.000' }
                ],
                get masukCount() { return this.data.filter(x => x.status === 'Baru').length; },
                initApp() { setTimeout(() => lucide.createIcons(), 100); },
                acc(id) { let target = this.data.find(d => d.id === id); if(target) target.status = 'Dikemas'; },
                ship(id) { let target = this.data.find(d => d.id === id); if(target) target.status = 'Dikirim'; }
            }
        }