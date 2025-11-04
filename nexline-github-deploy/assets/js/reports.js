let reportData = {};

async function initReports() {
    const data = await loadExcelData();
    
    if (data.length === 0) {
        return;
    }
    
    generateReport(data);
}

function generateReport(data) {
    // Overall metrics
    const totalEnergy = getTotalEnergy(data);
    const totalProduction = getTotalProduction(data);
    const totalCost = data.reduce((sum, row) => sum + parseFloat(row.Energy_Cost_USD || 0), 0);
    const totalCO2 = getTotalCO2(data);
    
    // Update KPIs
    document.getElementById('reportEnergy').textContent = formatNumber(totalEnergy) + ' kWh';
    document.getElementById('reportProduction').textContent = formatNumber(totalProduction);
    document.getElementById('reportCost').textContent = '$' + formatNumber(totalCost);
    document.getElementById('reportCO2').textContent = formatNumber(totalCO2) + ' kg';
    
    // Line performance
    const linePerformance = getLineComparison(data);
    const tbody = document.getElementById('linePerformanceBody');
    tbody.innerHTML = '';
    
    linePerformance.forEach(line => {
        const energyPerUnit = line.energy / line.production;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${line.line}</td>
            <td>${formatNumber(line.energy)}</td>
            <td>${formatNumber(line.production)}</td>
            <td>${line.efficiency.toFixed(2)}</td>
            <td style="color: ${energyPerUnit > 0.15 ? '#ff4444' : '#00ff88'}">${energyPerUnit.toFixed(4)}</td>
        `;
        tbody.appendChild(tr);
    });
    
    // Top inefficiency sources
    displayInefficiencySources(linePerformance);
    
    // Recommendations
    displayRecommendations(data, linePerformance);
    
    // Store for CSV export
    reportData = {
        totalEnergy,
        totalProduction,
        totalCost,
        totalCO2,
        linePerformance
    };
}

function displayInefficiencySources(linePerformance) {
    const sorted = [...linePerformance].sort((a, b) => {
        const ratioA = a.energy / a.production;
        const ratioB = b.energy / b.production;
        return ratioB - ratioA;
    }).slice(0, 5);
    
    const container = document.getElementById('inefficiencySources');
    container.innerHTML = '';
    
    sorted.forEach((line, index) => {
        const energyPerUnit = line.energy / line.production;
        const card = document.createElement('div');
        card.className = 'insight-card';
        card.innerHTML = `
            <h3>${index + 1}. ${line.line}</h3>
            <p><strong>Issue:</strong> High energy per unit ratio</p>
            <p><strong>Energy/Unit:</strong> ${energyPerUnit.toFixed(4)} kWh/unit</p>
            <p><strong>Total Energy:</strong> ${formatNumber(line.energy)} kWh</p>
            <p style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                <strong style="color: #00d4ff;">💡 Recommendation:</strong> Optimize production parameters and review equipment efficiency
            </p>
        `;
        container.appendChild(card);
    });
}

function displayRecommendations(data, linePerformance) {
    const anomalies = getAnomalies(data).length;
    const criticalMachines = data.filter(row => row.Status === 'Critical').length;
    
    const recommendations = [
        {
            title: 'Energy Optimization',
            description: 'Focus on lines with high energy per unit ratio. Implement variable frequency drives and optimize motor efficiency.',
            priority: 'High',
            savings: '15-20% reduction in energy costs'
        },
        {
            title: 'Predictive Maintenance',
            description: `Address ${criticalMachines} machines showing performance issues. Implement condition-based maintenance schedules.`,
            priority: 'High',
            savings: 'Reduce downtime by 30%'
        },
        {
            title: 'Anomaly Investigation',
            description: `${anomalies} energy anomalies detected. Investigate root causes and implement monitoring alerts.`,
            priority: 'Medium',
            savings: 'Prevent energy waste and equipment damage'
        },
        {
            title: 'CO₂ Reduction Program',
            description: 'Implement energy recovery systems and renewable energy sources to reduce carbon footprint.',
            priority: 'Medium',
            savings: '20-25% reduction in CO₂ emissions'
        },
        {
            title: 'Operator Training',
            description: 'Focus training on energy-efficient operation practices and early issue detection.',
            priority: 'Low',
            savings: 'Improve overall efficiency by 10%'
        }
    ];
    
    const container = document.getElementById('recommendations');
    container.innerHTML = '';
    
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'insight-card';
        const priorityColor = rec.priority === 'High' ? 'high' : rec.priority === 'Medium' ? 'medium' : 'low';
        card.innerHTML = `
            <h3>${rec.title}</h3>
            <p>${rec.description}</p>
            <div style="margin-top: 15px;">
                <span class="insight-tag ${priorityColor}">${rec.priority.toUpperCase()} PRIORITY</span>
            </div>
            <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); color: #00ff88;">
                <strong>🏆 Potential Savings:</strong> ${rec.savings}
            </p>
        `;
        container.appendChild(card);
    });
}

function downloadCSV() {
    if (!reportData.linePerformance) {
        alert('Report data not loaded yet');
        return;
    }
    
    let csv = 'NEXLINE ENERGY EFFICIENCY REPORT\n\n';
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    csv += 'SUMMARY METRICS\n';
    csv += `Total Energy Consumed (kWh),${reportData.totalEnergy.toFixed(2)}\n`;
    csv += `Total Units Produced,${reportData.totalProduction.toFixed(2)}\n`;
    csv += `Total Energy Cost (USD),${reportData.totalCost.toFixed(2)}\n`;
    csv += `Total CO2 Emissions (kg),${reportData.totalCO2.toFixed(2)}\n`;
    csv += `Energy per Unit,${(reportData.totalEnergy / reportData.totalProduction).toFixed(4)}\n\n`;
    
    csv += 'PRODUCTION LINE PERFORMANCE\n';
    csv += 'Line,Energy (kWh),Production,Avg Efficiency,Energy/Unit\n';
    reportData.linePerformance.forEach(line => {
        csv += `${line.line},${line.energy.toFixed(2)},${line.production.toFixed(2)},${line.efficiency.toFixed(2)},${(line.energy / line.production).toFixed(4)}\n`;
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nexline_Energy_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReports);
} else {
    initReports();
}