function umkmApp() {
            return {
                sidebarOpen: false,
                initApp() { 
                    setTimeout(() => { 
                        if(window.lucide) lucide.createIcons(); 
                        this.initChart();
                    }, 100); 
                },
                initChart() {
                    const ctx = document.getElementById('salesChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                            datasets: [{
                                label: 'Penjualan (Ribuan)',
                                data: [850, 1200, 950, 1600, 2400, 3100, 2300],
                                backgroundColor: '#10b981',
                                borderRadius: 6
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { beginAtZero: true, grid: { borderDash: [4, 4] } },
                                x: { grid: { display: false } }
                            }
                        }
                    });
                }
            }
        }