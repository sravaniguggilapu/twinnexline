# Quick Deployment Guide

## ✅ What You Have

A complete, working energy monitoring website:
- **5 HTML pages** (Home, Line Dashboard, Machine Health, Insights, Reports)
- **Pure HTML/CSS/JavaScript** - No build tools needed!
- **Chart.js** for interactive charts
- **Real dataset** (2,700 rows, 5 machines, 3 production lines)
- **CSV export** functionality
- **Mobile responsive** design

## 🚀 Deploy to GitHub Pages (2 Minutes)

### Method 1: Using Git Command Line

```bash
# 1. Navigate to the website folder
cd nexline-website

# 2. Initialize Git
git init

# 3. Add all files
git add .

# 4. Commit
git commit -m "Initial commit: Nexline Energy Monitor"

# 5. Create repo on GitHub (go to github.com/new)
# Name it: nexline-energy

# 6. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/nexline-energy.git
git branch -M main
git push -u origin main

# 7. Enable GitHub Pages
# Go to: Settings → Pages → Source: main branch → Save
# Your site will be live at: https://YOUR_USERNAME.github.io/nexline-energy
```

### Method 2: Upload via GitHub Website

1. Go to https://github.com/new
2. Name: `nexline-energy`
3. Click "uploading an existing file"
4. Drag and drop all files from `nexline-website` folder
5. Click "Commit changes"
6. Go to Settings → Pages
7. Source: Select "main" branch
8. Save
9. Done! Your site is live!

## 📁 Files to Upload

Make sure you upload ALL these files:

```
✅ index.html
✅ line-dashboard.html
✅ machine-health.html
✅ insights.html
✅ reports.html
✅ README.md
✅ assets/css/style.css
✅ assets/js/data-loader.js
✅ assets/js/home.js
✅ assets/js/line-dashboard.js
✅ assets/js/machine-health.js
✅ assets/js/insights.js
✅ assets/js/reports.js
✅ assets/data/complete_energy_dataset_2700.xlsx
```

## 🧪 Test Locally First

```bash
# Option 1: Python
cd nexline-website
python3 -m http.server 8000
# Open: http://localhost:8000

# Option 2: Node.js
npx http-server
# Open: http://localhost:8080

# Option 3: Just double-click index.html
# (Works but Excel loading might have CORS issues)
```

## 🎨 Customize

### Change Colors

Edit `assets/css/style.css`:

```css
/* Line 8-9: Main gradient background */
background: linear-gradient(135deg, #1e3a5f 0%, #0f2027 100%);

/* Line 50: Primary color (cyan) */
color: #00d4ff;

/* Line 74: Secondary color (green) */
color: #00ff88;
```

### Update Company Name

Search and replace "Nexline" with your company name in all HTML files.

### Replace Dataset

1. Replace `assets/data/complete_energy_dataset_2700.xlsx`
2. Keep these column names:
   - Energy_Consumed_kWh
   - Units_Produced
   - Efficiency_Score
   - Machine_Temperature
   - Vibration_Level
   - CO2_Emission_kg
   - Line_Name
   - Machine_ID
   - Status

## 📊 Current Data Summary

- **Total Energy**: 135,972 kWh
- **Production**: 808,624 units
- **Efficiency**: 6.11 average
- **Machines**: 5 (CNC_01 through CNC_05)
- **Lines**: 3 (Line_A, Line_B, Line_C)
- **Anomalies**: 55 detected
- **CO₂**: 8,974 kg

## 🔧 Troubleshooting

### Charts not showing
- Check browser console (F12)
- Make sure Chart.js CDN is loading
- Test on http://localhost instead of file://

### Data not loading
- Check `assets/data/` folder has Excel file
- Check filename matches in `data-loader.js` line 6
- Try different browser

### GitHub Pages not working
- Wait 2-3 minutes after enabling
- Check Settings → Pages shows green checkmark
- Clear browser cache

## 📱 Mobile Support

The website is fully responsive:
- ✅ Works on phones
- ✅ Works on tablets
- ✅ Works on desktop
- ✅ Charts resize automatically

## 🌐 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported

## 📝 License

Free to use for any purpose. No attribution required.

## 🆘 Need Help?

- Check README.md for detailed docs
- Open issue on GitHub
- All code is commented for easy understanding

---

**That's it! Your website is ready to deploy! 🎉**
