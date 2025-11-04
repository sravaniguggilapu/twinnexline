import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useData } from '../context/DataContext';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity, AlertTriangle, Zap, TrendingUp } from 'lucide-react';

const LineDashboard = () => {
  const { data, loading } = useData();
  const [selectedLine, setSelectedLine] = useState('All');
  const [lineData, setLineData] = useState([]);
  const [lines, setLines] = useState([]);
  const [chartData, setChartData] = useState({ energy: [], comparison: [], anomaly: [] });

  useEffect(() => {
    if (data && data.length > 0) {
      const uniqueLines = [...new Set(data.map(row => row.Line_Name))];
      setLines(uniqueLines);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.length > 0) {
      const filteredData = selectedLine === 'All' 
        ? data 
        : data.filter(row => row.Line_Name === selectedLine);
      setLineData(filteredData);
    }
  }, [data, selectedLine]);

  useEffect(() => {
    if (lineData.length > 0) {
      prepareChartData();
    }
  }, [lineData]);

  const prepareChartData = () => {
    // Energy vs Output data - use more data points (sample every 10-20 records)
    const step = Math.max(1, Math.floor(lineData.length / 200));
    const energyData = lineData
      .filter((_, idx) => idx % step === 0)
      .map((row, idx) => ({
        record: idx + 1,
        energy: parseFloat(row.Energy_Consumed_kWh),
        production: parseFloat(row.Units_Produced),
        efficiency: parseFloat(row.Efficiency_Score)
      }));

    // Line comparison
    let comparisonData = [];
    if (selectedLine === 'All' && lines.length > 0) {
      comparisonData = lines.map(line => {
        const lineRecords = data.filter(row => row.Line_Name === line);
        return {
          line,
          totalEnergy: lineRecords.reduce((sum, row) => sum + parseFloat(row.Energy_Consumed_kWh), 0),
          totalProduction: lineRecords.reduce((sum, row) => sum + parseFloat(row.Units_Produced), 0)
        };
      });
    }

    // Anomaly data - sample for performance
    const anomalyData = lineData
      .filter((_, idx) => idx % step === 0)
      .map((row) => ({
        energy: parseFloat(row.Energy_Consumed_kWh),
        production: parseFloat(row.Units_Produced),
        isAnomaly: row.Energy_Anomaly_Flag === 1 || row.Energy_Anomaly_Flag === '1'
      }));

    setChartData({ energy: energyData, comparison: comparisonData, anomaly: anomalyData });
  };

  const getLineStats = () => {
    if (lineData.length === 0) return { totalEnergy: 0, totalProduction: 0, avgEfficiency: 0, anomalyCount: 0 };
    
    return {
      totalEnergy: Math.round(lineData.reduce((sum, row) => sum + parseFloat(row.Energy_Consumed_kWh), 0)),
      totalProduction: Math.round(lineData.reduce((sum, row) => sum + parseFloat(row.Units_Produced), 0)),
      avgEfficiency: (lineData.reduce((sum, row) => sum + parseFloat(row.Efficiency_Score), 0) / lineData.length).toFixed(2),
      anomalyCount: lineData.filter(row => row.Energy_Anomaly_Flag === 1 || row.Energy_Anomaly_Flag === '1').length
    };
  };

  const stats = getLineStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-cyan-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-300 text-xl">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Production Line Dashboard</h1>
          <p className="text-slate-400">Monitor energy consumption and production output across all lines</p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <label className="text-white font-medium">Filter by Production Line:</label>
                <Select value={selectedLine} onValueChange={setSelectedLine}>
                  <SelectTrigger className="w-[200px] bg-slate-900 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="All" className="text-white">All Lines</SelectItem>
                    {lines.map(line => (
                      <SelectItem key={line} value={line} className="text-white">{line}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Energy</CardTitle>
              <Zap className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalEnergy.toLocaleString()} kWh</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Production</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalProduction.toLocaleString()} units</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Avg Efficiency</CardTitle>
              <Activity className="w-5 h-5 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.avgEfficiency}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Anomalies</CardTitle>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.anomalyCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {/* Energy vs Production */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Energy Consumption vs Production Output</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData.energy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="record" stroke="#94a3b8" label={{ value: 'Record Number', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                  <YAxis yAxisId="left" stroke="#22d3ee" label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft', fill: '#22d3ee' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'Units Produced', angle: 90, position: 'insideRight', fill: '#10b981' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="energy" stroke="#22d3ee" name="Energy (kWh)" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="production" stroke="#10b981" name="Units Produced" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Efficiency and Anomaly */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Efficiency Score Trend</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={chartData.energy}>
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
                <h3 className="text-xl font-semibold text-white mb-4">Energy Anomaly Detection</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="energy" stroke="#94a3b8" label={{ value: 'Energy (kWh)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                    <YAxis dataKey="production" stroke="#94a3b8" label={{ value: 'Units Produced', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Normal" data={chartData.anomaly.filter(d => !d.isAnomaly)} fill="#10b981" />
                    <Scatter name="Anomaly" data={chartData.anomaly.filter(d => d.isAnomaly)} fill="#ef4444" shape="cross" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Line Comparison */}
          {selectedLine === 'All' && chartData.comparison.length > 0 && (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Production Line Comparison</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData.comparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="line" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="totalEnergy" fill="#22d3ee" name="Total Energy (kWh)" />
                    <Bar dataKey="totalProduction" fill="#10b981" name="Total Production" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineDashboard;