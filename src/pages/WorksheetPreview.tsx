import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { generateMathWorksheet, MathWorksheet } from '../generators/mathGenerator';
import { generateMaze, MazeData } from '../generators/mazeGenerator';
import { generateDotToDot, DotToDotData } from '../generators/dotToDotGenerator';
import { generateSpotDifference, SpotDiffScene } from '../generators/spotDifferenceGenerator';
import { generateColoring, ColoringData } from '../generators/coloringGenerator';
import jsPDF from 'jspdf';

function generateWorksheetData(worksheet: any): any {
  if (!worksheet) return null;
  const d = worksheet.data;
  switch (worksheet.type) {
    case 'math':
      return generateMathWorksheet(d.operations, d.digits, d.questionCount);
    case 'maze':
      return generateMaze(d.difficulty, d.theme);
    case 'dot-to-dot':
      return generateDotToDot(d.subject, d.maxNumber);
    case 'spot-difference':
      return generateSpotDifference(d.theme);
    case 'coloring':
      return generateColoring(d.subject);
    default:
      return null;
  }
}

const WorksheetPreview: React.FC = () => {
  const navigate = useNavigate();
  const { currentWorksheet, addWorksheet, setCurrentWorksheet } = useApp();
  const worksheetRef = useRef<HTMLDivElement>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [worksheetData, setWorksheetData] = useState<any>(null);

  // Generate new data whenever currentWorksheet changes (by id)
  useEffect(() => {
    if (currentWorksheet) {
      setWorksheetData(generateWorksheetData(currentWorksheet));
    }
  }, [currentWorksheet?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownloadPDF = useCallback(async () => {
    if (!worksheetRef.current) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;

    // Get the SVG element
    const svgEl = worksheetRef.current.querySelector('svg');
    if (svgEl) {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 2100;
        canvas.height = 2970;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
        pdf.save(`${currentWorksheet?.title || 'worksheet'}.pdf`);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } else {
      // Fallback: use html2canvas approach
      const el = worksheetRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = 2100;
      canvas.height = 2970;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Simple text-based PDF for math
      if (currentWorksheet?.type === 'math' && worksheetData) {
        const mathData = worksheetData as MathWorksheet;
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text(mathData.title, pageWidth / 2, 20, { align: 'center' });
        pdf.setFontSize(10);
        pdf.text('TurtleWorksheet Lab', pageWidth / 2, 28, { align: 'center' });

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'normal');
        let y = 45;
        const colWidth = pageWidth / 2;
        mathData.questions.forEach((q, i) => {
          const col = i < Math.ceil(mathData.questions.length / 2) ? 0 : 1;
          const row = col === 0 ? i : i - Math.ceil(mathData.questions.length / 2);
          const x = col === 0 ? 20 : colWidth + 10;
          const qy = 45 + row * 16;
          pdf.text(`${i + 1}.  ${q.num1}  ${q.operationSymbol}  ${q.num2}  =  ____`, x, qy);
        });

        if (currentWorksheet.data.includeAnswerKey) {
          pdf.addPage();
          pdf.setFontSize(20);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Answer Key', pageWidth / 2, 20, { align: 'center' });
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'normal');
          mathData.questions.forEach((q, i) => {
            const col = i < Math.ceil(mathData.questions.length / 2) ? 0 : 1;
            const row = col === 0 ? i : i - Math.ceil(mathData.questions.length / 2);
            const x = col === 0 ? 20 : colWidth + 10;
            const qy = 40 + row * 14;
            pdf.text(`${i + 1}.  ${q.num1}  ${q.operationSymbol}  ${q.num2}  =  ${q.answer}`, x, qy);
          });
        }
      }

      pdf.save(`${currentWorksheet?.title || 'worksheet'}.pdf`);
    }
  }, [currentWorksheet, worksheetData]);

  const handlePrint = () => {
    window.print();
  };

  const handleRegenerate = () => {
    if (!currentWorksheet) return;
    // Create a new worksheet with a fresh id to trigger re-generation
    const newWorksheet = {
      ...currentWorksheet,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setCurrentWorksheet(newWorksheet);
    // Generate fresh random data
    setWorksheetData(generateWorksheetData(newWorksheet));
  };

  if (!currentWorksheet || !worksheetData) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', color: 'white' }}>
        <h2>No worksheet generated yet</h2>
        <button
          onClick={() => navigate('/generate')}
          style={{
            background: '#05bfdb',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '25px',
            fontWeight: 700,
            fontSize: '1rem',
            marginTop: '20px',
          }}
        >
          Create One Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', padding: '80px 20px 40px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '900px', margin: '0 auto' }}
      >
        {/* Action Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <button
            onClick={() => navigate('/generate')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '20px',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            &larr; Back
          </button>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {(currentWorksheet.type === 'math' || currentWorksheet.type === 'maze' || currentWorksheet.type === 'spot-difference') && (
              <button
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                style={{
                  background: showAnswerKey ? '#f39c12' : 'rgba(255,255,255,0.15)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                {showAnswerKey ? 'Hide Answers' : 'Show Answers'}
              </button>
            )}
            <button
              onClick={handleRegenerate}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Regenerate
            </button>
            <button
              onClick={handlePrint}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              style={{
                background: 'linear-gradient(135deg, #05bfdb, #088395)',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: '0 4px 15px rgba(5,191,219,0.4)',
              }}
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Worksheet Preview */}
        <div
          ref={worksheetRef}
          style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          {currentWorksheet.type === 'math' && (
            <MathPreview data={worksheetData as MathWorksheet} showAnswers={showAnswerKey} includeAnswerKey={currentWorksheet.data.includeAnswerKey} />
          )}
          {currentWorksheet.type === 'maze' && (
            <MazePreview data={worksheetData as MazeData} showSolution={showAnswerKey} />
          )}
          {currentWorksheet.type === 'dot-to-dot' && (
            <DotToDotPreview data={worksheetData as DotToDotData} />
          )}
          {currentWorksheet.type === 'spot-difference' && (
            <SpotDiffPreview data={worksheetData as SpotDiffScene} showAnswers={showAnswerKey} />
          )}
          {currentWorksheet.type === 'coloring' && (
            <ColoringPreview data={worksheetData as ColoringData} />
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ============ MATH PREVIEW ============
const MathPreview: React.FC<{ data: MathWorksheet; showAnswers: boolean; includeAnswerKey: boolean }> = ({ data, showAnswers }) => {
  const halfCount = Math.ceil(data.questions.length / 2);
  const col1 = data.questions.slice(0, halfCount);
  const col2 = data.questions.slice(halfCount);

  return (
    <svg viewBox="0 0 800 1131" style={{ width: '100%', display: 'block' }}>
      {/* Header */}
      <rect x="0" y="0" width="800" height="1131" fill="white" />

      {/* Decorative top border */}
      <rect x="0" y="0" width="800" height="8" fill="#05bfdb" />

      {/* Title area */}
      <text x="400" y="55" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#0a4d68" fontFamily="Arial, sans-serif">
        {data.title}
      </text>

      {/* Turtle icon */}
      <text x="400" y="80" textAnchor="middle" fontSize="12" fill="#088395" fontFamily="Arial, sans-serif">
        TurtleWorksheet Lab
      </text>

      {/* Name/Date line */}
      <text x="50" y="110" fontSize="14" fill="#666" fontFamily="Arial, sans-serif">Name: _______________________</text>
      <text x="500" y="110" fontSize="14" fill="#666" fontFamily="Arial, sans-serif">Date: _______________________</text>

      <line x1="40" y1="125" x2="760" y2="125" stroke="#e0e0e0" strokeWidth="1" />

      {/* Questions - Column 1 */}
      {col1.map((q, i) => (
        <g key={`q1-${i}`}>
          <text x="60" y={170 + i * 60} fontSize="18" fill="#0a4d68" fontFamily="Arial, sans-serif" fontWeight="bold">
            {i + 1}.
          </text>
          <text x="100" y={170 + i * 60} fontSize="22" fill="#1a3a4a" fontFamily="Arial, sans-serif">
            {q.num1}  {q.operationSymbol}  {q.num2}  =  {showAnswers ? q.answer : '______'}
          </text>
        </g>
      ))}

      {/* Questions - Column 2 */}
      {col2.map((q, i) => (
        <g key={`q2-${i}`}>
          <text x="430" y={170 + i * 60} fontSize="18" fill="#0a4d68" fontFamily="Arial, sans-serif" fontWeight="bold">
            {halfCount + i + 1}.
          </text>
          <text x="470" y={170 + i * 60} fontSize="22" fill="#1a3a4a" fontFamily="Arial, sans-serif">
            {q.num1}  {q.operationSymbol}  {q.num2}  =  {showAnswers ? q.answer : '______'}
          </text>
        </g>
      ))}

      {/* Footer decoration */}
      <line x1="40" y1="1060" x2="760" y2="1060" stroke="#e0e0e0" strokeWidth="1" />

      {/* Turtle footer icon */}
      <g transform="translate(370, 1075)">
        <ellipse cx="30" cy="10" rx="18" ry="12" fill="#2ecc71" opacity="0.3" />
        <circle cx="30" cy="2" r="6" fill="#2ecc71" opacity="0.3" />
      </g>
      <text x="400" y="1110" textAnchor="middle" fontSize="10" fill="#bbb" fontFamily="Arial, sans-serif">
        Generated by TurtleWorksheet Lab
      </text>

      {/* Decorative bottom border */}
      <rect x="0" y="1123" width="800" height="8" fill="#05bfdb" />
    </svg>
  );
};

// ============ MAZE PREVIEW ============
const MazePreview: React.FC<{ data: MazeData; showSolution: boolean }> = ({ data, showSolution }) => {
  const cellSize = Math.min(700 / data.width, 850 / data.height);
  const offsetX = (800 - data.width * cellSize) / 2;
  const offsetY = 140;
  const { theme } = data;

  return (
    <svg viewBox="0 0 800 1131" style={{ width: '100%', display: 'block' }}>
      <rect x="0" y="0" width="800" height="1131" fill="white" />
      <rect x="0" y="0" width="800" height="8" fill="#9b59b6" />

      <text x="400" y="50" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#0a4d68" fontFamily="Arial, sans-serif">
        {theme.title}
      </text>
      <text x="400" y="75" textAnchor="middle" fontSize="14" fill="#888" fontFamily="Arial, sans-serif">
        {theme.subtitle} ({data.difficulty})
      </text>
      <text x="400" y="95" textAnchor="middle" fontSize="12" fill="#088395" fontFamily="Arial, sans-serif">
        TurtleWorksheet Lab
      </text>
      <text x="50" y="120" fontSize="14" fill="#666" fontFamily="Arial, sans-serif">Name: _______________________</text>

      {/* Maze grid */}
      {data.grid.map((row, y) =>
        row.map((cell, x) => {
          const cx = offsetX + x * cellSize;
          const cy = offsetY + y * cellSize;
          return (
            <g key={`${x}-${y}`}>
              {cell.walls.top && (
                <line x1={cx} y1={cy} x2={cx + cellSize} y2={cy} stroke="#0a4d68" strokeWidth="2" />
              )}
              {cell.walls.right && (
                <line x1={cx + cellSize} y1={cy} x2={cx + cellSize} y2={cy + cellSize} stroke="#0a4d68" strokeWidth="2" />
              )}
              {cell.walls.bottom && (
                <line x1={cx} y1={cy + cellSize} x2={cx + cellSize} y2={cy + cellSize} stroke="#0a4d68" strokeWidth="2" />
              )}
              {cell.walls.left && (
                <line x1={cx} y1={cy} x2={cx} y2={cy + cellSize} stroke="#0a4d68" strokeWidth="2" />
              )}
            </g>
          );
        })
      )}

      {/* Solution path */}
      {showSolution && data.solution.length > 1 && (
        <path
          d={data.solution.map((p, i) => {
            const px = offsetX + p.x * cellSize + cellSize / 2;
            const py = offsetY + p.y * cellSize + cellSize / 2;
            return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
          }).join(' ')}
          stroke="#ff6b6b"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      )}

      {/* Start icon */}
      <text
        x={offsetX + data.start.x * cellSize + cellSize / 2}
        y={offsetY + data.start.y * cellSize + cellSize / 2 + 6}
        textAnchor="middle"
        fontSize={cellSize * 0.6}
      >
        {theme.startEmoji}
      </text>

      {/* End icon */}
      <text
        x={offsetX + data.end.x * cellSize + cellSize / 2}
        y={offsetY + data.end.y * cellSize + cellSize / 2 + 6}
        textAnchor="middle"
        fontSize={cellSize * 0.6}
      >
        {theme.endEmoji}
      </text>

      <rect x="0" y="1123" width="800" height="8" fill="#9b59b6" />
      <text x="400" y="1110" textAnchor="middle" fontSize="10" fill="#bbb" fontFamily="Arial, sans-serif">
        Generated by TurtleWorksheet Lab
      </text>
    </svg>
  );
};

// ============ DOT-TO-DOT PREVIEW ============
const DotToDotPreview: React.FC<{ data: DotToDotData }> = ({ data }) => {
  // Scale dots to fit nicely in A4
  const minX = Math.min(...data.dots.map(d => d.x));
  const maxX = Math.max(...data.dots.map(d => d.x));
  const minY = Math.min(...data.dots.map(d => d.y));
  const maxY = Math.max(...data.dots.map(d => d.y));
  const scaleX = 600 / (maxX - minX || 1);
  const scaleY = 700 / (maxY - minY || 1);
  const scale = Math.min(scaleX, scaleY);
  const oX = (800 - (maxX - minX) * scale) / 2 - minX * scale;
  const oY = 200 - minY * scale;

  return (
    <svg viewBox="0 0 800 1131" style={{ width: '100%', display: 'block' }}>
      <rect x="0" y="0" width="800" height="1131" fill="white" />
      <rect x="0" y="0" width="800" height="8" fill="#05bfdb" />

      <text x="400" y="50" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#0a4d68" fontFamily="Arial, sans-serif">
        Connect the Dots!
      </text>
      <text x="400" y="78" textAnchor="middle" fontSize="14" fill="#888" fontFamily="Arial, sans-serif">
        Connect the dots in order from 1 to {data.maxNumber}, then color the picture.
      </text>
      <text x="400" y="98" textAnchor="middle" fontSize="12" fill="#088395" fontFamily="Arial, sans-serif">
        TurtleWorksheet Lab
      </text>
      <text x="50" y="125" fontSize="14" fill="#666" fontFamily="Arial, sans-serif">Name: _______________________</text>

      {/* Guide lines (faint) */}
      {data.dots.map((dot, i) => {
        if (i === 0) return null;
        const prev = data.dots[i - 1];
        return (
          <line
            key={`line-${i}`}
            x1={prev.x * scale + oX}
            y1={prev.y * scale + oY}
            x2={dot.x * scale + oX}
            y2={dot.y * scale + oY}
            stroke="#e8e8e8"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        );
      })}

      {/* Dots and numbers */}
      {data.dots.map((dot) => {
        const x = dot.x * scale + oX;
        const y = dot.y * scale + oY;
        return (
          <g key={dot.number}>
            <circle cx={x} cy={y} r="5" fill="#0a4d68" />
            <text
              x={x + 10}
              y={y - 8}
              fontSize="12"
              fontWeight="bold"
              fill="#ff6b6b"
              fontFamily="Arial, sans-serif"
            >
              {dot.number}
            </text>
          </g>
        );
      })}

      <rect x="0" y="1123" width="800" height="8" fill="#05bfdb" />
      <text x="400" y="1110" textAnchor="middle" fontSize="10" fill="#bbb" fontFamily="Arial, sans-serif">
        Generated by TurtleWorksheet Lab
      </text>
    </svg>
  );
};

// ============ SPOT THE DIFFERENCE PREVIEW ============
const SpotDiffPreview: React.FC<{ data: SpotDiffScene; showAnswers: boolean }> = ({ data, showAnswers }) => {
  const renderElement = (el: any, modified: boolean, diffId?: string) => {
    const props = { ...el.props };

    if (modified) {
      // Apply modifications for differences
      if (props.fill && props.fill !== 'none' && props.fill !== 'white') {
        props.fill = shiftColor(props.fill);
      }
      if (props.cx) props.cx = props.cx + 8;
      if (props.cy) props.cy = props.cy + 5;
      if (props.r) props.r = props.r * 0.7;
    }

    switch (el.type) {
      case 'circle':
        return <circle key={el.id + (modified ? '-m' : '')} {...props} />;
      case 'rect':
        return <rect key={el.id + (modified ? '-m' : '')} {...props} />;
      case 'ellipse':
        return <ellipse key={el.id + (modified ? '-m' : '')} {...props} />;
      case 'path':
        return <path key={el.id + (modified ? '-m' : '')} {...props} />;
      case 'polygon':
        return <polygon key={el.id + (modified ? '-m' : '')} {...props} />;
      default:
        return null;
    }
  };

  const diffIds = new Set(data.differences.map(d => d.id));

  return (
    <svg viewBox="0 0 800 1131" style={{ width: '100%', display: 'block' }}>
      <rect x="0" y="0" width="800" height="1131" fill="white" />
      <rect x="0" y="0" width="800" height="8" fill="#2ecc71" />

      <text x="400" y="45" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#0a4d68" fontFamily="Arial, sans-serif">
        Spot the Differences!
      </text>
      <text x="400" y="68" textAnchor="middle" fontSize="14" fill="#888" fontFamily="Arial, sans-serif">
        Find the 6 differences between the two pictures.
      </text>
      <text x="400" y="86" textAnchor="middle" fontSize="12" fill="#088395" fontFamily="Arial, sans-serif">
        TurtleWorksheet Lab
      </text>

      {/* Image 1 */}
      <text x="200" y="115" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a4d68" fontFamily="Arial, sans-serif">
        Picture A
      </text>
      <rect x="10" y="120" width="380" height="420" rx="10" fill="none" stroke="#ddd" strokeWidth="2" />
      <svg x="10" y="120" width="380" height="420" viewBox="0 0 380 500">
        {data.elements.map(el => renderElement(el, false))}
      </svg>

      {/* Image 2 (with differences) */}
      <text x="600" y="115" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a4d68" fontFamily="Arial, sans-serif">
        Picture B
      </text>
      <rect x="410" y="120" width="380" height="420" rx="10" fill="none" stroke="#ddd" strokeWidth="2" />
      <svg x="410" y="120" width="380" height="420" viewBox="0 0 380 500">
        {data.elements.map(el => renderElement(el, diffIds.has(el.id)))}
      </svg>

      {/* Answer circles */}
      {showAnswers && data.differences.map((diff, i) => {
        const el = data.elements.find(e => e.id === diff.id);
        if (!el) return null;
        const cx = (el.props.cx || el.props.x || 190) + 410;
        const cy = (el.props.cy || el.props.y || 250) + 120;
        const scaledCx = 410 + ((el.props.cx || el.props.x || 190) / 380) * 380;
        const scaledCy = 120 + ((el.props.cy || el.props.y || 250) / 500) * 420;
        return (
          <circle
            key={`ans-${i}`}
            cx={scaledCx}
            cy={scaledCy}
            r="20"
            fill="none"
            stroke="#ff6b6b"
            strokeWidth="3"
            strokeDasharray="5,3"
          />
        );
      })}

      {/* Answer boxes */}
      <text x="50" y="580" fontSize="14" fill="#666" fontFamily="Arial, sans-serif">
        I found _____ out of 6 differences!
      </text>

      {/* Checkboxes for tracking */}
      {[1, 2, 3, 4, 5, 6].map(n => (
        <g key={`check-${n}`}>
          <rect x={48 + (n - 1) * 50} y="600" width="30" height="30" rx="5" fill="none" stroke="#ddd" strokeWidth="2" />
          <text x={63 + (n - 1) * 50} y="620" textAnchor="middle" fontSize="12" fill="#bbb" fontFamily="Arial, sans-serif">
            {n}
          </text>
        </g>
      ))}

      <text x="50" y="665" fontSize="14" fill="#666" fontFamily="Arial, sans-serif">Name: _______________________</text>

      <rect x="0" y="1123" width="800" height="8" fill="#2ecc71" />
      <text x="400" y="1110" textAnchor="middle" fontSize="10" fill="#bbb" fontFamily="Arial, sans-serif">
        Generated by TurtleWorksheet Lab
      </text>
    </svg>
  );
};

// ============ COLORING PREVIEW ============
const ColoringPreview: React.FC<{ data: ColoringData }> = ({ data }) => {
  return (
    <svg viewBox="0 0 800 1131" style={{ width: '100%', display: 'block' }}>
      <rect x="0" y="0" width="800" height="1131" fill="white" />
      <rect x="0" y="0" width="800" height="8" fill="#f39c12" />

      <text x="400" y="50" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#0a4d68" fontFamily="Arial, sans-serif">
        {data.title}
      </text>
      <text x="400" y="75" textAnchor="middle" fontSize="12" fill="#088395" fontFamily="Arial, sans-serif">
        TurtleWorksheet Lab
      </text>
      <text x="50" y="100" fontSize="14" fill="#666" fontFamily="Arial, sans-serif">Name: _______________________</text>

      {/* Coloring outline centered */}
      <g transform="translate(100, 80)">
        {data.svgPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="#333"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>

      <rect x="0" y="1123" width="800" height="8" fill="#f39c12" />
      <text x="400" y="1110" textAnchor="middle" fontSize="10" fill="#bbb" fontFamily="Arial, sans-serif">
        Generated by TurtleWorksheet Lab
      </text>
    </svg>
  );
};

function shiftColor(color: string): string {
  const shifts: Record<string, string> = {
    '#ff6b6b': '#6b6bff',
    '#f39c12': '#12f39c',
    '#2ecc71': '#cc712e',
    '#27ae60': '#ae2760',
    '#fdcfe8': '#cfe8fd',
    '#1a3a4a': '#4a1a3a',
    '#f5e6ca': '#e6caf5',
    '#e53935': '#3593e5',
    '#fff9c4': '#c4fff9',
    '#ff8f00': '#008fff',
    '#81c784': '#c784c7',
    '#388e3c': '#8e3c88',
    '#ffd54f': '#4fd5ff',
    '#5d4037': '#40375d',
    '#8d6e63': '#636e8d',
    '#6d4c41': '#414c6d',
    '#ff8e8e': '#8e8eff',
    '#e74c3c': '#4c3ce7',
    '#e8f4f8': '#f8e8f4',
    '#88ccdd': '#ddcc88',
    '#ff9800': '#0098ff',
    '#e91e63': '#1ee991',
    '#f44336': '#3643f4',
    '#ff6b6b55': '#6b6bff55',
    '#ffe08855': '#e0ff8855',
  };
  return shifts[color] || color;
}

export default WorksheetPreview;
