const fs = require('fs');
const path = require('path');

const adminDir = 'd:/data/koneksidesa/admin';
const jsDir = path.join(adminDir, 'js');

if(!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, {recursive: true});
if(!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, {recursive: true});

const activeClass = 'bg-blue-600 shadow-md shadow-blue-500/20 text-white font-bold border border-blue-500';
const idleClass = 'hover:bg-slate-800 hover:text-slate-200 font-medium';

const baseHTML = `<!DOCTYPE html>
<html lang="id" class="bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TITLE - Fasilitator Pusat</title>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
    <script src="js/tailwind-config.js"></script>
    <style> [x-cloak] { display: none !important; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; } </style>
</head>
<body class="text-slate-800 font-sans antialiased overflow-hidden h-screen flex" x-data="MENUAPP()" x-init="initApp()">

    <div class="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" x-show="sidebarOpen" x-transition.opacity @click="sidebarOpen = false" x-cloak></div>
    
    <aside class="fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0f172a] text-slate-400 flex flex-col transition-transform duration-300 shadow-2xl lg:shadow-none border-r border-slate-800" :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'">
        <div class="h-16 flex items-center px-6 bg-[#0b1120] border-b border-slate-800 font-heading font-bold text-xl text-white tracking-tight">Koneksi<span class="text-blue-500">Desa</span> <span class="ml-2 text-[10px] bg-blue-900/50 text-blue-400 px-2 rounded uppercase tracking-widest font-sans border border-blue-800">Admin</span></div>
        
        <div class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <p class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 mt-2">Sistem Pusat</p>
            <a href="index.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_INDEX"><i data-lucide="layout-dashboard" class="w-5 h-5"></i> Overview Platform</a>
            
            <p class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 mt-6">Moderasi & Valuasi</p>
            <a href="verifikasi.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_VERIF"><i data-lucide="user-check" class="w-5 h-5"></i> Verifikasi Pengguna</a>
            <a href="pantau-dana.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_DANA"><i data-lucide="line-chart" class="w-5 h-5"></i> Pantauan Pendanaan</a>
            
            <p class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 mt-6">Keuangan & CS</p>
            <a href="laba.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_LABA"><i data-lucide="wallet" class="w-5 h-5"></i> Distribusi Laba & Fee</a>
            <a href="laporan.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition PAGE_LAPOR"><i data-lucide="ticket" class="w-5 h-5"></i> Pusat Keluhan (Tiket)</a>
        </div>

        <div class="p-4 border-t border-slate-800">
            <a href="../index.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-rose-500 font-bold transition w-full"><i data-lucide="log-out" class="w-5 h-5"></i> Keluar Sistem</a>
        </div>
    </aside>

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
CONTENT_PLACEHOLDER
            </div>
        </main>
    </div>

    <script src="js/global.js"></script>
    <script src="js/SCRIPTPREFIX-app.js"></script>
</body>
</html>`;

const baseContentIndex = `
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group">
                        <div class="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 relative"><i data-lucide="store" class="w-5 h-5"></i></div>
                        <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total UMKM Aktif</p>
                        <h3 class="text-3xl font-black text-slate-900">124 <span class="text-emerald-500 text-xs font-bold ml-1 relative -top-1.5"><i data-lucide="trending-up" class="w-3 h-3 inline"></i> 4</span></h3>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group">
                        <div class="absolute right-0 top-0 w-24 h-24 bg-violet-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <div class="w-10 h-10 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center mb-4 relative"><i data-lucide="briefcase" class="w-5 h-5"></i></div>
                        <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Investor Terverifikasi</p>
                        <h3 class="text-3xl font-black text-slate-900">42 <span class="text-emerald-500 text-xs font-bold ml-1 relative -top-1.5"><i data-lucide="trending-up" class="w-3 h-3 inline"></i> 1</span></h3>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group col-span-1 md:col-span-2">
                        <div class="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <div class="flex justify-between items-start relative">
                            <div>
                                <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4"><i data-lucide="arrow-up-right" class="w-5 h-5"></i></div>
                                <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Transaksi Selesai</p>
                                <h3 class="text-3xl font-black text-slate-900">Rp 480.5M</h3>
                            </div>
                            <div class="text-right">
                                <span class="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">+24% Bulan Ini</span>
                                <p class="text-xs text-slate-400 mt-2 font-medium">1,240 volume TRX</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="font-bold text-slate-900">Grafik Pendaftaran Pengguna</h3>
                            <select class="text-xs border border-slate-200 bg-slate-50 rounded px-2 py-1 outline-none font-medium"><option>Tahun ini</option></select>
                        </div>
                        <div class="h-[250px]"><canvas id="userChart"></canvas></div>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="font-bold text-slate-900">Aktivitas Sistem Terkini</h3>
                            <button class="text-xs font-bold text-blue-600 hover:text-blue-800">Lihat Semua</button>
                        </div>
                        <div class="space-y-4">
                            <div class="flex gap-4">
                                <div class="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 relative"><div class="absolute w-px h-10 bg-slate-200 left-1 top-3"></div></div>
                                <div><p class="text-sm font-bold text-slate-800">Proposal Cair <span class="bg-blue-100 text-blue-700 font-black text-[10px] px-1 rounded ml-1">Modal</span></p><p class="text-xs text-slate-500">150 Juta diturunkan ke Koperasi Tani Rejo.</p><span class="text-[10px] text-slate-400">15 Menit lalu</span></div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0 relative"><div class="absolute w-px h-10 bg-slate-200 left-1 top-3"></div></div>
                                <div><p class="text-sm font-bold text-slate-800">Tiket Keluhan Masuk <span class="bg-rose-100 text-rose-700 font-black text-[10px] px-1 rounded ml-1">Urgent</span></p><p class="text-xs text-slate-500">Kerja sama pengiriman ekspedisi terlambat.</p><span class="text-[10px] text-slate-400">1 Jam lalu</span></div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                                <div><p class="text-sm font-bold text-slate-800">Verifikasi Investor <span class="bg-slate-100 text-slate-600 font-black text-[10px] px-1 rounded ml-1">Sistem</span></p><p class="text-xs text-slate-500">Bapak Hadi Prabowo menunggu verifikasi KTP.</p><span class="text-[10px] text-slate-400">3 Jam lalu</span></div>
                            </div>
                        </div>
                    </div>
                </div>
`;

function generate(filename, title, appName, mappedHTML, cssIndexArr) {
    let raw = baseHTML;
    raw = raw.replace('TITLE', title);
    raw = raw.replace('MENUAPP', appName);
    raw = raw.replace('SCRIPTPREFIX', filename.split('.')[0]);
    raw = raw.replace('CONTENT_PLACEHOLDER', mappedHTML);
    
    // routing classes
    const pages = ['PAGE_INDEX', 'PAGE_VERIF', 'PAGE_DANA', 'PAGE_LABA', 'PAGE_LAPOR'];
    for(let i=0; i<5; i++) {
        if(cssIndexArr[i]) raw = raw.replace(pages[i], activeClass);
        else raw = raw.replace(pages[i], idleClass);
    }
    
    fs.writeFileSync(path.join(adminDir, filename), raw);
}

// Write Tailwind config globally
const twScript = `tailwind.config = { theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'], heading: ['Outfit', 'sans-serif'] }, colors: { brand: '#2563eb' } } } };`;
fs.writeFileSync(path.join(jsDir, 'tailwind-config.js'), twScript);

// Global Toast
const globalScript = `
    <!-- Global Toast Notif -->
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
`;
// Wait, we need to append global Toast HTML to the generated HTML!
// We'll just define the html in the html generator, and the JS inside global.js
const globalJs = `
window.notif = function(title, text, type='info') { window.dispatchEvent(new CustomEvent('show-toast', { detail: { title, text, type }})); };
document.addEventListener('DOMContentLoaded', () => { if(window.lucide) lucide.createIcons(); });
`;
fs.writeFileSync(path.join(jsDir, 'global.js'), globalJs);


function injectGlobalToastAndWrite(filename, title, appName, mappedHTML, cssArr) {
    let oldGen = generate.bind(null, filename, title, appName, mappedHTML, cssArr);
    
    generate(filename, title, appName, mappedHTML, cssArr);
    // read and inject
    let p = path.join(adminDir, filename);
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace('</body>', globalScript + '\n</body>');
    fs.writeFileSync(p, c);
}

// 1. Index
injectGlobalToastAndWrite('index.html', 'Overview Sistem', 'adminApp', baseContentIndex, [true, false, false, false, false]);
const indexApp = `
function adminApp() {
    return {
        sidebarOpen: false,
        initApp() {
            setTimeout(() => {
                const ctx = document.getElementById('userChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Jan','Feb','Mar','Apr'],
                        datasets: [{ label: 'UMKM Baru', data: [12, 19, 15, 24], borderColor: '#10b981', tension: 0.4 }, { label: 'Investor Baru', data: [2, 5, 4, 10], borderColor: '#6366f1', tension: 0.4 }]
                    },
                    options: { responsive:true, maintainAspectRatio:false, plugins: { legend: { position: 'bottom' } } }
                });
            }, 100);
        }
    }
}
`;
fs.writeFileSync(path.join(jsDir, 'index-app.js'), indexApp);

// Create stubs for others to prepare the framework
for(let file of [
    {n: 'verifikasi.html', t: 'Verifikasi Pengguna', css: [false,true,false,false,false], a: 'verifApp', inner: '<div class="bg-white p-8 rounded-2xl border border-slate-200 text-center"><h2 class="text-2xl font-bold mb-4">Sistem Verifikasi</h2></div>'},
    {n: 'pantau-dana.html', t: 'Pantau Pendanaan', css: [false,false,true,false,false], a: 'danaApp', inner: '<div class="bg-white p-8 rounded-2xl border border-slate-200 text-center"><h2 class="text-2xl font-bold mb-4">Pantauan Dana</h2></div>'},
    {n: 'laba.html', t: 'Laba & Distribusi', css: [false,false,false,true,false], a: 'labaApp', inner: '<div class="bg-white p-8 rounded-2xl border border-slate-200 text-center"><h2 class="text-2xl font-bold mb-4">Bagi Hasil Platform</h2></div>'},
    {n: 'laporan.html', t: 'Tiket Bantuan', css: [false,false,false,false,true], a: 'laporApp', inner: '<div class="bg-white p-8 rounded-2xl border border-slate-200 text-center"><h2 class="text-2xl font-bold mb-4">Pusat Resolusi Keluhan</h2></div>'},
]) {
    injectGlobalToastAndWrite(file.n, file.t, file.a, file.inner, file.css);
    fs.writeFileSync(path.join(jsDir, file.n.split('.')[0] + '-app.js'), `function ${file.a}() { return { sidebarOpen: false, initApp() { setTimeout(() => { if(window.lucide) lucide.createIcons(); }, 100); } } }`);
}

console.log('Admin Base Scaffolded!');
