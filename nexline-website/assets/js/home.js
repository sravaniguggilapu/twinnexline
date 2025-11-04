// Initialize home page
let lineChart = null;

async function initHome() {
    const data = await loadExcelData();
    
    if (data.length === 0) {
        document.body.innerHTML = '<div class="container"><div class="loading">Error loading data. Please refresh the page.</div></div>';
        return;
    }
    
    // Update KPIs
    const totalEnergy = getTotalEnergy(data);
    const totalProduction = getTotalProduction(data);
    const avgEfficiency = getAvgEfficiency(data);
    const totalCO2 = getTotalCO2(data);
    
    document.getElementById('totalEnergy').textContent = formatNumber(totalEnergy);
    document.getElementById('totalProduction').textContent = formatNumber(totalProduction);
    document.getElementById('avgEfficiency').textContent = avgEfficiency.toFixed(2);
    document.getElementById('totalCO2').textContent = formatNumber(totalCO2);
    
    // Create line comparison chart
    createLineComparisonChart(data);
}

function createLineComparisonChart(data) {
    const lineComparison = getLineComparison(data);
    
    const ctx = document.getElementById('lineComparisonChart').getContext('2d');
    
    if (lineChart) {
        lineChart.destroy();
    }
    
    lineChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lineComparison.map(d => d.line),
            datasets: [
                {
                    label: 'Total Energy (kWh)',
                    data: lineComparison.map(d => d.energy),
                    backgroundColor: 'rgba(0, 212, 255, 0.6)',
                    borderColor: 'rgba(0, 212, 255, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Total Production',
                    data: lineComparison.map(d => d.production),
                    backgroundColor: 'rgba(0, 255, 136, 0.6)',
                    borderColor: 'rgba(0, 255, 136, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#b0d4e8' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#b0d4e8' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#ffffff', font: { size: 14 } }
                }
            }
        }
    });
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
} else {
    initHome();
}