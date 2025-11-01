
import React from 'react';
import { Theme, TileValue } from '../types';

interface TileProps {
  level: TileValue;
  theme: Theme;
  isMerging?: boolean;
  isNew?: boolean;
}

const Tile: React.FC<TileProps> = ({ level, theme, isMerging = false, isNew = false }) => {
  const emoji = level > 0 ? theme.emojis[level] || '❓' : '';
  const color = level > 0 ? theme.colors[level] || 'bg-gray-400' : theme.colors[0];

  const animationClasses = isMerging
    ? 'animate-ping'
    : isNew
    ? 'animate-bounce'
    : 'scale-100';
  
  return (
    <div
      className={`
        aspect-square rounded-lg flex items-center justify-center 
        transition-all duration-300 ease-in-out
        ${color}
        ${level > 0 ? 'shadow-lg shadow-black/30' : ''}
        transform ${animationClasses}
      `}
    >
      <span className="text-2xl md:text-3xl lg:text-4xl" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
        {emoji}
      </span>
    </div>
  );
};

export default Tile;
