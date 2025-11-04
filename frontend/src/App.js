import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import LineDashboard from "./pages/LineDashboard";
import MachineHealth from "./pages/MachineHealth";
import Insights from "./pages/Insights";
import Reports from "./pages/Reports";

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/line-dashboard" element={<LineDashboard />} />
            <Route path="/machine-health" element={<MachineHealth />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
