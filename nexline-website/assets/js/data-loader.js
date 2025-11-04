// Global data storage
let energyData = [];

// Load Excel data
async function loadExcelData() {
    try {
        const response = await fetch('assets/data/complete_energy_dataset_2700.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        energyData = XLSX.utils.sheet_to_json(firstSheet);
        console.log('Data loaded:', energyData.length, 'records');
        return energyData;
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
}

// Calculate total energy
function getTotalEnergy(data) {
    return data.reduce((sum, row) => sum + (parseFloat(row.Energy_Consumed_kWh) || 0), 0);
}

// Calculate total production
function getTotalProduction(data) {
    return data.reduce((sum, row) => sum + (parseFloat(row.Units_Produced) || 0), 0);
}

// Calculate average efficiency
function getAvgEfficiency(data) {
    const efficiencies = data.map(row => parseFloat(row.Efficiency_Score) || 0);
    const sum = efficiencies.reduce((a, b) => a + b, 0);
    return sum / data.length;
}

// Calculate total CO2
function getTotalCO2(data) {
    return data.reduce((sum, row) => sum + (parseFloat(row.CO2_Emission_kg) || 0), 0);
}

// Get unique lines
function getUniqueLines(data) {
    return [...new Set(data.map(row => row.Line_Name))].filter(Boolean).sort();
}

// Get unique machines
function getUniqueMachines(data) {
    return [...new Set(data.map(row => row.Machine_ID))].filter(Boolean).sort();
}

// Get data for specific line
function getLineData(data, lineName) {
    return data.filter(row => row.Line_Name === lineName);
}

// Get data for specific machine
function getMachineData(data, machineID) {
    return data.filter(row => row.Machine_ID === machineID);
}

// Get anomalies
function getAnomalies(data) {
    return data.filter(row => row.Energy_Anomaly_Flag === 1 || row.Energy_Anomaly_Flag === '1');
}

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
}

// Get line comparison data
function getLineComparison(data) {
    const lines = getUniqueLines(data);
    return lines.map(line => {
        const lineRecords = getLineData(data, line);
        return {
            line: line,
            energy: getTotalEnergy(lineRecords),
            production: getTotalProduction(lineRecords),
            efficiency: getAvgEfficiency(lineRecords)
        };
    });
}