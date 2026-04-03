
function portApp() {
    return {
        sidebarOpen: false,
        initApp() {
            setTimeout(() => {
                if(window.lucide) lucide.createIcons();
                const ctx = document.getElementById('portChart')?.getContext('2d');
                if(ctx) {
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: ['1', '2', '3', '4', '5', '6'],
                            datasets: [{ label: 'Dana', data: [15, 25, 45, 60, 95, 120], borderColor: '#4f46e5', tension: 0.4, fill:true, backgroundColor: 'rgba(79, 70, 229, 0.1)' }]
                        },
                        options: { responsive:true, maintainAspectRatio:false, plugins: { legend: { display: false } }, elements: { point: { radius: 0 } } }
                    });
                }
            }, 100);
        }
    }
}
