let tempChart, vibrationChart, machineEffChart;
let currentMachineData = [];

async function initMachineHealth() {
    const data = await loadExcelData();
    
    if (data.length === 0) {
        return;
    }
    
    // Populate machine selector
    const machines = getUniqueMachines(data);
    const machineSelect = document.getElementById('machineSelect');
    machineSelect.innerHTML = '';
    
    machines.forEach(machine => {
        const option = document.createElement('option');
        option.value = machine;
        option.textContent = machine;
        machineSelect.appendChild(option);
    });
    
    updateMachineHealth();
}

function updateMachineHealth() {
    const selectedMachine = document.getElementById('machineSelect').value;
    
    if (!selectedMachine) return;
    
    currentMachineData = getMachineData(energyData, selectedMachine);
    
    if (currentMachineData.length === 0) return;
    
    updateMachineInfo();
    updateMachineKPIs();
    createTempChart();
    createVibrationChart();
    createMachineEffChart();
}

function updateMachineInfo() {
    const info = currentMachineData[0];
    document.getElementById('machineInfo').style.display = 'block';
    document.getElementById('machineType').textContent = info.Machine_Type || 'N/A';
    document.getElementById('machineLocation').textContent = info.Location || 'N/A';
    document.getElementById('machineStatus').textContent = info.Status || 'N/A';
    document.getElementById('machineOperator').textContent = info.Operator_Name || 'N/A';
}

function updateMachineKPIs() {
    const avgTemp = currentMachineData.reduce((sum, d) => sum + parseFloat(d.Machine_Temperature || 0), 0) / currentMachineData.length;
    const avgVib = currentMachineData.reduce((sum, d) => sum + parseFloat(d.Vibration_Level || 0), 0) / currentMachineData.length;
    const efficiency = getAvgEfficiency(currentMachineData);
    const downtime = currentMachineData.reduce((sum, d) => sum + parseFloat(d.Downtime_Minutes || 0), 0);
    
    document.getElementById('avgTemp').textContent = avgTemp.toFixed(1);
    document.getElementById('avgVibration').textContent = avgVib.toFixed(1);
    document.getElementById('machineEfficiency').textContent = efficiency.toFixed(2);
    document.getElementById('totalDowntime').textContent = downtime.toFixed(0);
}

function createTempChart() {
    // Sample every 5th record
    const sampledData = currentMachineData.filter((_, i) => i % 5 === 0);
    
    const ctx = document.getElementById('tempChart').getContext('2d');
    
    if (tempChart) {
        tempChart.destroy();
    }
    
    tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sampledData.map((_, i) => i + 1),
            datasets: [
                {
                    label: 'Machine Temp (°C)',
                    data: sampledData.map(d => parseFloat(d.Machine_Temperature)),
                    borderColor: '#ff4444',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Ambient Temp (°C)',
                    data: sampledData.map(d => parseFloat(d.Ambient_Temperature)),
                    borderColor: '#b0d4e8',
                    backgroundColor: 'rgba(176, 212, 232, 0.1)',
                    tension: 0.3,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            scales: {
                y: {
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

function createVibrationChart() {
    // Sample every 5th record
    const sampledData = currentMachineData.filter((_, i) => i % 5 === 0);
    
    const ctx = document.getElementById('vibrationChart').getContext('2d');
    
    if (vibrationChart) {
        vibrationChart.destroy();
    }
    
    // Color bars based on vibration level
    const backgroundColors = sampledData.map(d => {
        const vib = parseFloat(d.Vibration_Level);
        if (vib > 20) return 'rgba(255, 68, 68, 0.8)';
        if (vib > 10) return 'rgba(255, 165, 0, 0.8)';
        return 'rgba(0, 255, 136, 0.8)';
    });
    
    vibrationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sampledData.map((_, i) => i + 1),
            datasets: [{
                label: 'Vibration Level',
                data: sampledData.map(d => parseFloat(d.Vibration_Level)),
                backgroundColor: backgroundColors
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

function createMachineEffChart() {
    // Sample every 5th record
    const sampledData = currentMachineData.filter((_, i) => i % 5 === 0);
    
    const ctx = document.getElementById('machineEffChart').getContext('2d');
    
    if (machineEffChart) {
        machineEffChart.destroy();
    }
    
    machineEffChart = new Chart(ctx, {
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMachineHealth);
} else {
    initMachineHealth();
}