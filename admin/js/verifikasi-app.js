function verifApp() { 
    return { 
        sidebarOpen: false, 
        previewOpen: false,
        selectedUser: null,
        filterType: 'All',
        users: [
            { id: '9021', name: 'Bambang Subroto', nik: '3201928374920001', type: 'UMKM', date: 'Hari ini', status: 'Tertunda' },
            { id: '9022', name: 'Siti Aminah', nik: '3201928374920002', type: 'Investor', date: 'Kemarin', status: 'Tertunda' },
            { id: '9023', name: 'Koperasi Rejo Jaya', nik: 'Badan Usaha', type: 'UMKM', date: '2 Hari Lalu', status: 'Disetujui' },
            { id: '9024', name: 'Anton Wijaya', nik: '3201928374920004', type: 'Investor', date: '3 Hari Lalu', status: 'Ditolak' },
        ],
        get filteredUsers() {
            if (this.filterType === 'All') return this.users;
            return this.users.filter(u => u.type === this.filterType);
        },
        openModal(u) {
            this.selectedUser = u;
            this.previewOpen = true;
        },
        act(id, actionCode) {
            let user = this.users.find(x => x.id === id);
            if (!user) return;
            user.status = actionCode === 'Approve' ? 'Disetujui' : 'Ditolak';
            
            if (actionCode === 'Approve') {
                window.notif('Berkas Valid', 'Pengguna ' + user.name + ' telah diverifikasi dan aktif.', 'success');
            } else {
                window.notif('Aplikasi Ditolak', 'Pengguna dialihkan ke status spam/invalid.', 'error');
            }
        },
        initApp() { 
            setTimeout(() => { if(window.lucide) lucide.createIcons(); }, 100); 
        } 
    } 
}