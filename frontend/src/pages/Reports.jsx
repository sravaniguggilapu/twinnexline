import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useData } from '../context/DataContext';
import * as XLSX from 'xlsx';
import { FileText, Download, TrendingUp, AlertTriangle, Zap, Award } from 'lucide-react';

const Reports = () => {
  const { data, loading } = useData();
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      generateReport();
    }
  }, [data]);

  const generateReport = () => {
    // Overall metrics
    const totalEnergy = data.reduce((sum, row) => sum + parseFloat(row.Energy_Consumed_kWh), 0);
    const totalProduction = data.reduce((sum, row) => sum + parseFloat(row.Units_Produced), 0);
    const avgEfficiency = data.reduce((sum, row) => sum + parseFloat(row.Efficiency_Score), 0) / data.length;
    const totalCO2 = data.reduce((sum, row) => sum + parseFloat(row.CO2_Emission_kg), 0);
    const totalCost = data.reduce((sum, row) => sum + parseFloat(row.Energy_Cost_USD), 0);
    const anomalyCount = data.filter(row => row.Energy_Anomaly_Flag === 1 || row.Energy_Anomaly_Flag === '1').length;

    // Line-level performance
    const lines = [...new Set(data.map(row => row.Line_Name))];
    const linePerformance = lines.map(line => {
      const lineRecords = data.filter(row => row.Line_Name === line);
      const lineEnergy = lineRecords.reduce((sum, row) => sum + parseFloat(row.Energy_Consumed_kWh), 0);
      const lineProduction = lineRecords.reduce((sum, row) => sum + parseFloat(row.Units_Produced), 0);
      const lineEfficiency = lineRecords.reduce((sum, row) => sum + parseFloat(row.Efficiency_Score), 0) / lineRecords.length;
      const energyPerUnit = lineProduction > 0 ? lineEnergy / lineProduction : 0;
      
      return {
        line,
        energy: lineEnergy,
        production: lineProduction,
        efficiency: lineEfficiency,
        energyPerUnit
      };
    });

    // Machine-level issues
    const machines = [...new Set(data.map(row => row.Machine_ID))];
    const machineIssues = [];
    
    machines.forEach(machine => {
      const machineRecords = data.filter(row => row.Machine_ID === machine);
      const avgTemp = machineRecords.reduce((sum, row) => sum + parseFloat(row.Machine_Temperature), 0) / machineRecords.length;
      const avgVibration = machineRecords.reduce((sum, row) => sum + parseFloat(row.Vibration_Level), 0) / machineRecords.length;
      const totalDowntime = machineRecords.reduce((sum, row) => sum + parseFloat(row.Downtime_Minutes), 0);
      const machineEfficiency = machineRecords.reduce((sum, row) => sum + parseFloat(row.Efficiency_Score), 0) / machineRecords.length;
      
      const issues = [];
      if (avgTemp > 50) issues.push('High Temperature');
      if (avgVibration > 15) issues.push('Excessive Vibration');
      if (totalDowntime > 100) issues.push('High Downtime');
      if (machineEfficiency < 0.85) issues.push('Low Efficiency');
      
      if (issues.length > 0) {
        machineIssues.push({
          machine,
          issues: issues.join(', '),
          avgTemp: avgTemp.toFixed(1),
          avgVibration: avgVibration.toFixed(1),
          totalDowntime: totalDowntime.toFixed(0),
          efficiency: (machineEfficiency * 100).toFixed(1)
        });
      }
    });

    // Top 5 inefficiency sources
    const inefficiencySources = linePerformance
      .sort((a, b) => b.energyPerUnit - a.energyPerUnit)
      .slice(0, 5)
      .map(line => ({
        source: line.line,
        issue: 'High energy per unit',
        metric: `${line.energyPerUnit.toFixed(2)} kWh/unit`,
        recommendation: 'Optimize production parameters'
      }));

    // Add machine issues to inefficiency sources
    machineIssues.slice(0, 5 - inefficiencySources.length).forEach(machine => {
      inefficiencySources.push({
        source: machine.machine,
        issue: machine.issues,
        metric: `Efficiency: ${machine.efficiency}%`,
        recommendation: 'Schedule maintenance'
      });
    });

    setReportData({
      summary: {
        totalEnergy: totalEnergy.toFixed(0),
        totalProduction: totalProduction.toFixed(0),
        avgEfficiency: avgEfficiency.toFixed(2),
        totalCO2: totalCO2.toFixed(0),
        totalCost: totalCost.toFixed(2),
        anomalyCount,
        energyPerUnit: (totalEnergy / totalProduction).toFixed(2)
      },
      linePerformance,
      inefficiencySources,
      recommendations: [
        {
          title: 'Energy Optimization',
          description: 'Focus on lines with high energy per unit ratio. Implement variable frequency drives and optimize motor efficiency.',
          priority: 'High',
          potential_savings: '15-20% reduction in energy costs'
        },
        {
          title: 'Predictive Maintenance',
          description: `Address ${machineIssues.length} machines showing performance issues. Implement condition-based maintenance schedules.`,
          priority: 'High',
          potential_savings: 'Reduce downtime by 30%'
        },
        {
          title: 'Anomaly Investigation',
          description: `${anomalyCount} energy anomalies detected. Investigate root causes and implement monitoring alerts.`,
          priority: 'Medium',
          potential_savings: 'Prevent energy waste and equipment damage'
        },
        {
          title: 'CO₂ Reduction Program',
          description: 'Implement energy recovery systems and renewable energy sources to reduce carbon footprint.',
          priority: 'Medium',
          potential_savings: '20-25% reduction in CO₂ emissions'
        },
        {
          title: 'Operator Training',
          description: 'Focus training on energy-efficient operation practices and early issue detection.',
          priority: 'Low',
          potential_savings: 'Improve overall efficiency by 10%'
        }
      ]
    });
  };

  const downloadCSV = () => {
    if (!reportData) return;

    // Prepare summary data
    const summaryData = [
      ['ENERGY EFFICIENCY REPORT - NEXLINE MANUFACTURING'],
      ['Generated:', new Date().toLocaleString()],
      [''],
      ['SUMMARY METRICS'],
      ['Total Energy Consumed (kWh)', reportData.summary.totalEnergy],
      ['Total Units Produced', reportData.summary.totalProduction],
      ['Average Efficiency Score', reportData.summary.avgEfficiency],
      ['Energy per Unit (kWh/unit)', reportData.summary.energyPerUnit],
      ['Total CO2 Emissions (kg)', reportData.summary.totalCO2],
      ['Total Energy Cost (USD)', reportData.summary.totalCost],
      ['Energy Anomalies Detected', reportData.summary.anomalyCount],
      [''],
      ['LINE PERFORMANCE'],
      ['Line Name', 'Total Energy (kWh)', 'Total Production', 'Avg Efficiency', 'Energy per Unit'],
      ...reportData.linePerformance.map(line => [
        line.line,
        line.energy.toFixed(2),
        line.production.toFixed(2),
        line.efficiency.toFixed(2),
        line.energyPerUnit.toFixed(2)
      ]),
      [''],
      ['TOP INEFFICIENCY SOURCES'],
      ['Source', 'Issue', 'Metric', 'Recommendation'],
      ...reportData.inefficiencySources.map(source => [
        source.source,
        source.issue,
        source.metric,
        source.recommendation
      ]),
      [''],
      ['RECOMMENDATIONS'],
      ['Title', 'Description', 'Priority', 'Potential Savings'],
      ...reportData.recommendations.map(rec => [
        rec.title,
        rec.description,
        rec.priority,
        rec.potential_savings
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Energy Report');
    
    XLSX.writeFile(wb, `Nexline_Energy_Report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-cyan-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-300 text-xl">Generating Report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Energy Efficiency Report</h1>
            <p className="text-slate-400">Comprehensive analysis and improvement recommendations</p>
          </div>
          <Button 
            onClick={downloadCSV}
            className="bg-cyan-500 hover:bg-cyan-600 text-white flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download CSV
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Energy</CardTitle>
              <Zap className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{parseFloat(reportData.summary.totalEnergy).toLocaleString()} kWh</div>
              <p className="text-xs text-slate-500 mt-1">{reportData.summary.energyPerUnit} kWh/unit</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Production</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{parseFloat(reportData.summary.totalProduction).toLocaleString()} units</div>
              <p className="text-xs text-slate-500 mt-1">Avg efficiency: {reportData.summary.avgEfficiency}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Energy Cost</CardTitle>
              <Award className="w-5 h-5 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${parseFloat(reportData.summary.totalCost).toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Total energy expenditure</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">CO₂ Emissions</CardTitle>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{parseFloat(reportData.summary.totalCO2).toLocaleString()} kg</div>
              <p className="text-xs text-slate-500 mt-1">{reportData.summary.anomalyCount} anomalies detected</p>
            </CardContent>
          </Card>
        </div>

        {/* Line Performance */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Production Line Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Line</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-semibold">Energy (kWh)</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-semibold">Production</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-semibold">Efficiency</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-semibold">Energy/Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.linePerformance.map((line, idx) => (
                    <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-white font-medium">{line.line}</td>
                      <td className="py-3 px-4 text-white text-right">{line.energy.toFixed(0)}</td>
                      <td className="py-3 px-4 text-white text-right">{line.production.toFixed(0)}</td>
                      <td className="py-3 px-4 text-white text-right">{line.efficiency.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`${
                          line.energyPerUnit > 10 ? 'text-red-400' : 
                          line.energyPerUnit > 8 ? 'text-yellow-400' : 'text-green-400'
                        } font-semibold`}>
                          {line.energyPerUnit.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Inefficiency Sources */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Top 5 Inefficiency Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.inefficiencySources.map((source, idx) => (
                <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{idx + 1}. {source.source}</h4>
                      <p className="text-sm text-slate-400">{source.issue}</p>
                    </div>
                    <span className="text-cyan-400 font-semibold">{source.metric}</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    <span className="text-cyan-400">Recommendation:</span> {source.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Improvement Recommendations */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Improvement Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-xl font-semibold text-white">{rec.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      rec.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500' :
                      rec.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500' :
                      'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                    }`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3">{rec.description}</p>
                  <div className="flex items-center gap-2 text-green-400">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-semibold">{rec.potential_savings}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;