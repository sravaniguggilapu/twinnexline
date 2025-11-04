import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useData } from '../context/DataContext';
import Plotly from 'plotly.js-dist-min';
import { Activity, AlertTriangle, Zap, TrendingUp } from 'lucide-react';

const LineDashboard = () => {
  const { data, loading } = useData();
  const [selectedLine, setSelectedLine] = useState('All');
  const [lineData, setLineData] = useState([]);
  const [lines, setLines] = useState([]);
  
  const energyChartRef = useRef(null);
  const productionChartRef = useRef(null);
  const efficiencyChartRef = useRef(null);
  const comparisonChartRef = useRef(null);

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
      renderCharts();
    }
  }, [lineData]);

  const renderCharts = () => {
    // Energy vs Output Chart
    const energyTrace = {
      x: lineData.map((_, idx) => idx + 1),
      y: lineData.map(row => parseFloat(row.Energy_Consumed_kWh)),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Energy (kWh)',
      line: { color: '#22d3ee', width: 2 },
      marker: { size: 6 }
    };

    const productionTrace = {
      x: lineData.map((_, idx) => idx + 1),
      y: lineData.map(row => parseFloat(row.Units_Produced)),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Units Produced',
      yaxis: 'y2',
      line: { color: '#10b981', width: 2 },
      marker: { size: 6 }
    };

    const energyLayout = {
      title: {
        text: 'Energy Consumption vs Production Output',
        font: { color: '#e2e8f0', size: 18 }
      },
      paper_bgcolor: 'rgba(30, 41, 59, 0.5)',
      plot_bgcolor: 'rgba(30, 41, 59, 0.3)',
      xaxis: {
        title: 'Record Number',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      yaxis: {
        title: 'Energy (kWh)',
        gridcolor: '#334155',
        color: '#22d3ee'
      },
      yaxis2: {
        title: 'Units Produced',
        overlaying: 'y',
        side: 'right',
        gridcolor: '#334155',
        color: '#10b981'
      },
      legend: {
        font: { color: '#e2e8f0' },
        bgcolor: 'rgba(30, 41, 59, 0.8)'
      },
      margin: { t: 50, r: 80, b: 50, l: 80 }
    };

    Plotly.newPlot(energyChartRef.current, [energyTrace, productionTrace], energyLayout, { responsive: true });

    // Efficiency Trend Chart
    const efficiencyTrace = {
      x: lineData.map((_, idx) => idx + 1),
      y: lineData.map(row => parseFloat(row.Efficiency_Score)),
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      line: { color: '#22d3ee', width: 2 },
      fillcolor: 'rgba(34, 211, 238, 0.2)'
    };

    const efficiencyLayout = {
      title: {
        text: 'Efficiency Score Trend',
        font: { color: '#e2e8f0', size: 18 }
      },
      paper_bgcolor: 'rgba(30, 41, 59, 0.5)',
      plot_bgcolor: 'rgba(30, 41, 59, 0.3)',
      xaxis: {
        title: 'Record Number',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      yaxis: {
        title: 'Efficiency Score',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      margin: { t: 50, r: 50, b: 50, l: 80 }
    };

    Plotly.newPlot(efficiencyChartRef.current, [efficiencyTrace], efficiencyLayout, { responsive: true });

    // Line Comparison Chart (if All selected)
    if (selectedLine === 'All' && lines.length > 0) {
      const lineComparison = lines.map(line => {
        const lineRecords = data.filter(row => row.Line_Name === line);
        return {
          line: line,
          totalEnergy: lineRecords.reduce((sum, row) => sum + parseFloat(row.Energy_Consumed_kWh), 0),
          totalProduction: lineRecords.reduce((sum, row) => sum + parseFloat(row.Units_Produced), 0),
          avgEfficiency: lineRecords.reduce((sum, row) => sum + parseFloat(row.Efficiency_Score), 0) / lineRecords.length
        };
      });

      const energyBar = {
        x: lineComparison.map(l => l.line),
        y: lineComparison.map(l => l.totalEnergy),
        type: 'bar',
        name: 'Total Energy (kWh)',
        marker: { color: '#22d3ee' }
      };

      const productionBar = {
        x: lineComparison.map(l => l.line),
        y: lineComparison.map(l => l.totalProduction),
        type: 'bar',
        name: 'Total Production',
        marker: { color: '#10b981' }
      };

      const comparisonLayout = {
        title: {
          text: 'Production Line Comparison',
          font: { color: '#e2e8f0', size: 18 }
        },
        paper_bgcolor: 'rgba(30, 41, 59, 0.5)',
        plot_bgcolor: 'rgba(30, 41, 59, 0.3)',
        xaxis: {
          title: 'Production Line',
          gridcolor: '#334155',
          color: '#94a3b8'
        },
        yaxis: {
          title: 'Value',
          gridcolor: '#334155',
          color: '#94a3b8'
        },
        legend: {
          font: { color: '#e2e8f0' },
          bgcolor: 'rgba(30, 41, 59, 0.8)'
        },
        barmode: 'group',
        margin: { t: 50, r: 50, b: 80, l: 80 }
      };

      Plotly.newPlot(comparisonChartRef.current, [energyBar, productionBar], comparisonLayout, { responsive: true });
    }

    // Anomaly Detection Chart
    const anomalies = lineData.filter(row => row.Energy_Anomaly_Flag === 1 || row.Energy_Anomaly_Flag === '1');
    const normalData = lineData.filter(row => row.Energy_Anomaly_Flag !== 1 && row.Energy_Anomaly_Flag !== '1');

    const normalTrace = {
      x: normalData.map(row => parseFloat(row.Energy_Consumed_kWh)),
      y: normalData.map(row => parseFloat(row.Units_Produced)),
      type: 'scatter',
      mode: 'markers',
      name: 'Normal',
      marker: {
        color: '#10b981',
        size: 8,
        opacity: 0.6
      }
    };

    const anomalyTrace = {
      x: anomalies.map(row => parseFloat(row.Energy_Consumed_kWh)),
      y: anomalies.map(row => parseFloat(row.Units_Produced)),
      type: 'scatter',
      mode: 'markers',
      name: 'Anomaly',
      marker: {
        color: '#ef4444',
        size: 12,
        symbol: 'x',
        line: { width: 2 }
      }
    };

    const productionLayout = {
      title: {
        text: 'Energy Anomaly Detection',
        font: { color: '#e2e8f0', size: 18 }
      },
      paper_bgcolor: 'rgba(30, 41, 59, 0.5)',
      plot_bgcolor: 'rgba(30, 41, 59, 0.3)',
      xaxis: {
        title: 'Energy Consumed (kWh)',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      yaxis: {
        title: 'Units Produced',
        gridcolor: '#334155',
        color: '#94a3b8'
      },
      legend: {
        font: { color: '#e2e8f0' },
        bgcolor: 'rgba(30, 41, 59, 0.8)'
      },
      margin: { t: 50, r: 50, b: 50, l: 80 }
    };

    Plotly.newPlot(productionChartRef.current, [normalTrace, anomalyTrace], productionLayout, { responsive: true });
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
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div ref={energyChartRef} className="w-full h-[400px]"></div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div ref={efficiencyChartRef} className="w-full h-[350px]"></div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div ref={productionChartRef} className="w-full h-[350px]"></div>
              </CardContent>
            </Card>
          </div>

          {selectedLine === 'All' && (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div ref={comparisonChartRef} className="w-full h-[400px]"></div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineDashboard;