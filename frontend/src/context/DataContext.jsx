import React, { createContext, useContext, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDataset();
  }, []);

  const loadDataset = async () => {
    try {
      setLoading(true);

      // ✅ Use correct relative path for GitHub Pages + local dev
      const excelPath = `${process.env.PUBLIC_URL}/data/complete_energy_dataset_2700.xlsx`;
      console.log("📊 Loading Excel dataset from:", excelPath);

      const response = await fetch(excelPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch dataset: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log("✅ Dataset loaded successfully:", jsonData.length, "rows");
      setData(jsonData);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error loading dataset:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const uploadFile = async (file) => {
    try {
      setLoading(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("📁 File uploaded successfully:", jsonData.length, "rows");
        setData(jsonData);
        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('❌ Error uploading file:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider value={{ data, loading, error, uploadFile }}>
      {loading && (
        <div
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            color: '#007bff',
            fontSize: '18px',
            fontWeight: '500'
          }}
        >
          ⏳ Loading dataset...
        </div>
      )}
      {error && (
        <div
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            color: 'red',
            fontWeight: '500'
          }}
        >
          ⚠️ Error loading dataset: {error}
        </div>
      )}
      {!loading && !error && children}
    </DataContext.Provider>
  );
};

export default DataContext;
