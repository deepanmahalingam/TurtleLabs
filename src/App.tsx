import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import BubbleBackground from './components/BubbleBackground';
import LandingPage from './pages/LandingPage';
import GeneratorPage from './pages/GeneratorPage';
import WorksheetPreview from './pages/WorksheetPreview';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <BubbleBackground />
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/generate" element={<GeneratorPage />} />
            <Route path="/preview" element={<WorksheetPreview />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
