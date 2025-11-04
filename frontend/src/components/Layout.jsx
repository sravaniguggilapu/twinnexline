import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Factory, Activity, Gauge, TrendingUp, FileText, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Layout = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Factory },
    { path: '/line-dashboard', label: 'Line Dashboard', icon: Activity },
    { path: '/machine-health', label: 'Machine Health', icon: Gauge },
    { path: '/insights', label: 'Insights', icon: TrendingUp },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <Factory className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="text-xl font-bold text-white">Nexline Energy Monitor</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-2 ${
                        isActive(item.path)
                          ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-800">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start flex items-center gap-3 mb-1 ${
                        isActive(item.path)
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Factory className="w-6 h-6 text-cyan-400" />
                <span className="text-lg font-semibold text-white">Nexline Manufacturing</span>
              </div>
              <p className="text-slate-400 text-sm">
                Advanced energy efficiency monitoring for smart manufacturing facilities.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {navItems.slice(1).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block text-slate-400 hover:text-cyan-400 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <p className="text-slate-400 text-sm mb-4">
                Digital twin technology for real-time monitoring and optimization of manufacturing operations.
              </p>
              <a 
                href="https://emergent.sh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
              >
                <span>Made with</span>
                <span className="font-bold">Emergent</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-6 text-center">
            <p className="text-slate-500 text-sm">
              © 2024 Nexline Manufacturing. Energy Efficiency Monitoring System.
            </p>
            <p className="text-slate-600 text-xs mt-2">
              Built with React + FastAPI • Powered by Digital Twin Technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;