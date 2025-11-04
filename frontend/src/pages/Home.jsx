import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Activity, Zap, TrendingUp, Leaf, ArrowRight, Factory, Gauge, AlertTriangle } from 'lucide-react';
import { useData } from '../context/DataContext';

const Home = () => {
  const { data, loading } = useData();
  const [stats, setStats] = useState({
    totalEnergy: 0,
    totalProduction: 0,
    avgEfficiency: 0,
    co2Saved: 0,
    anomalyCount: 0,
    criticalMachines: 0
  });

  const [animatedStats, setAnimatedStats] = useState({
    totalEnergy: 0,
    totalProduction: 0,
    avgEfficiency: 0,
    co2Saved: 0
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const totalEnergy = data.reduce((sum, row) => sum + (parseFloat(row.Energy_Consumed_kWh) || 0), 0);
      const totalProduction = data.reduce((sum, row) => sum + (parseFloat(row.Units_Produced) || 0), 0);
      const avgEfficiency = data.reduce((sum, row) => sum + (parseFloat(row.Efficiency_Score) || 0), 0) / data.length;
      const co2Saved = data.reduce((sum, row) => sum + (parseFloat(row.CO2_Emission_kg) || 0), 0);
      const anomalyCount = data.filter(row => row.Energy_Anomaly_Flag === 1 || row.Energy_Anomaly_Flag === '1').length;
      const criticalMachines = data.filter(row => row.Status === 'Critical').length;

      setStats({
        totalEnergy: Math.round(totalEnergy),
        totalProduction: Math.round(totalProduction),
        avgEfficiency: avgEfficiency.toFixed(2),
        co2Saved: Math.round(co2Saved),
        anomalyCount,
        criticalMachines
      });
    }
  }, [data]);

  // Animate numbers
  useEffect(() => {
    if (stats.totalEnergy > 0) {
      const duration = 2000;
      const steps = 60;
      const increment = {
        energy: stats.totalEnergy / steps,
        production: stats.totalProduction / steps,
        efficiency: stats.avgEfficiency / steps,
        co2: stats.co2Saved / steps
      };

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        setAnimatedStats({
          totalEnergy: Math.min(Math.round(increment.energy * currentStep), stats.totalEnergy),
          totalProduction: Math.min(Math.round(increment.production * currentStep), stats.totalProduction),
          avgEfficiency: Math.min((increment.efficiency * currentStep), parseFloat(stats.avgEfficiency)).toFixed(2),
          co2Saved: Math.min(Math.round(increment.co2 * currentStep), stats.co2Saved)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [stats]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbWFjaGluZXJ5fGVufDB8fHx8MTc2MjI3ODMyM3ww&ixlib=rb-4.1.0&q=85')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Factory className="w-12 h-12 text-cyan-400" />
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Nexline Manufacturing
              </h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-cyan-400 mb-6">
              Energy Efficiency Monitoring System
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Real-time digital twin monitoring for smart manufacturing. Track energy consumption, 
              optimize production efficiency, and reduce environmental impact through advanced data analytics.
            </p>
            <div className="flex gap-4">
              <Link to="/line-dashboard">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg">
                  View Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/insights">
                <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-8 py-6 text-lg">
                  View Insights
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="container mx-auto px-6 -mt-24 relative z-20 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Energy Consumed</CardTitle>
              <Zap className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {animatedStats.totalEnergy.toLocaleString()}
                <span className="text-lg text-slate-400 ml-2">kWh</span>
              </div>
              <p className="text-xs text-slate-500">Across all production lines</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Units Produced</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {animatedStats.totalProduction.toLocaleString()}
                <span className="text-lg text-slate-400 ml-2">units</span>
              </div>
              <p className="text-xs text-slate-500">Total production output</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Avg Efficiency Score</CardTitle>
              <Gauge className="w-5 h-5 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {animatedStats.avgEfficiency}
                <span className="text-lg text-slate-400 ml-2">/ 1.0</span>
              </div>
              <p className="text-xs text-slate-500">Overall system efficiency</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">CO₂ Emissions</CardTitle>
              <Leaf className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {animatedStats.co2Saved.toLocaleString()}
                <span className="text-lg text-slate-400 ml-2">kg</span>
              </div>
              <p className="text-xs text-slate-500">Carbon footprint tracking</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Digital Twin Concept Section */}
      <div className="container mx-auto px-6 mb-16">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Digital Twin Technology</h3>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  Our advanced digital twin system creates a virtual replica of your manufacturing facility, 
                  enabling real-time monitoring, predictive analytics, and optimization of energy consumption.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  By simulating and analyzing synthetic factory data, we provide actionable insights to improve 
                  production efficiency, reduce energy waste, and minimize environmental impact.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                  <Activity className="w-8 h-8 text-cyan-400 mb-3" />
                  <h4 className="text-white font-semibold mb-2">Real-time Monitoring</h4>
                  <p className="text-sm text-slate-400">Live data from all production lines</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 mb-3" />
                  <h4 className="text-white font-semibold mb-2">Anomaly Detection</h4>
                  <p className="text-sm text-slate-400">{stats.anomalyCount} energy anomalies detected</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                  <Gauge className="w-8 h-8 text-green-500 mb-3" />
                  <h4 className="text-white font-semibold mb-2">Performance Metrics</h4>
                  <p className="text-sm text-slate-400">Comprehensive efficiency tracking</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                  <TrendingUp className="w-8 h-8 text-cyan-400 mb-3" />
                  <h4 className="text-white font-semibold mb-2">Predictive Analytics</h4>
                  <p className="text-sm text-slate-400">{stats.criticalMachines} machines need attention</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation */}
      <div className="container mx-auto px-6 pb-16">
        <h3 className="text-3xl font-bold text-white mb-8 text-center">Explore Dashboard Modules</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/line-dashboard" className="group">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 h-full">
              <CardContent className="p-6">
                <Activity className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-semibold text-white mb-2">Line Dashboard</h4>
                <p className="text-slate-400 mb-4">
                  Compare energy usage and production output across all production lines with interactive charts.
                </p>
                <div className="flex items-center text-cyan-400 group-hover:translate-x-2 transition-transform">
                  <span>View Dashboard</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/machine-health" className="group">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 h-full">
              <CardContent className="p-6">
                <Gauge className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-semibold text-white mb-2">Machine Health</h4>
                <p className="text-slate-400 mb-4">
                  Monitor individual machine performance, temperature, vibration, and maintenance status.
                </p>
                <div className="flex items-center text-green-400 group-hover:translate-x-2 transition-transform">
                  <span>Check Health</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/insights" className="group">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 h-full">
              <CardContent className="p-6">
                <TrendingUp className="w-12 h-12 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-semibold text-white mb-2">AI Insights</h4>
                <p className="text-slate-400 mb-4">
                  Get automated recommendations and insights based on real-time data analysis.
                </p>
                <div className="flex items-center text-yellow-400 group-hover:translate-x-2 transition-transform">
                  <span>View Insights</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;