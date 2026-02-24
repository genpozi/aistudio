import React, { useState } from 'react';
import { ICONS } from '../constants';

interface CalculatorWidgetProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const CalculatorWidget: React.FC<CalculatorWidgetProps> = ({ isCollapsed, onToggle }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const calculate = () => {
    try {
      const fullEquation = equation + display;
      // Use Function instead of eval for a bit more safety, though still risky in general
      // In this controlled dashboard context, it's acceptable for a simple calculator
      const result = new Function(`return ${fullEquation.replace(/[^-()\d/*+.]/g, '')}`)();
      setDisplay(String(Number(result.toFixed(8))));
      setEquation('');
      setShouldReset(true);
    } catch (e) {
      setDisplay('Error');
      setEquation('');
      setShouldReset(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setShouldReset(false);
  };

  const buttons = [
    { label: 'C', action: clear, color: 'text-rose-400' },
    { label: '÷', action: () => handleOperator('/'), color: 'text-cyan-400' },
    { label: '×', action: () => handleOperator('*'), color: 'text-cyan-400' },
    { label: '⌫', action: () => setDisplay(display.length > 1 ? display.slice(0, -1) : '0'), color: 'text-white/60' },
    { label: '7', action: () => handleNumber('7') },
    { label: '8', action: () => handleNumber('8') },
    { label: '9', action: () => handleNumber('9') },
    { label: '-', action: () => handleOperator('-'), color: 'text-cyan-400' },
    { label: '4', action: () => handleNumber('4') },
    { label: '5', action: () => handleNumber('5') },
    { label: '6', action: () => handleNumber('6') },
    { label: '+', action: () => handleOperator('+'), color: 'text-cyan-400' },
    { label: '1', action: () => handleNumber('1') },
    { label: '2', action: () => handleNumber('2') },
    { label: '3', action: () => handleNumber('3') },
    { label: '=', action: calculate, color: 'bg-cyan-500/20 text-cyan-400', rowSpan: 2 },
    { label: '0', action: () => handleNumber('0'), colSpan: 2 },
    { label: '.', action: () => handleNumber('.') },
  ];

  return (
    <div className="relative group/card">
      {/* Animated Border Glow (Subtle for System) */}
      <div className="absolute -inset-[1px] rounded-xl bg-cyan-500/20 opacity-0 group-hover/card:opacity-100 blur-[1px] transition-opacity duration-500"></div>

      <div className={`relative backdrop-blur-xl rounded-xl border overflow-hidden transition-all duration-500 bg-cyan-900/10 border-cyan-500/30 shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)] flex flex-col h-full ${isCollapsed ? 'min-h-0' : 'min-h-[400px]'}`}>
        {/* Header */}
        <div 
            className="bg-gradient-to-r from-black/40 to-black/10 px-6 py-4 flex justify-between items-center cursor-pointer select-none group/header"
            onClick={onToggle}
            title="Toggle card"
        >
          <div className="flex items-center space-x-3">
            <div className="text-cyan-400 w-5 h-5 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              {ICONS.Calculator}
            </div>
            <h3 className="text-cyan-400 font-black text-lg uppercase tracking-wider drop-shadow-sm group-hover/header:text-cyan-200 transition-colors">
              Calculator
            </h3>
          </div>
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={clear}
              className="text-cyan-400/80 hover:text-cyan-300 transition-colors flex items-center space-x-1.5 p-1 rounded-md hover:bg-cyan-400/10"
              aria-label="Clear calculator"
            >
              <div className="w-4 h-4">{ICONS.Trash}</div>
              <span className="text-sm font-semibold opacity-90 group-hover:opacity-100">Clear</span> 
            </button>
            <button 
              onClick={onToggle} 
              className="text-white/60 hover:text-white transition-colors p-1"
              aria-expanded={!isCollapsed}
              title="Toggle collapse"
            >
              <div className={`w-5 h-5 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                {ICONS.ChevronUp}
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden flex-grow flex flex-col ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
          <div className="p-6 pt-4 flex flex-col h-full space-y-4">
            {/* Display */}
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col items-end justify-center min-h-[80px] shadow-inner">
              <div className="text-white/40 text-xs font-mono h-4 truncate w-full text-right mb-1">
                {equation}
              </div>
              <div className="text-white text-3xl font-mono tracking-tighter truncate w-full text-right">
                {display}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-2 flex-grow">
              {buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  className={`
                    flex items-center justify-center rounded-xl text-lg font-medium transition-all duration-200 active:scale-90
                    ${btn.color || 'text-white/80 hover:text-white hover:bg-white/5'}
                    ${btn.colSpan === 2 ? 'col-span-2' : ''}
                    ${btn.rowSpan === 2 ? 'row-span-2' : ''}
                    bg-white/5 border border-white/5 hover:border-white/10
                  `}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorWidget;
