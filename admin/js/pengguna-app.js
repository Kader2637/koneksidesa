function usersApp() { 
        return { 
            sidebarOpen: false, searchKey: '',
            list: [
                { id: '1', name: 'Sudarman', email: 'sudarman@admin.desa.id', role: 'Admin', lastLogin: 'Baru saja', status: 'Aktif' },
                { id: '2', name: 'Bambang Subroto', email: 'bambang@gmail.com', role: 'UMKM', lastLogin: '2 Jam lalu', status: 'Aktif' },
                { id: '3', name: 'Siti Aminah', email: 'amina_sweet@yahoo.com', role: 'Pembeli', lastLogin: '1 Hari lalu', status: 'Aktif' },
                { id: '4', name: 'Hadi Prabowo', email: 'prabowo.invest@corp.id', role: 'Investor', lastLogin: '5 Hari lalu', status: 'Suspend' },
                { id: '5', name: 'Spammer_JKT48', email: 'jkto@gmail.com', role: 'Pembeli', lastLogin: 'Tahun lalu', status: 'Banned' }
            ],
            suspendUser(u) { if(confirm('Tangguhkan akses ' + u.name + '?')) { u.status = 'Suspend'; window.notif('Tindakan', u.name + ' ditangguhkan.', 'error'); } },
            blockUser(u) { if(confirm('Blokir permanen ' + u.name + '?')) { u.status = 'Banned'; window.notif('Tindakan', u.name + ' diblokir permanen.', 'error'); } },
            activateUser(u) { u.status = 'Aktif'; window.notif('Pemulihan', u.name + ' berhasil aktif kembali.', 'success'); },
            initApp() { setTimeout(() => { if(window.lucide) lucide.createIcons(); }, 100); } 
        } 
    }