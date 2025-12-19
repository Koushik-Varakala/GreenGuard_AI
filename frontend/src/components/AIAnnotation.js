import React from 'react';

const AIAnnotation = ({ message, type = 'info', position = 'top-right' }) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'warning':
        return {
          bg: 'from-yellow-400/20 to-orange-400/20',
          border: 'border-yellow-400/50',
          text: 'text-yellow-300',
          icon: '⚠️',
        };
      case 'alert':
        return {
          bg: 'from-red-400/20 to-red-500/20',
          border: 'border-red-400/50',
          text: 'text-red-300',
          icon: '🚨',
        };
      case 'success':
        return {
          bg: 'from-neon-green/20 to-neon-teal/20',
          border: 'border-neon-green/50',
          text: 'text-neon-green',
          icon: '✓',
        };
      default:
        return {
          bg: 'from-neon-cyan/20 to-neon-blue/20',
          border: 'border-neon-cyan/50',
          text: 'text-neon-cyan',
          icon: '🤖',
        };
    }
  };

  const config = getTypeConfig();
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} glass-cosmic bg-gradient-to-r ${config.bg} border-2 ${config.border} rounded-xl p-3 max-w-xs z-50 float-slow animate-fade-in`}
      style={{
        boxShadow: `0 0 20px rgba(0, 255, 136, 0.3)`,
      }}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">{config.icon}</span>
        <p className={`text-xs ${config.text} font-medium leading-relaxed`}>
          {message}
        </p>
      </div>
      {/* Connecting Line */}
      <div className="absolute w-1 h-8 bg-gradient-to-b from-neon-green to-transparent opacity-50" 
           style={{
             [position.includes('right') ? 'left' : 'right']: '-8px',
             top: '50%',
             transform: 'translateY(-50%)',
           }}
      ></div>
    </div>
  );
};

export default AIAnnotation;



