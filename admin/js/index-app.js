
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
