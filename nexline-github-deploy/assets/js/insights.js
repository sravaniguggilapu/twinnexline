async function initInsights() {
    const data = await loadExcelData();
    
    if (data.length === 0) {
        return;
    }
    
    const insights = generateInsights(data);
    displayInsights(insights);
}

function generateInsights(data) {
    const insights = [];
    const lines = getUniqueLines(data);
    const machines = getUniqueMachines(data);
    
    // Analyze each production line
    lines.forEach(line => {
        const lineData = getLineData(data, line);
        const avgEnergy = getTotalEnergy(lineData) / lineData.length;
        const avgEff = getAvgEfficiency(lineData);
        const anomalies = getAnomalies(lineData).length;
        
        // High energy consumption
        if (avgEnergy > 50) {
            insights.push({
                type: 'warning',
                title: `High Energy Consumption - ${line}`,
                description: `${line} shows high average energy consumption of ${avgEnergy.toFixed(2)} kWh per record. Consider optimizing production schedules or reviewing equipment efficiency.`,
                impact: 'medium',
                recommendation: 'Schedule energy audit and optimize production parameters'
            });
        }
        
        // Low efficiency
        if (avgEff < 5.0) {
            insights.push({
                type: 'warning',
                title: `Low Efficiency Score - ${line}`,
                description: `${line} has efficiency score of ${avgEff.toFixed(2)}, which is below optimal levels. This indicates potential operational inefficiencies.`,
                impact: 'high',
                recommendation: 'Review machine settings and operator training programs'
            });
        }
        
        // Energy anomalies
        if (anomalies > 10) {
            insights.push({
                type: 'critical',
                title: `Energy Anomalies Detected - ${line}`,
                description: `${anomalies} energy anomalies detected in ${line}. Unusual energy patterns may indicate equipment issues or operational problems.`,
                impact: 'high',
                recommendation: 'Investigate anomaly patterns and check equipment status'
            });
        }
    });
    
    // Analyze machines
    machines.forEach(machine => {
        const machineData = getMachineData(data, machine);
        const avgTemp = machineData.reduce((sum, d) => sum + parseFloat(d.Machine_Temperature || 0), 0) / machineData.length;
        const avgVib = machineData.reduce((sum, d) => sum + parseFloat(d.Vibration_Level || 0), 0) / machineData.length;
        const downtime = machineData.reduce((sum, d) => sum + parseFloat(d.Downtime_Minutes || 0), 0);
        
        // High temperature
        if (avgTemp > 50) {
            insights.push({
                type: 'warning',
                title: `High Operating Temperature - ${machine}`,
                description: `${machine} running at ${avgTemp.toFixed(1)}°C average temperature. Elevated temperatures may reduce equipment lifespan.`,
                impact: 'medium',
                recommendation: 'Check cooling systems and ensure proper ventilation'
            });
        }
        
        // High vibration
        if (avgVib > 15) {
            insights.push({
                type: 'warning',
                title: `Excessive Vibration - ${machine}`,
                description: `${machine} shows high vibration levels (${avgVib.toFixed(1)} average). May indicate mechanical wear or misalignment.`,
                impact: 'medium',
                recommendation: 'Perform vibration analysis and check for loose components'
            });
        }
        
        // High downtime
        if (downtime > 100) {
            insights.push({
                type: 'critical',
                title: `Excessive Downtime - ${machine}`,
                description: `${machine} has ${downtime.toFixed(0)} minutes of downtime. This significantly impacts production efficiency.`,
                impact: 'high',
                recommendation: 'Review maintenance logs and identify root causes'
            });
        }
    });
    
    // Overall system insights
    const totalCO2 = getTotalCO2(data);
    insights.push({
        type: 'info',
        title: 'Environmental Impact Summary',
        description: `Total CO₂ emissions: ${formatNumber(totalCO2)} kg. Implementing energy-saving measures could reduce emissions by 15-20%.`,
        impact: 'medium',
        recommendation: 'Focus on high-consumption periods and implement energy recovery systems'
    });
    
    return insights;
}

function displayInsights(insights) {
    const container = document.getElementById('insightsContainer');
    
    // Update KPIs
    document.getElementById('totalInsights').textContent = insights.length;
    document.getElementById('criticalCount').textContent = insights.filter(i => i.type === 'critical').length;
    document.getElementById('anomalyCount').textContent = getAnomalies(energyData).length;
    document.getElementById('recommendCount').textContent = insights.length;
    
    // Display insights
    container.innerHTML = '';
    insights.forEach(insight => {
        const card = document.createElement('div');
        card.className = `insight-card ${insight.type}`;
        card.innerHTML = `
            <h3>${insight.title}</h3>
            <p>${insight.description}</p>
            <div>
                <span class="insight-tag ${insight.impact}">${insight.impact.toUpperCase()} IMPACT</span>
            </div>
            <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                <strong style="color: #00d4ff;">⚙️ Recommended Action:</strong> ${insight.recommendation}
            </p>
        `;
        container.appendChild(card);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInsights);
} else {
    initInsights();
}