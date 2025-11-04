# Nexline Energy Efficiency Monitoring Website

Simple, clean HTML/CSS/JavaScript website for monitoring energy efficiency in manufacturing.

## Features

- **Home**: Overview dashboard with KPIs and line comparison
- **Line Dashboard**: Detailed energy vs production analysis
- **Machine Health**: Individual machine monitoring (5 machines)
- **Insights**: AI-powered recommendations
- **Reports**: Comprehensive reports with CSV export

## Tech Stack

- Pure HTML5/CSS3/JavaScript
- Chart.js for visualizations
- XLSX.js for Excel data loading
- No frameworks, no build step required

## Deployment to GitHub Pages

### Quick Setup

1. **Create a new GitHub repository**
   ```bash
   # Initialize git
   cd nexline-website
   git init
   git add .
   git commit -m "Initial commit: Energy monitoring website"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/nexline-energy.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages
   - Source: Select "main" branch
   - Root: Select "/ (root)"
   - Click Save
   - Your site will be live at: `https://YOUR_USERNAME.github.io/nexline-energy/`

### Alternative: Direct Upload

1. Go to GitHub.com
2. Create new repository named "nexline-energy"
3. Upload all files from the nexline-website folder
4. Enable GitHub Pages in Settings

## Local Testing

Simply open `index.html` in your browser. No server required!

For better testing with a local server:

```bash
# Python 3
python -m http.server 8000

# Or Node.js
npx http-server

# Then open http://localhost:8000
```

## File Structure

```
nexline-website/
\u251c\u2500\u2500 index.html              # Home page
\u251c\u2500\u2500 line-dashboard.html     # Line analytics
\u251c\u2500\u2500 machine-health.html     # Machine monitoring
\u251c\u2500\u2500 insights.html           # AI insights
\u251c\u2500\u2500 reports.html            # Reports & export
\u251c\u2500\u2500 assets/
\u2502   \u251c\u2500\u2500 css/
\u2502   \u2502   \u2514\u2500\u2500 style.css        # All styles
\u2502   \u251c\u2500\u2500 js/
\u2502   \u2502   \u251c\u2500\u2500 data-loader.js   # Data functions
\u2502   \u2502   \u251c\u2500\u2500 home.js          # Home page logic
\u2502   \u2502   \u251c\u2500\u2500 line-dashboard.js
\u2502   \u2502   \u251c\u2500\u2500 machine-health.js
\u2502   \u2502   \u251c\u2500\u2500 insights.js
\u2502   \u2502   \u2514\u2500\u2500 reports.js\n\u2502   \u2514\u2500\u2500 data/\n\u2502       \u2514\u2500\u2500 complete_energy_dataset_2700.xlsx\n\u2514\u2500\u2500 README.md\n```\n\n## Data\n\n- **Records**: 2,700 rows\n- **Machines**: 5 (CNC_01 to CNC_05)\n- **Production Lines**: 3 (Line_A, Line_B, Line_C)\n- **Metrics**: Energy, Production, Efficiency, Temperature, Vibration, CO\u2082\n\n## Customization\n\n### Change Colors\n\nEdit `assets/css/style.css`:\n\n```css\n/* Primary color (currently cyan) */\n--primary-color: #00d4ff;\n\n/* Secondary color (currently green) */\n--secondary-color: #00ff88;\n```\n\n### Update Data\n\nReplace `assets/data/complete_energy_dataset_2700.xlsx` with your own Excel file.\n\nMake sure it has these columns:\n- Energy_Consumed_kWh\n- Units_Produced\n- Efficiency_Score\n- Machine_Temperature\n- Vibration_Level\n- CO2_Emission_kg\n- Line_Name\n- Machine_ID\n\n## Browser Compatibility\n\n- Chrome/Edge: ✅\n- Firefox: ✅\n- Safari: ✅\n- Mobile browsers: ✅\n\n## License\n\nMIT License - Free to use for any purpose\n\n## Support\n\nFor issues or questions, please open a GitHub issue.\n\n---\n\n**Built with pure HTML/CSS/JavaScript - No frameworks required!**\n