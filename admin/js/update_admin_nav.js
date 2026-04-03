const fs = require('fs');
const path = require('path');

const dir = 'd:/data/koneksidesa/admin';
const jsDir = path.join(dir, 'js');

const newSidebar = `
    <aside class="fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0f172a] text-slate-400 flex flex-col transition-transform duration-300 shadow-2xl lg:shadow-none border-r border-slate-800" :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'">
        <div class="h-16 flex items-center px-6 bg-[#0b1120] border-b border-slate-800 font-heading font-bold text-xl text-white tracking-tight">Koneksi<span class="text-blue-500">Desa</span> <span class="ml-2 text-[10px] bg-blue-900/50 text-blue-400 px-2 rounded uppercase tracking-widest font-sans border border-blue-800">Admin</span></div>
        
        <div class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <p class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 mt-2">Sistem Pusat</p>
            <a href="index.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_INDEX"><i data-lucide="layout-dashboard" class="w-5 h-5"></i> Dashboard Statistik</a>
            <a href="peta.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_PETA"><i data-lucide="map" class="w-5 h-5"></i> Pengaturan Peta</a>
            
            <p class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 mt-6">Moderasi & Valuasi</p>
            <a href="verifikasi.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_VERIF"><i data-lucide="user-check" class="w-5 h-5"></i> Panel Verifikasi Akun</a>
            <a href="pengguna.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_USERS"><i data-lucide="users" class="w-5 h-5"></i> Manajemen Pengguna</a>
            <a href="moderasi.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_MOD"><i data-lucide="shield-alert" class="w-5 h-5"></i> Moderasi Produk</a>
            
            <p class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 mt-6">Keuangan & Cs</p>
            <a href="pantau-dana.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_DANA"><i data-lucide="line-chart" class="w-5 h-5"></i> Pantauan Pendanaan</a>
            <a href="laba.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_LABA"><i data-lucide="wallet" class="w-5 h-5"></i> Laporan Keuangan</a>
            <a href="laporan.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_LAPOR"><i data-lucide="ticket" class="w-5 h-5"></i> Pusat Keluhan (Tiket)</a>
        </div>

        <div class="p-4 border-t border-slate-800">
            <a href="../index.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-rose-500 font-bold transition w-full"><i data-lucide="log-out" class="w-5 h-5"></i> Keluar Sistem</a>
        </div>
    </aside>
`;

const activeClass = 'bg-blue-600 shadow-md shadow-blue-500/20 text-white font-bold border border-blue-500';
const idleClass = 'hover:bg-slate-800 hover:text-slate-200 font-medium';
const pageFlags = ['PAGE_INDEX', 'PAGE_PETA', 'PAGE_VERIF', 'PAGE_USERS', 'PAGE_MOD', 'PAGE_DANA', 'PAGE_LABA', 'PAGE_LAPOR'];

const filesToUpdate = [
    {file: 'index.html', flag: 'PAGE_INDEX'},
    {file: 'verifikasi.html', flag: 'PAGE_VERIF'},
    {file: 'pantau-dana.html', flag: 'PAGE_DANA'},
    {file: 'laba.html', flag: 'PAGE_LABA'},
    {file: 'laporan.html', flag: 'PAGE_LAPOR'}
];

for(let f of filesToUpdate) {
    if(!fs.existsSync(path.join(dir, f.file))) continue;
    let content = fs.readFileSync(path.join(dir, f.file), 'utf8');
    content = content.replace(/<aside[\s\S]*?<\/aside>/, newSidebar.trim());
    for(let flag of pageFlags) {
        if(flag === f.flag) content = content.replace(flag, activeClass);
        else content = content.replace(flag, idleClass);
    }
    fs.writeFileSync(path.join(dir, f.file), content);
}

const rawWrapperTemplate = `<!DOCTYPE html>
<html lang="id" class="bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TITLE - Fasilitator Pusat</title>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
    <script src="js/tailwind-config.js"></script>
    <style> [x-cloak] { display: none !important; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; } </style>
</head>
<body class="text-slate-800 font-sans antialiased overflow-hidden h-screen flex" x-data="MENUAPP()" x-init="initApp()">

    <div class="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" x-show="sidebarOpen" x-transition.opacity @click="sidebarOpen = false" x-cloak></div>
    
    ${newSidebar.trim()}

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0 shadow-sm relative">
            <div class="absolute inset-0 bg-blue-500 h-1"></div>
            <div class="flex items-center gap-4">
                <button @click="sidebarOpen = true" class="lg:hidden text-slate-500 hover:text-blue-600"><i data-lucide="menu" class="w-5 h-5"></i></button>
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><i data-lucide="shield-check" class="w-4 h-4"></i></div>
                    <h1 class="text-xl font-heading font-bold text-slate-900 hidden sm:block">Panel Pengelola Data</h1>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <button onclick="window.notif('Server Siaga', 'Pusat sistem desa online.')" class="p-2 text-slate-400 hover:text-blue-600 transition"><i data-lucide="bell" class="w-5 h-5"></i></button>
                <div class="w-px h-6 bg-slate-200"></div>
                <div class="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 pr-3 rounded-full border border-transparent hover:border-slate-200 transition">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" class="w-8 h-8 rounded-full object-cover">
                    <span class="text-sm font-bold text-slate-700 hidden sm:block w-32 truncate">Sudarman (Fasilitator)</span>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto bg-[#f8fafc] p-4 md:p-8">
            <div class="max-w-7xl mx-auto space-y-6">
                <div class="bg-white p-8 rounded-2xl border border-slate-200 text-center"><h2 class="text-2xl font-bold mb-4">TITLE</h2></div>
            </div>
        </main>
    </div>

    <!-- Global JS and Toast -->
    <div x-data="{ toasts: [] }" @show-toast.window="let id = Date.now(); toasts.push({id, ...$event.detail}); setTimeout(() => { toasts = toasts.filter(t => t.id !== id) }, 6000)" class="fixed bottom-4 right-4 z-[999] flex flex-col gap-2 pointer-events-none">
        <template x-for="t in toasts" :key="t.id">
            <div x-show="true" x-transition.opacity.translate.y.50px class="bg-white border-l-4 shadow-xl rounded-r-2xl p-4 w-72 sm:w-80 flex gap-3 pointer-events-auto transform transition-all hover:bg-slate-50 relative overflow-hidden group" :class="t.type === 'error' ? 'border-rose-500' : 'border-blue-500'">
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-slate-900 truncate pr-6" x-text="t.title"></p>
                    <p class="text-xs text-slate-600 line-clamp-2 mt-0.5" x-text="t.text"></p>
                </div>
                <button @click="toasts = toasts.filter(x => x.id !== t.id)" class="text-slate-300 hover:text-rose-500 focus:outline-none transition absolute top-4 right-3 bg-white pl-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
        </template>
    </div>
    <script src="js/global.js"></script>
    <script src="js/SCRIPTPREFIX-app.js"></script>
</body>
</html>`;

const newFiles = [
    {file: 'peta.html', title: 'Pengaturan Peta & Wilayah', app: 'petaApp', flag: 'PAGE_PETA'},
    {file: 'pengguna.html', title: 'Manajemen Pengguna Terdaftar', app: 'usersApp', flag: 'PAGE_USERS'},
    {file: 'moderasi.html', title: 'Moderasi Konten & Produk', app: 'modApp', flag: 'PAGE_MOD'}
];

for(let nf of newFiles) {
    let content = rawWrapperTemplate.replace(/TITLE/g, nf.title).replace('MENUAPP', nf.app).replace('SCRIPTPREFIX', nf.file.split('.')[0]);
    
    for(let flag of pageFlags) {
        if(flag === nf.flag) content = content.replace(flag, activeClass);
        else content = content.replace(flag, idleClass);
    }
    fs.writeFileSync(path.join(dir, nf.file), content);
    
    let jsCode = `function ${nf.app}() { return { sidebarOpen: false, initApp() { setTimeout(() => { if(window.lucide) lucide.createIcons(); }, 100); } } }`;
    fs.writeFileSync(path.join(dir, 'js', nf.file.replace('.html', '-app.js')), jsCode);
}

console.log('Nav updated and new files scaffolded!');
