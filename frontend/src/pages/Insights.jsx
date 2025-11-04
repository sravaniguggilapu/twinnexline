import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useData } from '../context/DataContext';
import { AlertTriangle, TrendingUp, Zap, Settings, Lightbulb, CheckCircle } from 'lucide-react';

const Insights = () => {
  const { data, loading } = useData();
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      generateInsights();
    }
  }, [data]);

  const generateInsights = () => {
    const generatedInsights = [];

    // Line-level analysis
    const lines = [...new Set(data.map(row => row.Line_Name))];
    lines.forEach(line => {
      const lineRecords = data.filter(row => row.Line_Name === line);
      const avgEnergyPerUnit = lineRecords.reduce((sum, row) => {
        const energy = parseFloat(row.Energy_Consumed_kWh);
        const units = parseFloat(row.Units_Produced);
        return sum + (units > 0 ? energy / units : 0);
      }, 0) / lineRecords.length;

      const avgEfficiency = lineRecords.reduce((sum, row) => sum + parseFloat(row.Efficiency_Score), 0) / lineRecords.length;
      const anomalyCount = lineRecords.filter(row => row.Energy_Anomaly_Flag === 1 || row.Energy_Anomaly_Flag === '1').length;
      const criticalMachines = lineRecords.filter(row => row.Status === 'Critical').length;

      if (avgEnergyPerUnit > 10) {
        generatedInsights.push({
          type: 'high_energy',
          severity: 'warning',
          title: `High Energy Consumption - ${line}`,
          description: `${line} shows high energy per unit output (${avgEnergyPerUnit.toFixed(2)} kWh/unit). Consider recalibrating motors or optimizing production schedules.`,
          impact: 'Medium',
          recommendation: 'Schedule maintenance check and review production parameters'
        });
      }

      if (avgEfficiency < 0.85) {
        generatedInsights.push({
          type: 'low_efficiency',
          severity: 'warning',
          title: `Low Efficiency Score - ${line}`,
          description: `${line} has below-average efficiency (${(avgEfficiency * 100).toFixed(1)}%). This indicates potential operational inefficiencies.`,
          impact: 'High',
          recommendation: 'Review machine settings and operator training programs'
        });
      }

      if (anomalyCount > 5) {
        generatedInsights.push({
          type: 'anomaly',
          severity: 'critical',
          title: `Energy Anomalies Detected - ${line}`,
          description: `${anomalyCount} energy anomalies detected in ${line}. Unusual energy consumption patterns may indicate equipment issues.`,
          impact: 'High',
          recommendation: 'Investigate specific time periods with anomalies and check equipment status'
        });
      }

      if (criticalMachines > 0) {
        generatedInsights.push({
          type: 'critical_status',
          severity: 'critical',
          title: `Critical Machines - ${line}`,
          description: `${criticalMachines} machine(s) in ${line} are in critical status. Immediate attention required to prevent production loss.`,
          impact: 'Critical',
          recommendation: 'Immediate inspection and maintenance required'
        });
      }
    });

    // Machine-level insights
    const machines = [...new Set(data.map(row => row.Machine_ID))];
    machines.forEach(machine => {
      const machineRecords = data.filter(row => row.Machine_ID === machine);
      const avgTemp = machineRecords.reduce((sum, row) => sum + parseFloat(row.Machine_Temperature), 0) / machineRecords.length;
      const avgVibration = machineRecords.reduce((sum, row) => sum + parseFloat(row.Vibration_Level), 0) / machineRecords.length;
      const totalDowntime = machineRecords.reduce((sum, row) => sum + parseFloat(row.Downtime_Minutes), 0);

      if (avgTemp > 50) {
        generatedInsights.push({
          type: 'high_temperature',
          severity: 'warning',
          title: `High Operating Temperature - ${machine}`,
          description: `${machine} is running at elevated temperature (${avgTemp.toFixed(1)}°C average). This may reduce equipment lifespan.`,
          impact: 'Medium',
          recommendation: 'Check cooling systems and ensure proper ventilation'
        });
      }

      if (avgVibration > 15) {
        generatedInsights.push({
          type: 'high_vibration',
          severity: 'warning',
          title: `Excessive Vibration - ${machine}`,
          description: `${machine} shows high vibration levels (${avgVibration.toFixed(1)} average). This may indicate mechanical wear or misalignment.`,
          impact: 'Medium',
          recommendation: 'Perform vibration analysis and check for loose components'
        });
      }

      if (totalDowntime > 100) {
        generatedInsights.push({
          type: 'high_downtime',
          severity: 'critical',
          title: `Excessive Downtime - ${machine}`,
          description: `${machine} has accumulated ${totalDowntime.toFixed(0)} minutes of downtime. This significantly impacts production efficiency.`,
          impact: 'High',
          recommendation: 'Review maintenance logs and identify root causes of downtime'
        });
      }
    });

    // Overall system insights
    const totalCO2 = data.reduce((sum, row) => sum + parseFloat(row.CO2_Emission_kg), 0);
    const avgPowerFactor = data.reduce((sum, row) => sum + parseFloat(row.Power_Factor), 0) / data.length;

    if (avgPowerFactor < 3.0) {
      generatedInsights.push({
        type: 'power_factor',
        severity: 'info',
        title: 'Power Factor Optimization Opportunity',
        description: `System average power factor is ${avgPowerFactor.toFixed(2)}. Improving power factor can reduce energy costs.`,
        impact: 'Low',
        recommendation: 'Consider installing power factor correction capacitors'
      });
    }

    generatedInsights.push({
      type: 'sustainability',
      severity: 'success',
      title: 'Environmental Impact Summary',
      description: `Total CO₂ emissions: ${totalCO2.toFixed(0)} kg. Implementing energy-saving measures could reduce emissions by 15-20%.`,
      impact: 'Medium',
      recommendation: 'Focus on high-consumption periods and implement energy recovery systems'
    });

    setInsights(generatedInsights);
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: {
        color: 'border-red-500 bg-red-500/10',
        icon: AlertTriangle,
        iconColor: 'text-red-500',
        badge: 'bg-red-500/20 text-red-400 border-red-500'
      },
      warning: {
        color: 'border-yellow-500 bg-yellow-500/10',
        icon: AlertTriangle,
        iconColor: 'text-yellow-500',
        badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
      },
      info: {
        color: 'border-cyan-500 bg-cyan-500/10',
        icon: Lightbulb,
        iconColor: 'text-cyan-500',
        badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500'
      },
      success: {
        color: 'border-green-500 bg-green-500/10',
        icon: CheckCircle,
        iconColor: 'text-green-500',
        badge: 'bg-green-500/20 text-green-400 border-green-500'
      }
    };
    return configs[severity] || configs.info;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 text-cyan-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-300 text-xl">Analyzing Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8">
      {/* Hero Section with Background */}
      <div className="relative h-[300px] overflow-hidden mb-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1658242094232-0cacdec9fe55?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxlbmVyZ3klMjBlZmZpY2llbmN5fGVufDB8fHx8MTc2MjI3ODMzMHww&ixlib=rb-4.1.0&q=85')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-950/95"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-10 h-10 text-yellow-400" />
              <h1 className="text-4xl font-bold text-white">AI-Powered Insights</h1>
            </div>
            <p className="text-xl text-slate-300">
              Automated recommendations based on real-time data analysis and machine learning algorithms
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Insights</CardTitle>
              <TrendingUp className="w-5 h-5 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{insights.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Critical Issues</CardTitle>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {insights.filter(i => i.severity === 'critical').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Warnings</CardTitle>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {insights.filter(i => i.severity === 'warning').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Opportunities</CardTitle>
              <Zap className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {insights.filter(i => i.severity === 'info' || i.severity === 'success').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const config = getSeverityConfig(insight.severity);
            const Icon = config.icon;
            
            return (
              <Card 
                key={index} 
                className={`bg-slate-800/50 backdrop-blur-sm border-2 ${config.color} hover:shadow-lg transition-all duration-300`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-900/50 flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${config.iconColor}`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-white">{insight.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.badge}`}>
                          {insight.impact} Impact
                        </span>
                      </div>
                      <p className="text-slate-300 mb-4 leading-relaxed">{insight.description}</p>
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                        <div className="flex items-start gap-2">
                          <Settings className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-cyan-400 mb-1">Recommended Action:</div>
                            <div className="text-sm text-slate-300">{insight.recommendation}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {insights.length === 0 && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">All Systems Operating Normally</h3>
              <p className="text-slate-400">No critical insights or recommendations at this time.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Insights;