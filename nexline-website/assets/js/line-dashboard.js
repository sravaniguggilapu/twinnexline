let energyChart, efficiencyChart, comparisonChart;
let currentLineData = [];

async function initLineDashboard() {
    const data = await loadExcelData();
    
    if (data.length === 0) {
        return;
    }
    
    // Populate line selector
    const lines = getUniqueLines(data);
    const lineSelect = document.getElementById('lineSelect');
    lines.forEach(line => {
        const option = document.createElement('option');
        option.value = line;
        option.textContent = line;
        lineSelect.appendChild(option);
    });
    
    updateLineDashboard();
}

function updateLineDashboard() {
    const selectedLine = document.getElementById('lineSelect').value;
    
    if (selectedLine === 'All') {
        currentLineData = energyData;
        document.getElementById('comparisonContainer').style.display = 'block';
        createComparisonChart();
    } else {
        currentLineData = getLineData(energyData, selectedLine);
        document.getElementById('comparisonContainer').style.display = 'none';
    }
    
    updateLineKPIs();
    createEnergyProductionChart();
    createEfficiencyChart();
}

function updateLineKPIs() {
    const energy = getTotalEnergy(currentLineData);
    const production = getTotalProduction(currentLineData);
    const efficiency = getAvgEfficiency(currentLineData);
    const anomalies = getAnomalies(currentLineData).length;
    
    document.getElementById('lineEnergy').textContent = formatNumber(energy);
    document.getElementById('lineProduction').textContent = formatNumber(production);
    document.getElementById('lineEfficiency').textContent = efficiency.toFixed(2);
    document.getElementById('lineAnomalies').textContent = anomalies;
}

function createEnergyProductionChart() {
    // Sample data for performance (every 10th record)
    const sampledData = currentLineData.filter((_, i) => i % 10 === 0);
    
    const ctx = document.getElementById('energyProductionChart').getContext('2d');
    
    if (energyChart) {
        energyChart.destroy();
    }
    
    energyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sampledData.map((_, i) => i + 1),
            datasets: [
                {
                    label: 'Energy (kWh)',
                    data: sampledData.map(d => parseFloat(d.Energy_Consumed_kWh)),
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    yAxisID: 'y',
                    tension: 0.3
                },
                {
                    label: 'Production',
                    data: sampledData.map(d => parseFloat(d.Units_Produced)),
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Energy (kWh)', color: '#00d4ff' },
                    ticks: { color: '#b0d4e8' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'Production', color: '#00ff88' },
                    ticks: { color: '#b0d4e8' },
                    grid: { drawOnChartArea: false }
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

function createEfficiencyChart() {
    // Sample data
    const sampledData = currentLineData.filter((_, i) => i % 10 === 0);
    
    const ctx = document.getElementById('efficiencyChart').getContext('2d');
    
    if (efficiencyChart) {
        efficiencyChart.destroy();
    }
    
    efficiencyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sampledData.map((_, i) => i + 1),
            datasets: [{
                label: 'Efficiency Score',
                data: sampledData.map(d => parseFloat(d.Efficiency_Score)),
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
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

function createComparisonChart() {
    const lineComparison = getLineComparison(energyData);
    
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    
    if (comparisonChart) {
        comparisonChart.destroy();
    }
    
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lineComparison.map(d => d.line),
            datasets: [
                {
                    label: 'Energy (kWh)',
                    data: lineComparison.map(d => d.energy),
                    backgroundColor: 'rgba(0, 212, 255, 0.6)'
                },
                {
                    label: 'Production',
                    data: lineComparison.map(d => d.production),
                    backgroundColor: 'rgba(0, 255, 136, 0.6)'
                },
                {
                    label: 'Avg Efficiency (x100)',
                    data: lineComparison.map(d => d.efficiency * 100),
                    backgroundColor: 'rgba(255, 165, 0, 0.6)'
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLineDashboard);
} else {
    initLineDashboard();
}