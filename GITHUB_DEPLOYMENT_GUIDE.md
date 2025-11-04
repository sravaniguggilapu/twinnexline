# GitHub Deployment Guide - Energy Efficiency Monitoring System

## Overview
This guide will help you deploy the Nexline Energy Efficiency Monitoring System to GitHub and host it on GitHub Pages or other platforms.

---

## Prerequisites

- Git installed on your system
- GitHub account
- Node.js and Yarn installed

---

## Part 1: Preparing the Project for GitHub

### Step 1: Clean and Organize Project Structure

First, ensure your project has the following structure:

```
nexline-energy-monitor/
├── frontend/
│   ├── public/
│   │   └── data/
│   │       └── complete_energy_dataset_2700.xlsx
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   ├── package.json
│   └── .env
├── backend/  (optional - for future API integration)
├── README.md
├── FORMULAS_AND_CALCULATIONS.md
└── .gitignore
```

### Step 2: Create Essential Files

#### Create `.gitignore` in the root directory:

```gitignore
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# System Files
Thumbs.db
```

#### Create `README.md` in the root directory:

```markdown
# Nexline Energy Efficiency Monitoring System

A professional energy efficiency monitoring dashboard for smart manufacturing facilities.

## Features

- 📊 Real-time energy consumption tracking
- 🏭 Production line performance monitoring
- 🔧 Machine health analytics
- 💡 AI-powered insights and recommendations
- 📈 Interactive data visualizations
- 📄 Comprehensive reporting with CSV export

## Tech Stack

- **Frontend**: React 19, Recharts, TailwindCSS, Shadcn UI
- **Data Processing**: XLSX.js for client-side Excel parsing
- **Backend**: FastAPI (optional)
- **Database**: MongoDB (optional)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nexline-energy-monitor.git
   cd nexline-energy-monitor
   ```

2. Install dependencies:
   ```bash
   cd frontend
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```

4. Open http://localhost:3000 in your browser

## Dataset

The system uses a 2,700-row Excel dataset with 28 columns including:
- Machine_ID, Line_Name, DateTime
- Energy_Consumed_kWh, Units_Produced
- Efficiency_Score, Temperature, Vibration_Level
- CO2_Emission_kg, Risk_Score, Anomaly_Flag

## Documentation

- [Formulas & Calculations](FORMULAS_AND_CALCULATIONS.md)
- [Deployment Guide](GITHUB_DEPLOYMENT_GUIDE.md)

## Built With

Made with [Emergent](https://emergent.sh) - AI-powered development platform

## License

MIT License - feel free to use this project for learning and development
```

---

## Part 2: Initialize Git Repository

### Step 1: Initialize Git

```bash
cd /path/to/your/project
git init
```

### Step 2: Add Files

```bash
git add .
```

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Nexline Energy Efficiency Monitoring System"
```

---

## Part 3: Push to GitHub

### Step 1: Create a New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `nexline-energy-monitor` (or your preferred name)
3. Description: "Energy Efficiency Monitoring Dashboard for Smart Manufacturing"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Connect Local Repository to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/nexline-energy-monitor.git
git branch -M main
git push -u origin main
```

---

## Part 4: Deployment Options

### Option 1: Deploy to GitHub Pages

#### Step 1: Update package.json

Add homepage field to `frontend/package.json`:

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "homepage": "https://YOUR_USERNAME.github.io/nexline-energy-monitor",
  ...
}
```

#### Step 2: Install gh-pages

```bash
cd frontend
yarn add -D gh-pages
```

#### Step 3: Add Deployment Scripts

Update `frontend/package.json` scripts:

```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "predeploy": "yarn build",
    "deploy": "gh-pages -d build"
  }
}
```

#### Step 4: Deploy

```bash
yarn deploy
```

#### Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Source: Select "gh-pages" branch
4. Click "Save"
5. Your site will be live at: `https://YOUR_USERNAME.github.io/nexline-energy-monitor`

---

### Option 2: Deploy to Vercel

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Deploy

```bash
cd frontend
vercel
```

Follow the prompts:
- Set up and deploy: Yes
- Which scope: Select your account
- Link to existing project: No
- Project name: nexline-energy-monitor
- Directory: ./
- Override settings: No

#### Step 3: Production Deployment

```bash
vercel --prod
```

Your site will be live at: `https://nexline-energy-monitor.vercel.app`

---

### Option 3: Deploy to Netlify

#### Step 1: Create `netlify.toml` in frontend directory

```toml
[build]
  base = "frontend"
  command = "yarn build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Deploy via Netlify CLI

```bash
npm install -g netlify-cli
cd frontend
netlify deploy
```

Follow the prompts:
- Create & configure a new site
- Team: Select your team
- Site name: nexline-energy-monitor
- Publish directory: build

#### Step 3: Production Deployment

```bash
netlify deploy --prod
```

#### Step 4: Or Deploy via Netlify Website

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repository
5. Build settings:
   - Base directory: `frontend`
   - Build command: `yarn build`
   - Publish directory: `frontend/build`
6. Click "Deploy site"

---

## Part 5: Environment Variables

### For GitHub Pages

Update `frontend/.env`:

```env
REACT_APP_BACKEND_URL=https://your-api-endpoint.com
# Or leave empty for client-side only
```

### For Vercel

Add environment variables in Vercel dashboard:
1. Go to Project Settings
2. Environment Variables
3. Add: `REACT_APP_BACKEND_URL`

### For Netlify

Add environment variables in Netlify dashboard:
1. Site settings → Build & deploy → Environment
2. Add variable: `REACT_APP_BACKEND_URL`

---

## Part 6: Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd frontend
        yarn install
        
    - name: Build
      run: |
        cd frontend
        yarn build
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./frontend/build
```

Now every push to main branch will automatically deploy!

---

## Part 7: Custom Domain (Optional)

### For GitHub Pages

1. Buy a domain (e.g., nexline-energy.com)
2. Add a CNAME file in `frontend/public/`:
   ```
   nexline-energy.com
   ```
3. In your domain registrar, add DNS records:
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   
   Type: A
   Name: @
   Values:
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
   ```

### For Vercel/Netlify

1. Go to domain settings in the platform
2. Add your custom domain
3. Update DNS records as instructed

---

## Part 8: Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Dataset is loading (check browser console)
- [ ] Charts are rendering properly
- [ ] Navigation works
- [ ] CSV export functions
- [ ] Mobile responsive design works
- [ ] Images are loading
- [ ] "Made with Emergent" link works

---

## Troubleshooting

### Issue: Dataset not loading

**Solution**: Ensure the Excel file is in `frontend/public/data/` directory and the path in DataContext.jsx is correct:
```javascript
const response = await fetch('/data/complete_energy_dataset_2700.xlsx');
```

### Issue: Charts not displaying

**Solution**: Check that recharts is installed:
```bash
yarn add recharts
```

### Issue: Build fails

**Solution**: Check for missing dependencies:
```bash
yarn install
rm -rf node_modules
yarn install
```

### Issue: 404 errors on page refresh (SPA routing)

**Solution**: Add a `_redirects` file in `frontend/public/`:
```
/*    /index.html   200
```

---

## Updating the Deployment

### After making changes:

```bash
# Commit changes
git add .
git commit -m "Description of changes"
git push origin main

# For GitHub Pages
cd frontend
yarn deploy

# For Vercel
vercel --prod

# For Netlify
netlify deploy --prod
```

---

## Support

For issues or questions:
- Check the [Formulas Documentation](FORMULAS_AND_CALCULATIONS.md)
- Open an issue on GitHub
- Contact: your-email@example.com

---

## Credits

Built with [Emergent](https://emergent.sh) - AI-powered development platform

**Technologies Used:**
- React, Recharts, TailwindCSS
- Shadcn UI Components
- XLSX.js for data processing
- FastAPI (backend)
- MongoDB (database)

---

Happy Deploying! 🚀
