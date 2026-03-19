import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TurtleScene from '../components/TurtleScene';

const worksheetTypes = [
  { icon: '🔢', title: 'Math Worksheets', desc: 'Addition, subtraction & more', color: '#ff6b6b', prompt: 'single addition worksheet with 2-digit numbers' },
  { icon: '🎨', title: 'Coloring Pages', desc: 'Fun images to color', color: '#f39c12', prompt: 'coloring sheet of a turtle under the sea' },
  { icon: '🔍', title: 'Spot the Difference', desc: 'Find the hidden changes', color: '#2ecc71', prompt: 'spot the difference underwater scene' },
  { icon: '🔗', title: 'Dot-to-Dot', desc: 'Connect & discover', color: '#05bfdb', prompt: 'joining dots image of a dog up to 30' },
  { icon: '🌊', title: 'Mazes', desc: 'Find the way out', color: '#9b59b6', prompt: 'easy maze with a turtle finding its way to the sea' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickStart = (prompt: string) => {
    navigate('/generate', { state: { prompt } });
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '20px 20px 0',
        position: 'relative',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'white',
            marginBottom: '10px',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}>
            TurtleWorksheet Lab
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: '600px',
            margin: '0 auto 20px',
            lineHeight: 1.5,
          }}>
            Create fun, printable worksheets for kids instantly.
            Just type what you need!
          </p>
        </motion.div>

        <TurtleScene height="320px" />

        {/* Prompt Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            maxWidth: '650px',
            margin: '-20px auto 40px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            onClick={() => navigate('/generate')}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '50px',
              padding: '8px 8px 8px 24px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
              cursor: 'text',
              border: '3px solid rgba(5, 191, 219, 0.3)',
            }}
          >
            <span style={{ fontSize: '1.3rem', marginRight: '12px' }}>🐢</span>
            <span style={{
              flex: 1,
              color: '#999',
              fontSize: '1.05rem',
              textAlign: 'left',
            }}>
              Type what you want to create...
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/generate'); }}
              style={{
                background: 'linear-gradient(135deg, #05bfdb, #088395)',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '40px',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(5, 191, 219, 0.4)',
              }}
            >
              Create
            </button>
          </div>
        </motion.div>
      </section>

      {/* Worksheet Types Grid */}
      <section style={{
        padding: '20px 20px 60px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <h2 style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '1.8rem',
          marginBottom: '30px',
        }}>
          What would you like to create?
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
        }}>
          {worksheetTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => handleQuickStart(type.prompt)}
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                padding: '24px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: `2px solid ${type.color}22`,
                transition: 'box-shadow 0.3s',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{type.icon}</div>
              <h3 style={{
                fontSize: '1rem',
                color: type.color,
                marginBottom: '6px',
              }}>
                {type.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>{type.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Example Prompts */}
      <section style={{
        padding: '40px 20px 80px',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        <h2 style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '1.5rem',
          marginBottom: '20px',
        }}>
          Try these prompts
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {[
            'Single addition worksheet, 3-digit numbers',
            'Mixed addition and subtraction, 2 digits, 10 questions',
            'Coloring page: jungle animals',
            'Dot-to-dot turtle, max number 30',
            'Easy maze for kindergarten',
            'Spot the difference farm scene',
            'Multiplication worksheet, 1 digit',
          ].map((prompt) => (
            <motion.button
              key={prompt}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickStart(prompt)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                padding: '10px 18px',
                borderRadius: '25px',
                fontSize: '0.85rem',
                fontWeight: 600,
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              "{prompt}"
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
