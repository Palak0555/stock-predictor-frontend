# Stock Impact Predictor - React Frontend

A modern, elegant React frontend for stock market sentiment analysis using AI/ML predictions. Features cinematic animations, particle effects, and real-time visual feedback.

## 🎨 Features

- **Modern UI Design**: Elegant, minimalist interface with gradient effects and glass morphism
- **Particle Animations**: Three.js-powered background particles (optional enhanced version)
- **Real-time Predictions**: Instant API integration with visual feedback
- **Color-coded Results**: Green for positive impact, red for negative impact
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading States**: Smooth animations during API calls
- **Error Handling**: User-friendly error messages
- **Sample Headlines**: Quick-start examples for testing

## 📦 Two Versions Available

### 1. **StockPredictor.jsx** (Recommended for most use cases)
- Lighter weight
- CSS-based particle animations
- Faster performance
- Perfect for production

### 2. **StockPredictorWithParticles.jsx** (Enhanced visuals)
- Three.js particle system
- Dynamic color-changing particles
- More cinematic experience
- Requires Three.js package

## 🚀 Installation

### Prerequisites
```bash
# Make sure you have Node.js installed
node --version  # Should be v16 or higher
```

### Setup Instructions

1. **Install Dependencies**
```bash
# Navigate to your React project
cd your-react-project

# Install Three.js (only if using enhanced version)
npm install three

# Tailwind CSS should already be configured
```

2. **Copy Component Files**
```bash
# Copy to your components directory
cp StockPredictor.jsx src/components/
# OR for enhanced version
cp StockPredictorWithParticles.jsx src/components/
```

3. **Configure Tailwind CSS** (if not already done)

Make sure your `tailwind.config.js` includes:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

And your `src/index.css` has:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📡 Backend API Setup

Make sure your Python API is running on `http://127.0.0.1:8000`

### API Requirements

**Endpoint**: `POST /predict`

**Request Body**:
```json
{
  "f1": 0.5,
  "f2": 180.2,
  "f3": 0.3,
  "f4": 1.0,
  "news_text": "Your news headline here"
}
```

**Response**:
```json
{
  "prediction": 0.1655
}
```

### Enable CORS on Backend

If you get CORS errors, add this to your Python FastAPI backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 💻 Usage

### Basic Implementation

```jsx
// src/App.jsx
import StockPredictor from './components/StockPredictor';

function App() {
  return (
    <div className="App">
      <StockPredictor />
    </div>
  );
}

export default App;
```

### With Enhanced Particles

```jsx
// src/App.jsx
import StockPredictorWithParticles from './components/StockPredictorWithParticles';

function App() {
  return (
    <div className="App">
      <StockPredictorWithParticles />
    </div>
  );
}

export default App;
```

## 🎯 How It Works

1. **User Input**: Enter a news headline or article text
2. **API Call**: Frontend sends POST request to Python backend
3. **Processing**: Backend analyzes sentiment and returns prediction (-1 to 1)
4. **Visualization**: Result displayed with:
   - Large percentage display
   - Color-coded impact label
   - Visual progress bar
   - Metrics breakdown
   - Animated particles (enhanced version)

## 🎨 Customization

### Change Color Scheme

Edit the gradient colors in the component:

```jsx
// Positive impact colors
bg-gradient-to-br from-emerald-400 to-green-600

// Negative impact colors
bg-gradient-to-br from-red-400 to-rose-600

// Neutral colors
bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
```

### Adjust API Endpoint

Change the API URL in the `handleSubmit` function:

```jsx
const response = await fetch('YOUR_API_URL/predict', {
  // ... rest of config
});
```

### Modify Prediction Thresholds

Adjust the impact labels in `getImpactLabel`:

```jsx
const getImpactLabel = (prediction) => {
  const absValue = Math.abs(prediction);
  if (absValue > 0.3) return prediction > 0 ? 'Strongly Positive' : 'Strongly Negative';
  if (absValue > 0.15) return prediction > 0 ? 'Positive' : 'Negative';
  // Add your custom thresholds
};
```

## 🐛 Troubleshooting

### API Connection Error
```
Error: Failed to connect to API
```
**Solution**: Make sure your Python backend is running on port 8000
```bash
# Check if backend is running
curl http://127.0.0.1:8000/predict
```

### CORS Error
```
Access to fetch has been blocked by CORS policy
```
**Solution**: Enable CORS in your Python backend (see Backend API Setup above)

### Three.js Not Found (Enhanced Version)
```
Module not found: Can't resolve 'three'
```
**Solution**: Install Three.js
```bash
npm install three
```

### Particles Not Showing
**Solution**: Make sure your `canvasRef` is properly initialized and Three.js is imported

### Slow Performance
**Solution**: 
- Use the basic version instead of enhanced
- Reduce particle count in enhanced version (change `particleCount` variable)
- Disable particle effects on mobile

## 📱 Mobile Optimization

Both versions are fully responsive. For best mobile experience:

```jsx
// Adjust particle count for mobile
const particleCount = window.innerWidth < 768 ? 1000 : 2000;
```

## 🔧 Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📊 Performance

- **Basic Version**: ~60fps on most devices
- **Enhanced Version**: ~60fps on modern devices, ~30fps on older hardware
- **Bundle Size**: 
  - Basic: ~2KB (gzipped)
  - Enhanced: ~150KB with Three.js

## 🌟 Example Use Cases

1. **Financial News Analysis**: Paste headlines from Bloomberg, Reuters, WSJ
2. **Earnings Reports**: Analyze company earnings announcements
3. **Economic Indicators**: Test Fed announcements, GDP reports
4. **Market Events**: Evaluate impact of mergers, acquisitions, scandals
5. **Trading Signals**: Get quick sentiment analysis for day trading

## 📝 Sample Headlines to Test

```
"Federal Reserve raises interest rates by 0.75%"
"Apple reports record-breaking quarterly earnings"
"Oil prices surge amid supply chain disruptions"
"Tech sector layoffs accelerate across major companies"
"New trade deal signed between US and China"
```

For issues or questions:
1. Check the Troubleshooting section
2. Verify your backend is running correctly
3. Check browser console for error messages
4. Ensure all dependencies are installed

---

**Built with ❤️ using React, Vite, Tailwind CSS, and Three.js**