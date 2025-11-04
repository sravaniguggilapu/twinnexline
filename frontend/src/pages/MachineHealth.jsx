import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { useData } from '../context/DataContext';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Gauge, Thermometer, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const MachineHealth = () => {
  const { data, loading } = useData();
  const [selectedMachine, setSelectedMachine] = useState('');
  const [machines, setMachines] = useState([]);
  const [machineData, setMachineData] = useState([]);
  const [chartData, setChartData] = useState({ temp: [], vibration: [], efficiency: [], downtime: [] });

  useEffect(() => {
    if (data && data.length > 0) {
      const uniqueMachines = [...new Set(data.map(row => row.Machine_ID))];
      setMachines(uniqueMachines);
      if (uniqueMachines.length > 0 && !selectedMachine) {
        setSelectedMachine(uniqueMachines[0]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (data && selectedMachine) {
      const filtered = data.filter(row => row.Machine_ID === selectedMachine);
      setMachineData(filtered);
    }
  }, [data, selectedMachine]);

  useEffect(() => {
    if (machineData.length > 0) {
      renderCharts();
    }
  }, [machineData]);

  const renderCharts = () => {
    // Temperature Trend
    const tempTrace = {
      x: machineData.map((_, idx) => idx + 1),
      y: machineData.map(row => parseFloat(row.Machine_Temperature)),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Machine Temp',
      line: { color: '#ef4444', width: 2 },
      marker: { size: 6 }
    };

    const ambientTrace = {
      x: machineData.map((_, idx) => idx + 1),
      y: machineData.map(row => parseFloat(row.Ambient_Temperature)),
      type: 'scatter',
      mode: 'lines',
      name: 'Ambient Temp',
      line: { color: '#94a3b8', width: 2, dash: 'dot' }
    };

    const tempLayout = {
      title: {
        text: 'Temperature Monitoring',
        font: { color: '#e2e8f0', size: 16 }
      },
      paper_bgcolor: 'rgba(30, 41, 59, 0.5)',
      plot_bgcolor: 'rgba(30, 41, 59, 0.3)',
      xaxis: {
        title: 'Record',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      yaxis: {
        title: 'Temperature (°C)',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      legend: {
        font: { color: '#e2e8f0' },
        bgcolor: 'rgba(30, 41, 59, 0.8)'
      },
      margin: { t: 40, r: 50, b: 50, l: 60 }
    };

    Plotly.newPlot(tempChartRef.current, [tempTrace, ambientTrace], tempLayout, { responsive: true });

    // Vibration Level
    const vibrationTrace = {
      x: machineData.map((_, idx) => idx + 1),
      y: machineData.map(row => parseFloat(row.Vibration_Level)),
      type: 'bar',
      marker: {
        color: machineData.map(row => {
          const vib = parseFloat(row.Vibration_Level);
          if (vib > 20) return '#ef4444';
          if (vib > 10) return '#f59e0b';
          return '#10b981';
        })
      }
    };

    const vibrationLayout = {
      title: {
        text: 'Vibration Level Analysis',
        font: { color: '#e2e8f0', size: 16 }
      },
      paper_bgcolor: 'rgba(30, 41, 59, 0.5)',
      plot_bgcolor: 'rgba(30, 41, 59, 0.3)',
      xaxis: {
        title: 'Record',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      yaxis: {
        title: 'Vibration Level',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      margin: { t: 40, r: 50, b: 50, l: 60 }
    };

    Plotly.newPlot(vibrationChartRef.current, [vibrationTrace], vibrationLayout, { responsive: true });

    // Efficiency Score
    const efficiencyTrace = {
      x: machineData.map((_, idx) => idx + 1),
      y: machineData.map(row => parseFloat(row.Efficiency_Score)),
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      line: { color: '#22d3ee', width: 2 },
      fillcolor: 'rgba(34, 211, 238, 0.2)'
    };

    const efficiencyLayout = {
      title: {
        text: 'Efficiency Score Over Time',
        font: { color: '#e2e8f0', size: 16 }
      },
      paper_bgcolor: 'rgba(30, 41, 59, 0.5)',
      plot_bgcolor: 'rgba(30, 41, 59, 0.3)',
      xaxis: {
        title: 'Record',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      yaxis: {
        title: 'Efficiency Score',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      margin: { t: 40, r: 50, b: 50, l: 60 }
    };

    Plotly.newPlot(efficiencyChartRef.current, [efficiencyTrace], efficiencyLayout, { responsive: true });

    // Downtime Analysis
    const downtimeTrace = {
      x: machineData.map((_, idx) => idx + 1),
      y: machineData.map(row => parseFloat(row.Downtime_Minutes)),
      type: 'scatter',
      mode: 'markers',
      marker: {
        size: machineData.map(row => Math.max(8, parseFloat(row.Downtime_Minutes) * 2)),
        color: '#f59e0b',
        opacity: 0.6
      }
    };

    const downtimeLayout = {
      title: {
        text: 'Downtime Distribution',
        font: { color: '#e2e8f0', size: 16 }
      },
      paper_bgcolor: 'rgba(30, 41, 59, 0.5)',
      plot_bgcolor: 'rgba(30, 41, 59, 0.3)',
      xaxis: {
        title: 'Record',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      yaxis: {
        title: 'Downtime (minutes)',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      margin: { t: 40, r: 50, b: 50, l: 60 }
    };

    Plotly.newPlot(downtimeChartRef.current, [downtimeTrace], downtimeLayout, { responsive: true });
  };

  const getMachineInfo = () => {
    if (machineData.length === 0) return null;
    const latest = machineData[machineData.length - 1];
    return {
      machineType: latest.Machine_Type,
      status: latest.Status,
      maintenance: latest.Maintenance_Status,
      location: latest.Location,
      lineName: latest.Line_Name,
      ratedPower: latest.Rated_Power_kW,
      operator: latest.Operator_Name,
      avgTemp: (machineData.reduce((sum, row) => sum + parseFloat(row.Machine_Temperature), 0) / machineData.length).toFixed(1),
      avgVibration: (machineData.reduce((sum, row) => sum + parseFloat(row.Vibration_Level), 0) / machineData.length).toFixed(1),
      avgEfficiency: (machineData.reduce((sum, row) => sum + parseFloat(row.Efficiency_Score), 0) / machineData.length).toFixed(2),
      totalDowntime: machineData.reduce((sum, row) => sum + parseFloat(row.Downtime_Minutes), 0).toFixed(0)
    };
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Normal': { variant: 'default', color: 'bg-green-500/20 text-green-400 border-green-500', icon: CheckCircle },
      'Warning': { variant: 'default', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500', icon: AlertTriangle },
      'Critical': { variant: 'default', color: 'bg-red-500/20 text-red-400 border-red-500', icon: AlertTriangle }
    };
    const config = variants[status] || variants['Normal'];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const machineInfo = getMachineInfo();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Gauge className="w-16 h-16 text-cyan-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-300 text-xl">Loading Machine Health...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Machine Health Monitor</h1>
          <p className="text-slate-400">Real-time monitoring of machine performance and condition</p>
        </div>

        {/* Machine Selector */}
        <div className="mb-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <label className="text-white font-medium">Select Machine:</label>
                <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                  <SelectTrigger className="w-[250px] bg-slate-900 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {machines.map(machine => (
                      <SelectItem key={machine} value={machine} className="text-white">{machine}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {machineInfo && (
          <>
            {/* Machine Info Card */}
            <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700 mb-8">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Machine Type</div>
                    <div className="text-lg font-semibold text-white">{machineInfo.machineType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Status</div>
                    <div>{getStatusBadge(machineInfo.status)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Maintenance</div>
                    <div className="text-lg font-semibold text-white">{machineInfo.maintenance}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Location</div>
                    <div className="text-lg font-semibold text-white">{machineInfo.location}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Production Line</div>
                    <div className="text-lg font-semibold text-white">{machineInfo.lineName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Rated Power</div>
                    <div className="text-lg font-semibold text-white">{machineInfo.ratedPower} kW</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Operator</div>
                    <div className="text-lg font-semibold text-white">{machineInfo.operator}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Avg Temperature</CardTitle>
                  <Thermometer className="w-5 h-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{machineInfo.avgTemp}°C</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Avg Vibration</CardTitle>
                  <Activity className="w-5 h-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{machineInfo.avgVibration}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Avg Efficiency</CardTitle>
                  <Gauge className="w-5 h-5 text-cyan-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{machineInfo.avgEfficiency}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Total Downtime</CardTitle>
                  <Clock className="w-5 h-5 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{machineInfo.totalDowntime} min</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <div ref={tempChartRef} className="w-full h-[300px]"></div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <div ref={vibrationChartRef} className="w-full h-[300px]"></div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <div ref={efficiencyChartRef} className="w-full h-[300px]"></div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <div ref={downtimeChartRef} className="w-full h-[300px]"></div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MachineHealth;