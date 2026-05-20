const fs = require('fs');
const path = require('path');

const dir = 'd:/data/koneksidesa/admin';
const jsDir = path.join(dir, 'js');

// --- 1. PENGATURAN PETA ---
const petaHTML = `
                <div class="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
                    <!-- Toolbar Kiri -->
                    <div class="w-full lg:w-80 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                        <div class="p-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 class="font-bold text-slate-800">Manajemen Wilayah</h2>
                            <p class="text-[10px] text-slate-500 mt-1 uppercase">Kec. Subur, Desa Makmur Raya</p>
                        </div>
                        <div class="p-4 border-b border-slate-100">
                            <div class="relative">
                                <i data-lucide="search" class="absolute left-3 top-2.5 w-4 h-4 text-slate-400"></i>
                                <input type="text" placeholder="Cari titik kordinat..." class="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-sm outline-none focus:border-blue-500">
                            </div>
                        </div>
                        <div class="flex-1 overflow-y-auto p-4 space-y-4">
                            <div>
                                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Filter Tampilan Map</p>
                                <label class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"><input type="checkbox" checked class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"><span class="text-sm font-bold text-slate-700">Kios UMKM Aktif <span class="bg-blue-100 text-blue-700 text-[10px] px-1.5 rounded ml-2">42</span></span></label>
                                <label class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"><input type="checkbox" checked class="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"><span class="text-sm font-bold text-slate-700">Lahan Pendanaan <span class="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 rounded ml-2">12</span></span></label>
                                <label class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"><input type="checkbox" class="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"><span class="text-sm font-bold text-slate-700">Infrastruktur Desa</span></label>
                            </div>
                            <hr class="border-slate-100">
                            <div>
                                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Wilayah Terdaftar</p>
                                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-2 border-l-2 border-l-blue-500 cursor-pointer">
                                    <h4 class="text-sm font-bold text-slate-800">Dusun Karangsari</h4>
                                    <p class="text-xs text-slate-500">12 UMKM • Koordinat -7.21, 110.3</p>
                                </div>
                                <div class="bg-white p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                                    <h4 class="text-sm font-bold text-slate-800">Dusun Rejoagung</h4>
                                    <p class="text-xs text-slate-500">30 UMKM • Koordinat -7.24, 110.4</p>
                                </div>
                            </div>
                        </div>
                        <div class="p-4 border-t border-slate-100 bg-slate-50">
                            <button onclick="window.notif('Sistem Terkunci', 'Gunakan API Google Maps berbayar untuk opsi modifikasi poligon.', 'error')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-sm transition">Tambah Titik Baru</button>
                        </div>
                    </div>
                    
                    <!-- Area Peta Satelit -->
                    <div class="flex-1 bg-slate-200 rounded-2xl border border-slate-300 shadow-inner relative overflow-hidden group group-hover:scale-105">
                        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80" class="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110">
                        <!-- Map Overlay Frame -->
                        <div class="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
                        
                        <!-- Map Markers Dummy -->
                        <div class="absolute top-[30%] left-[40%] flex flex-col items-center group/marker cursor-pointer" onclick="window.notif('Info Peta', 'Koperasi Tani Rejo (-7.21, 110.3)', 'info')">
                            <div class="bg-white text-slate-800 text-[10px] font-bold px-2 py-1 rounded shadow-lg mb-1 opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap">Koperasi Tani Rejo</div>
                            <div class="w-5 h-5 bg-blue-500 border-2 border-white rounded-full shadow-lg relative"><div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50"></div></div>
                        </div>
                        
                        <div class="absolute top-[50%] left-[60%] flex flex-col items-center group/marker cursor-pointer" onclick="window.notif('Info Peta', 'Ekspansi Lahan Kopi (-7.24, 110.4)', 'info')">
                            <div class="bg-white text-slate-800 text-[10px] font-bold px-2 py-1 rounded shadow-lg mb-1 opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap">Ekspansi Lahan Kopi</div>
                            <div class="w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-lg relative"></div>
                        </div>

                        <!-- Zoom Controls -->
                        <div class="absolute bottom-6 right-6 flex flex-col gap-2 bg-white p-1 rounded-xl shadow-xl border border-slate-200">
                            <button class="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition"><i data-lucide="plus" class="w-5 h-5"></i></button>
                            <div class="w-full h-px bg-slate-200"></div>
                            <button class="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition"><i data-lucide="minus" class="w-5 h-5"></i></button>
                        </div>
                    </div>
                </div>
`;

// --- 2. MANAJEMEN PENGGUNA ---
const penggunaHTML = `
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                        <div class="flex items-center gap-3">
                            <i data-lucide="users" class="w-5 h-5 text-blue-500"></i>
                            <h2 class="font-bold text-slate-800">Daftar Pengguna Sistem</h2>
                        </div>
                        <div class="flex items-center gap-3 w-full sm:w-auto">
                            <div class="relative w-full sm:w-56">
                                <i data-lucide="search" class="absolute left-3 top-2.5 w-4 h-4 text-slate-400"></i>
                                <input type="text" x-model="searchKey" placeholder="Cari ID, Nama..." class="w-full bg-white border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-sm outline-none focus:border-blue-500">
                            </div>
                            <button class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition"><i data-lucide="download" class="w-5 h-5"></i></button>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm whitespace-nowrap">
                            <thead class="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th class="px-6 py-4">Nama Pengguna</th>
                                    <th class="px-6 py-4 border-l border-slate-100">Role Kategori</th>
                                    <th class="px-6 py-4 border-l border-slate-100">Login Terakhir</th>
                                    <th class="px-6 py-4 border-l border-slate-100">Status Akun</th>
                                    <th class="px-6 py-4 border-l border-slate-100 text-right">Opsi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <template x-for="u in list.filter(x => x.name.toLowerCase().includes(searchKey.toLowerCase()))" :key="u.id">
                                    <tr class="hover:bg-slate-50/50 transition truncate">
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-slate-700" :class="u.status==='Banned' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200'" x-text="u.name.substring(0,1)"></div>
                                                <div>
                                                    <p class="font-bold text-slate-900" x-text="u.name"></p>
                                                    <p class="text-[10px] text-slate-500 mt-0.5" x-text="u.email"></p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 border-l border-slate-100">
                                            <span class="px-2 py-1 rounded text-xs font-bold" :class="u.role === 'Admin' ? 'bg-blue-100 text-blue-700' : (u.role === 'UMKM' ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700')" x-text="u.role"></span>
                                        </td>
                                        <td class="px-6 py-4 border-l border-slate-100 text-slate-600" x-text="u.lastLogin"></td>
                                        <td class="px-6 py-4 border-l border-slate-100">
                                            <div class="flex items-center gap-2">
                                                <div class="w-2 h-2 rounded-full" :class="u.status === 'Aktif' ? 'bg-emerald-500' : (u.status==='Suspend' ? 'bg-amber-500' : 'bg-rose-500')"></div>
                                                <span class="font-bold text-slate-700 text-xs" x-text="u.status"></span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 border-l border-slate-100 text-right">
                                            <button @click="suspendUser(u)" x-show="u.status === 'Aktif'" class="text-amber-600 hover:bg-amber-50 p-2 rounded-lg font-bold text-xs border border-transparent transition" title="Tangguhkan Akses">Suspend</button>
                                            <button @click="blockUser(u)" x-show="u.status !== 'Banned' && u.role !== 'Admin'" class="text-rose-600 hover:bg-rose-50 p-2 rounded-lg font-bold text-xs border border-transparent transition" title="Blokir Permanen">Blokir</button>
                                            <button @click="activateUser(u)" x-show="u.status !== 'Aktif'" class="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg font-bold text-xs border border-transparent transition" title="Pulihkan Akses">Pulihkan</button>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
`;

// --- 3. MODERASI KONTEN ---
const moderasiHTML = `
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-xl font-bold text-slate-800">Laporan Pelanggaran Komunitas</h2>
                    <span class="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">4 Laporan Butuh Tindakan</span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <template x-for="m in list" :key="m.id">
                        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col fade-in">
                            <div class="h-40 bg-slate-100 relative group overflow-hidden">
                                <img :src="m.img" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 filter group-hover:brightness-90">
                                <div class="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 text-white text-[10px] font-bold rounded backdrop-blur border border-white/20 uppercase tracking-widest" x-text="m.category"></div>
                            </div>
                            <div class="p-5 flex-1 flex flex-col">
                                <div class="flex items-center gap-2 mb-3">
                                    <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-500"></i>
                                    <p class="text-xs font-bold text-rose-500 uppercase tracking-wider" x-text="m.reason"></p>
                                </div>
                                <h3 class="font-bold text-slate-900 text-lg mb-1" x-text="m.title"></h3>
                                <p class="text-xs text-slate-500 mb-4" x-text="'Dilaporkan oleh: ' + m.reporter"></p>
                                
                                <div class="mt-auto grid grid-cols-2 gap-2">
                                    <button @click="ignore(m.id)" class="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">Abaikan (Aman)</button>
                                    <button @click="takedown(m.id)" class="py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-500 hover:text-white text-rose-600 text-xs font-bold rounded-xl shadow-sm transition">Takedown Item</button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div x-show="list.length === 0" class="col-span-full py-20 text-center">
                        <i data-lucide="check-square" class="w-16 h-16 text-emerald-400 mx-auto mb-4"></i>
                        <h3 class="text-xl font-bold text-slate-800">Platform Steril Bebas Pelanggaran</h3>
                        <p class="text-slate-500 text-sm">Tidak ada komoditas UMKM atau komentar yang dilaporkan oleh warga/pembeli.</p>
                    </div>
                </div>
`;

// Helper Function
function replaceHtmlContent(filepath, innerHTML) {
    let p = path.join(dir, filepath);
    if(fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        content = content.replace(/<div class="bg-white p-8 rounded-2xl border border-slate-200 text-center">[\s\S]*?<\/div>/, innerHTML);
        fs.writeFileSync(p, content);
    }
}

replaceHtmlContent('peta.html', petaHTML);
replaceHtmlContent('pengguna.html', penggunaHTML);
replaceHtmlContent('moderasi.html', moderasiHTML);

// Set JS content
const jsLogic = {
    'peta-app.js': `function petaApp() { return { sidebarOpen: false, initApp() { setTimeout(() => { if(window.lucide) lucide.createIcons(); }, 100); } } }`,
    'pengguna-app.js': `function usersApp() { 
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
    }`,
    'moderasi-app.js': `function modApp() {
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
    }`
};

for(let f in jsLogic) {
    fs.writeFileSync(path.join(jsDir, f), jsLogic[f]);
}
console.log('Dummy injected in Peta, Pengguna, Moderasi');
