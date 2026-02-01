import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const StockPredictorWithParticles = () => {
  const [newsText, setNewsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const particlesRef = useRef(null);

  // Three.js particle system
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);

    // Animation
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.05;
        particlesRef.current.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;

        const positions = particlesRef.current.geometry.attributes.position.array;
        const colors = particlesRef.current.geometry.attributes.color.array;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          positions[i3 + 1] += Math.sin(elapsedTime + i) * 0.001;

          // Color animation based on result
          if (result !== null) {
            const hue = result > 0 ? 0.3 : 0.0; // Green or Red
            const color = new THREE.Color();
            color.setHSL(hue, 0.7, 0.5);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
          }
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.geometry.attributes.color.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsText.trim()) {
      setError('Please enter a news headline');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          f1: 0.5,
          f2: 180.2,
          f3: 0.3,
          f4: 1.0,
          news_text: newsText,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.prediction);
    } catch (err) {
      setError(err.message || 'Failed to connect to API');
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (prediction) => {
    if (prediction > 0) return 'positive';
    if (prediction < 0) return 'negative';
    return 'neutral';
  };

  const getImpactLabel = (prediction) => {
    const absValue = Math.abs(prediction);
    if (absValue > 0.3) return prediction > 0 ? 'Strongly Positive' : 'Strongly Negative';
    if (absValue > 0.15) return prediction > 0 ? 'Positive' : 'Negative';
    if (absValue > 0.05) return prediction > 0 ? 'Slightly Positive' : 'Slightly Negative';
    return 'Neutral';
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" style={{ zIndex: 0 }} />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-7xl md:text-9xl font-light mb-4 tracking-tight">
            Market Pulse
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            AI-POWERED SENTIMENT ANALYSIS
          </p>
        </header>

        {/* Input Form */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-light tracking-widest uppercase text-gray-400 mb-4">
              News Headline or Article
            </label>
            <textarea
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
              placeholder="Paste breaking news, earnings reports, or market updates..."
              className="w-full bg-black/50 border border-white/20 rounded-xl px-6 py-4 text-lg font-light focus:outline-none focus:border-indigo-500 transition-all duration-300 resize-none h-32 placeholder-gray-600"
              disabled={loading}
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl font-light tracking-widest text-lg uppercase hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Sentiment...
                </span>
              ) : (
                'Analyze Impact'
              )}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 text-red-400">⚠</div>
              <p className="text-red-300 font-light">{error}</p>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result !== null && (
          <div className="space-y-6">
            {/* Main Impact Display */}
            <div className={`backdrop-blur-xl border-2 rounded-3xl p-12 shadow-2xl transition-all duration-1000 ${
              getImpactColor(result) === 'positive' 
                ? 'bg-emerald-500/10 border-emerald-500/40 shadow-emerald-500/20' 
                : getImpactColor(result) === 'negative'
                ? 'bg-red-500/10 border-red-500/40 shadow-red-500/20'
                : 'bg-gray-500/10 border-gray-500/40'
            }`}>
              <div className="text-center">
                {/* Impact Icon */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
                    getImpactColor(result) === 'positive'
                      ? 'bg-emerald-500/20'
                      : 'bg-red-500/20'
                  }`}>
                    <span className="text-5xl">
                      {getImpactColor(result) === 'positive' ? '📈' : '📉'}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-light tracking-widest uppercase text-gray-400 mb-4">
                  Predicted Stock Impact
                </p>
                
                {/* Impact Value with Animation */}
                <div className={`text-8xl md:text-[10rem] font-light mb-6 transition-all duration-1000 ${
                  getImpactColor(result) === 'positive'
                    ? 'text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-green-400 to-emerald-600'
                    : getImpactColor(result) === 'negative'
                    ? 'text-transparent bg-clip-text bg-gradient-to-br from-red-400 via-rose-400 to-red-600'
                    : 'text-gray-400'
                }`}>
                  {result > 0 ? '+' : ''}{(result * 100).toFixed(2)}%
                </div>

                {/* Impact Label */}
                <div className={`inline-block px-8 py-4 rounded-full font-light tracking-wider text-lg ${
                  getImpactColor(result) === 'positive'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : getImpactColor(result) === 'negative'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                }`}>
                  {getImpactLabel(result)}
                </div>
              </div>
            </div>

            {/* Visual Impact Bar */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="relative h-6 bg-gray-800/50 rounded-full overflow-hidden shadow-inner">
                {/* Center line */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-white/40" />
                </div>
                
                {/* Animated bar */}
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    result > 0
                      ? 'bg-gradient-to-r from-emerald-600 to-green-400 shadow-lg shadow-emerald-500/50'
                      : 'bg-gradient-to-l from-red-600 to-rose-400 shadow-lg shadow-red-500/50'
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(result) * 100, 50)}%`,
                    marginLeft: result > 0 ? '50%' : `${50 - Math.min(Math.abs(result) * 100, 50)}%`,
                  }}
                />
              </div>

              <div className="flex justify-between mt-3 text-xs text-gray-500 font-light">
                <span>Bearish</span>
                <span>Neutral</span>
                <span>Bullish</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
                <div className="text-4xl font-light mb-2 text-indigo-400">
                  {Math.abs(result * 100).toFixed(2)}
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Magnitude</p>
              </div>
              
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
                <div className={`text-4xl font-light mb-2 ${
                  getImpactColor(result) === 'positive' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {result > 0 ? '↑' : '↓'}
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Trend</p>
              </div>
              
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
                <div className="text-4xl font-light mb-2 text-purple-400">
                  {Math.abs(result) > 0.3 ? 'High' : Math.abs(result) > 0.15 ? 'Med' : 'Low'}
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Volatility</p>
              </div>

              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
                <div className="text-4xl font-light mb-2 text-pink-400">
                  {Math.round((1 - Math.abs(result)) * 100)}%
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Stability</p>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setResult(null);
                setNewsText('');
              }}
              className="w-full py-3 border border-white/20 rounded-xl font-light tracking-widest uppercase hover:bg-white/5 transition-all duration-300"
            >
              Analyze Another
            </button>
          </div>
        )}

        {/* Sample Headlines */}
        {!result && !loading && (
          <div className="mt-12">
            <p className="text-sm font-light tracking-widest uppercase text-gray-500 mb-6 text-center">
              Try Sample Headlines
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Federal Reserve announces unexpected rate cut amid economic concerns',
                'Tech stocks surge as AI breakthrough drives investor optimism',
                'Global supply chain disruption threatens manufacturing sector',
                'Major bank reports record profits, beats analyst expectations',
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setNewsText(example)}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm font-light text-left hover:bg-white/10 transition-all duration-300"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-xs text-gray-600 font-light tracking-widest">
        AI-POWERED MARKET ANALYSIS • REAL-TIME PREDICTIONS
      </footer>
    </div>
  );
};

export default StockPredictorWithParticles;