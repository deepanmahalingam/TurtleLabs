import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, WorksheetType } from '../context/AppContext';
import { parsePrompt, ParsedPrompt } from '../utils/promptParser';
import TurtleScene from '../components/TurtleScene';

const typeIcons: Record<WorksheetType, string> = {
  'math': '🔢',
  'coloring': '🎨',
  'spot-difference': '🔍',
  'dot-to-dot': '🔗',
  'maze': '🌊',
};

const typeLabels: Record<WorksheetType, string> = {
  'math': 'Math Worksheet',
  'coloring': 'Coloring Page',
  'spot-difference': 'Spot the Difference',
  'dot-to-dot': 'Dot-to-Dot',
  'maze': 'Maze',
};

const GeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, setCurrentWorksheet, isGenerating, setIsGenerating } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  const [prompt, setPrompt] = useState('');
  const [parsed, setParsed] = useState<ParsedPrompt | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  // Math overrides
  const [operations, setOperations] = useState<string[]>(['addition']);
  const [digits, setDigits] = useState(1);
  const [questionCount, setQuestionCount] = useState(15);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);

  // Maze overrides
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Dot overrides
  const [maxNumber, setMaxNumber] = useState(30);
  const [dotSubject, setDotSubject] = useState('turtle');

  // Spot theme
  const [spotTheme, setSpotTheme] = useState('underwater');

  useEffect(() => {
    const state = location.state as { prompt?: string } | null;
    if (state?.prompt) {
      setPrompt(state.prompt);
      handleParse(state.prompt);
    }
    inputRef.current?.focus();
  }, [location.state]);

  const handleParse = (text: string) => {
    if (!text.trim()) {
      setParsed(null);
      return;
    }
    const result = parsePrompt(text);
    setParsed(result);

    if (result.operations) setOperations(result.operations);
    if (result.digits) setDigits(result.digits);
    if (result.questionCount) setQuestionCount(result.questionCount);
    if (result.difficulty) setDifficulty(result.difficulty);
    if (result.maxNumber) setMaxNumber(result.maxNumber);
    if (result.subject) setDotSubject(result.subject);
    if (result.theme) setSpotTheme(result.theme);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    handleParse(e.target.value);
  };

  const handleGenerate = () => {
    if (!parsed) return;
    setIsGenerating(true);

    setTimeout(() => {
      const worksheetData: any = {
        type: parsed.type,
        prompt,
        includeAnswerKey,
      };

      switch (parsed.type) {
        case 'math':
          worksheetData.operations = operations;
          worksheetData.digits = digits;
          worksheetData.questionCount = questionCount;
          break;
        case 'maze':
          worksheetData.difficulty = difficulty;
          break;
        case 'dot-to-dot':
          worksheetData.maxNumber = maxNumber;
          worksheetData.subject = dotSubject;
          break;
        case 'spot-difference':
          worksheetData.theme = spotTheme;
          break;
        case 'coloring':
          worksheetData.subject = parsed.subject || 'turtle';
          break;
      }

      const worksheet = {
        id: Date.now().toString(),
        type: parsed.type,
        title: typeLabels[parsed.type],
        prompt,
        data: worksheetData,
        createdAt: new Date(),
      };

      setCurrentWorksheet(worksheet);
      setIsGenerating(false);
      navigate('/preview');
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && parsed) handleGenerate();
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', maxWidth: '800px', margin: '0 auto', padding: '80px 20px 40px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ color: 'white', textAlign: 'center', fontSize: '2rem', marginBottom: '8px' }}>
          Create Your Worksheet
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '30px' }}>
          Describe what you want and we'll generate it instantly
        </p>

        {/* Prompt Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '50px',
          padding: '6px 6px 6px 24px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          border: parsed ? `3px solid ${getTypeColor(parsed.type)}44` : '3px solid rgba(5,191,219,0.3)',
          marginBottom: '20px',
        }}>
          <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>🐢</span>
          <input
            ref={inputRef}
            value={prompt}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g. single addition worksheet with 3-digit numbers"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              background: 'transparent',
              color: '#1a3a4a',
              padding: '12px 0',
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={!parsed || isGenerating}
            style={{
              background: parsed ? 'linear-gradient(135deg, #05bfdb, #088395)' : '#ccc',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '40px',
              fontWeight: 700,
              fontSize: '1rem',
              opacity: parsed ? 1 : 0.6,
            }}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {/* Detected Type Badge */}
        <AnimatePresence>
          {parsed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}>
                {typeIcons[parsed.type]} Detected: {typeLabels[parsed.type]}
              </span>
              {mode === 'teacher' && (
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  {showOptions ? 'Hide Options' : 'Show Options'}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Teacher Options Panel */}
        <AnimatePresence>
          {showOptions && parsed && mode === 'teacher' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              <h3 style={{ marginBottom: '16px', color: '#0a4d68', fontSize: '1.1rem' }}>
                Customize Options
              </h3>

              {parsed.type === 'math' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Operations</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {['addition', 'subtraction', 'multiplication', 'division'].map(op => (
                        <button
                          key={op}
                          onClick={() => {
                            if (operations.includes(op)) {
                              if (operations.length > 1) setOperations(operations.filter(o => o !== op));
                            } else {
                              setOperations([...operations, op]);
                            }
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            background: operations.includes(op) ? '#05bfdb' : '#eee',
                            color: operations.includes(op) ? 'white' : '#666',
                          }}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Number of Digits</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[1, 2, 3].map(d => (
                        <button
                          key={d}
                          onClick={() => setDigits(d)}
                          style={{
                            padding: '6px 16px',
                            borderRadius: '15px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            background: digits === d ? '#05bfdb' : '#eee',
                            color: digits === d ? 'white' : '#666',
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Questions: {questionCount}</label>
                    <input
                      type="range"
                      min="5"
                      max="15"
                      value={questionCount}
                      onChange={e => setQuestionCount(parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={includeAnswerKey}
                        onChange={e => setIncludeAnswerKey(e.target.checked)}
                      />
                      Include Answer Key
                    </label>
                  </div>
                </div>
              )}

              {parsed.type === 'maze' && (
                <div>
                  <label style={labelStyle}>Difficulty</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['easy', 'medium', 'hard'] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        style={{
                          padding: '8px 20px',
                          borderRadius: '15px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          background: difficulty === d ? '#05bfdb' : '#eee',
                          color: difficulty === d ? 'white' : '#666',
                          textTransform: 'capitalize',
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {parsed.type === 'dot-to-dot' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Max Number: {maxNumber}</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={maxNumber}
                      onChange={e => setMaxNumber(parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Shape</label>
                    <select
                      value={dotSubject}
                      onChange={e => setDotSubject(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: '2px solid #eee',
                        fontSize: '0.9rem',
                        width: '100%',
                      }}
                    >
                      {['turtle', 'dog', 'cat', 'fish', 'star', 'house', 'heart', 'butterfly'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {parsed.type === 'spot-difference' && (
                <div>
                  <label style={labelStyle}>Theme</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['underwater', 'farm'].map(t => (
                      <button
                        key={t}
                        onClick={() => setSpotTheme(t)}
                        style={{
                          padding: '8px 20px',
                          borderRadius: '15px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          background: spotTheme === t ? '#05bfdb' : '#eee',
                          color: spotTheme === t ? 'white' : '#666',
                          textTransform: 'capitalize',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Animation */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '20px 0' }}
            >
              <TurtleScene isAnimating={true} height="250px" />
              <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>
                Our turtle is creating your worksheet...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Type Buttons */}
        {!isGenerating && !parsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', marginTop: '30px' }}
          >
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '16px', fontSize: '0.9rem' }}>
              Or pick a worksheet type to get started:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {(Object.keys(typeLabels) as WorksheetType[]).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    const prompts: Record<WorksheetType, string> = {
                      'math': 'addition worksheet with 2-digit numbers',
                      'coloring': 'coloring page of a turtle under the sea',
                      'spot-difference': 'spot the difference underwater scene',
                      'dot-to-dot': 'dot-to-dot turtle with numbers up to 30',
                      'maze': 'easy maze for kids',
                    };
                    setPrompt(prompts[type]);
                    handleParse(prompts[type]);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '20px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {typeIcons[type]} {typeLabels[type]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 700,
  color: '#555',
  marginBottom: '6px',
};

function getTypeColor(type: WorksheetType): string {
  const colors: Record<WorksheetType, string> = {
    'math': '#ff6b6b',
    'coloring': '#f39c12',
    'spot-difference': '#2ecc71',
    'dot-to-dot': '#05bfdb',
    'maze': '#9b59b6',
  };
  return colors[type];
}

export default GeneratorPage;
