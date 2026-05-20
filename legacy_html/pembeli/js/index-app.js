function indexApp() { 
            return { 
                profileOpen: false, 
                products: [
                    {id: 1, title: 'Beras Pandan Wangi Pulen 5KG Asli', store: 'Koperasi Tani Rejo', price: 'Rp 65.000', sold: '1.2k', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80'},
                    {id: 2, title: 'Sayur Sawi Hijau Hidroponik Non-Pestisida', store: 'Kebun Vertikal Pak Slamet', price: 'Rp 4.500', sold: '542', img: 'https://images.unsplash.com/photo-1579213155728-4bd7eaf2df1c?w=500&q=80'},
                    {id: 3, title: 'Kopi Bubuk Murni Robusta Asli Desa', store: 'Kopi Sumber Rejeki', price: 'Rp 25.000', sold: '3.4k', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&q=80'},
                    {id: 4, title: 'Keripik Pisang Keju Lumer Homemade', store: 'Dapur Bunda Siti', price: 'Rp 15.000', sold: '890', img: 'https://images.unsplash.com/photo-1621213000624-ad818b2c554e?w=500&q=80'},
                    {id: 5, title: 'Kursi Anyaman Rotan Minimalis', store: 'Estetika Bambu Jepara', price: 'Rp 145.000', sold: '124', img: 'https://images.unsplash.com/photo-1506439064718-d0ad3ce0443a?w=500&q=80'}
                ],
                initApp() { setTimeout(() => { if(window.lucide) lucide.createIcons(); }, 100); } 
            } 
        }