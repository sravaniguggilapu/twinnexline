const loadDataset = async () => {
  try {
    setLoading(true);
    const excelPath = `${process.env.PUBLIC_URL}/data/complete_energy_dataset_2700.xlsx`;
    console.log("Loading dataset from:", excelPath);

    const response = await fetch(excelPath);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    setData(jsonData);
    setLoading(false);
  } catch (err) {
    console.error('Error loading dataset:', err);
    setError(err.message);
    setLoading(false);
  }
};
