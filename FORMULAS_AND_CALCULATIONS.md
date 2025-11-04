# Energy Efficiency Monitoring System - Formulas & Calculations

## Overview
This document explains all the mathematical formulas and calculations used throughout the Energy Efficiency Monitoring System for Nexline Manufacturing.

---

## 1. Key Performance Indicators (KPIs)

### 1.1 Total Energy Consumed
```
Total Energy (kWh) = Σ Energy_Consumed_kWh[i]
where i = all records in the dataset
```
**Purpose**: Aggregate total energy consumption across all production lines and machines.

### 1.2 Total Units Produced
```
Total Production = Σ Units_Produced[i]
where i = all records in the dataset
```
**Purpose**: Total manufacturing output across all operations.

### 1.3 Average Efficiency Score
```
Average Efficiency = (Σ Efficiency_Score[i]) / n
where:
  - i = all records in the dataset
  - n = total number of records
  - Efficiency_Score is a ratio metric (typically 2.4 to 12.3)
```
**Note**: Efficiency scores represent the ratio of output to input energy. Higher values indicate better efficiency.

**Current Dataset Range**:
- Minimum: 2.44
- Maximum: 12.31
- Average: 6.11

### 1.4 Total CO₂ Emissions
```
Total CO₂ (kg) = Σ CO2_Emission_kg[i]
where i = all records in the dataset
```
**Purpose**: Environmental impact tracking.

---

## 2. Production Line Metrics

### 2.1 Energy per Unit (Line Level)
```
Energy_per_Unit = Total_Energy_Consumed / Total_Units_Produced

where:
  Total_Energy_Consumed = Σ Energy_Consumed_kWh for specific line
  Total_Units_Produced = Σ Units_Produced for specific line
```
**Purpose**: Measures energy efficiency at the production line level. Lower values indicate better efficiency.

### 2.2 Line Utilization
```
Line_Utilization (%) = (Actual_Production_Time / Available_Time) × 100

Derived from: Line_Utilization_Percent column in dataset
```

### 2.3 Line Efficiency
```
Line_Efficiency = (Σ Efficiency_Score[i]) / n
where:
  - i = all records for specific production line
  - n = number of records for that line
```

---

## 3. Machine Health Metrics

### 3.1 Average Machine Temperature
```
Avg_Machine_Temp (°C) = (Σ Machine_Temperature[i]) / n
where:
  - i = all records for specific machine
  - n = number of records for that machine
```
**Threshold Alert**: Temperature > 50°C triggers high temperature warning.

### 3.2 Average Vibration Level
```
Avg_Vibration = (Σ Vibration_Level[i]) / n
where:
  - i = all records for specific machine
  - n = number of records for that machine
```
**Classification**:
- Vibration > 20: Critical (Red)
- Vibration 10-20: Warning (Orange)
- Vibration < 10: Normal (Green)

### 3.3 Total Downtime
```
Total_Downtime (minutes) = Σ Downtime_Minutes[i]
where i = all records for specific machine
```
**Threshold Alert**: Total downtime > 100 minutes triggers excessive downtime warning.

### 3.4 Machine Efficiency
```
Machine_Efficiency = (Σ Efficiency_Score[i]) / n
where:
  - i = all records for specific machine
  - n = number of records for that machine
```

---

## 4. Energy Anomaly Detection

### 4.1 Anomaly Count
```
Anomaly_Count = COUNT(records where Energy_Anomaly_Flag = 1)
```
**Purpose**: Identifies unusual energy consumption patterns that may indicate equipment issues.

### 4.2 Anomaly Rate
```
Anomaly_Rate (%) = (Anomaly_Count / Total_Records) × 100
```

---

## 5. Insights & Recommendations Logic

### 5.1 High Energy Consumption Detection
```
IF (Avg_Energy_per_Unit > 10 kWh/unit) THEN
  Classification: "High Energy Consumption"
  Severity: Warning
```

### 5.2 Low Efficiency Detection
```
IF (Avg_Efficiency < 0.85) THEN
  Classification: "Low Efficiency"
  Severity: Warning
```

### 5.3 Critical Machine Detection
```
IF (Machine_Status = "Critical") THEN
  Classification: "Critical Machine"
  Severity: Critical
  Action: "Immediate inspection required"
```

### 5.4 High Temperature Detection
```
IF (Avg_Machine_Temperature > 50°C) THEN
  Classification: "High Operating Temperature"
  Severity: Warning
  Recommendation: "Check cooling systems"
```

### 5.5 High Vibration Detection
```
IF (Avg_Vibration > 15) THEN
  Classification: "Excessive Vibration"
  Severity: Warning
  Recommendation: "Perform vibration analysis"
```

---

## 6. Cost Calculations

### 6.1 Total Energy Cost
```
Total_Energy_Cost (USD) = Σ Energy_Cost_USD[i]
where i = all records in the dataset
```

### 6.2 Cost per Unit
```
Cost_per_Unit = Total_Energy_Cost / Total_Units_Produced
```

---

## 7. Reporting Metrics

### 7.1 Top Inefficiency Sources
Sorted by:
```
1. Energy_per_Unit (descending)
2. Efficiency_Score (ascending)
3. Total_Downtime (descending)
```

### 7.2 Potential Savings Estimates
```
Energy_Optimization_Savings = Current_Energy_Cost × 0.15 to 0.20
(Estimated 15-20% reduction through optimization)

Downtime_Reduction_Savings = (Downtime_Minutes / Total_Minutes) × Production_Value × 0.30
(Estimated 30% reduction in downtime)
```

---

## 8. Data Normalization

### 8.1 Efficiency Score Normalization
All efficiency scores are normalized to ensure they fall within [0, 1] range:
```javascript
Normalized_Score = Math.min(parseFloat(Raw_Score), 1.0)
```

### 8.2 Chart Data Sampling
For performance optimization, charts use intelligent sampling:
```javascript
// Sample size calculation
step = Math.max(1, Math.floor(dataLength / targetPoints))

// Where targetPoints:
// - Line Dashboard: 200 points
// - Machine Health: 150 points
// - Anomaly Detection: All data (no sampling)
```

---

## 9. Statistical Aggregations

### 9.1 Power Factor Average
```
Avg_Power_Factor = (Σ Power_Factor[i]) / n
where:
  - i = all records in the dataset
  - n = total number of records
```
**Optimization Threshold**: If Avg_Power_Factor < 3.0, recommend power factor correction.

### 9.2 Line Comparison Metrics
```
For each production line:
  Total_Energy = Σ Energy_Consumed_kWh
  Total_Production = Σ Units_Produced
  Avg_Efficiency = (Σ Efficiency_Score) / n
  Energy_per_Unit = Total_Energy / Total_Production
```

---

## 10. Real-Time Calculations

All calculations are performed client-side in JavaScript for real-time updates:

```javascript
// Example: Calculating total energy
const totalEnergy = data.reduce((sum, row) => 
  sum + parseFloat(row.Energy_Consumed_kWh), 0
);

// Example: Calculating average efficiency
const avgEfficiency = data.reduce((sum, row) => 
  sum + parseFloat(row.Efficiency_Score), 0
) / data.length;
```

---

## 11. Data Integrity

### 11.1 Missing Data Handling
```javascript
// Safe parsing with fallback to 0
const value = parseFloat(row.field) || 0;
```

### 11.2 Validation Rules
- Efficiency Score: 0 ≤ score ≤ 1.0
- Energy Consumed: value ≥ 0
- Units Produced: value ≥ 0
- Temperature: value > 0
- Vibration Level: value ≥ 0

---

## Notes

1. **All monetary values are in USD**
2. **All energy values are in kWh (kilowatt-hours)**
3. **All temperature values are in Celsius (°C)**
4. **All time values are in minutes**
5. **All mass values (CO₂) are in kilograms (kg)**
6. **Efficiency scores are dimensionless ratios between 0 and 1**

---

## Implementation Files

- **DataContext.jsx**: Data loading and normalization
- **Home.jsx**: Overall KPI calculations
- **LineDashboard.jsx**: Line-level metrics and comparisons
- **MachineHealth.jsx**: Machine-specific calculations
- **Insights.jsx**: Anomaly detection and recommendation logic
- **Reports.jsx**: Comprehensive reporting and export
