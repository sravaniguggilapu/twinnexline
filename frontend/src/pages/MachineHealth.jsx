import React, { useEffect, useState } from 'react';
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
      prepareChartData();
    }
  }, [machineData]);

  const prepareChartData = () => {
    // Use more data points for detailed machine analysis
    const step = Math.max(1, Math.floor(machineData.length / 150));
    const sampledData = machineData.filter((_, idx) => idx % step === 0);

    // Temperature data
    const tempData = sampledData.map((row, idx) => ({
      record: idx + 1,
      machineTemp: parseFloat(row.Machine_Temperature),
      ambientTemp: parseFloat(row.Ambient_Temperature)
    }));

    // Vibration data with color coding
    const vibrationData = sampledData.map((row, idx) => {
      const vib = parseFloat(row.Vibration_Level);
      return {
        record: idx + 1,
        vibration: vib,
        fill: vib > 20 ? '#ef4444' : vib > 10 ? '#f59e0b' : '#10b981'
      };
    });

    // Efficiency data
    const efficiencyData = sampledData.map((row, idx) => ({
      record: idx + 1,
      efficiency: parseFloat(row.Efficiency_Score)
    }));

    // Downtime data
    const downtimeData = sampledData.map((row, idx) => ({
      record: idx + 1,
      downtime: parseFloat(row.Downtime_Minutes)
    }));

    setChartData({
      temp: tempData,
      vibration: vibrationData,
      efficiency: efficiencyData,
      downtime: downtimeData
    });
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
                  <h3 className="text-lg font-semibold text-white mb-4">Temperature Monitoring</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.temp}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="record" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      <Legend />
                      <Line type="monotone" dataKey="machineTemp" stroke="#ef4444" name="Machine Temp" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="ambientTemp" stroke="#94a3b8" name="Ambient Temp" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Vibration Level Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.vibration}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="record" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      <Bar dataKey="vibration" name="Vibration Level">
                        {chartData.vibration.map((entry, index) => (
                          <Bar key={`bar-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Efficiency Score Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData.efficiency}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="record" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="efficiency" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} name="Efficiency Score" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Downtime Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="record" stroke="#94a3b8" />
                      <YAxis dataKey="downtime" stroke="#94a3b8" label={{ value: 'Downtime (min)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      <Scatter data={chartData.downtime} fill="#f59e0b" name="Downtime" />
                    </ScatterChart>
                  </ResponsiveContainer>
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