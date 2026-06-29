import React from 'react';
import { motion } from 'framer-motion';
import { FRUIT_CONFIGS } from '../../data/fruits';

interface MatrixCellProps {
  fruitType: string;
  isUsed: boolean;
  isSelected: boolean;
  isFrozen: boolean;
  isHidden: boolean;
  isBlind: boolean;
  size?: number;
}

export const MatrixCell: React.FC<MatrixCellProps> = ({ fruitType, isUsed, isSelected, isFrozen, isHidden, isBlind, size = 40 }) => {
  const config = FRUIT_CONFIGS[fruitType];
  const displayIcon = isBlind || isHidden ? '❓' : (config?.icon || '❓');

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isUsed ? 0.8 : 1,
        opacity: isUsed ? 0 : 1,
      }}
      transition={{
        scale: { type: 'spring', stiffness: 300, damping: 20 },
        opacity: { duration: 0.3 },
      }}
      className="flex items-center justify-center border border-gray-200"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.6,
        backgroundColor: isSelected ? 'rgba(255, 230, 109, 0.5)' : isUsed ? 'rgba(0,0,0,0.1)' : isFrozen ? 'rgba(100, 200, 255, 0.3)' : 'white',
        borderRadius: 4,
      }}
    >
      {/* Glow/pulse animation when selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded"
          animate={{
            boxShadow: [
              '0 0 4px rgba(255,230,109,0.6)',
              '0 0 12px rgba(255,230,109,1)',
              '0 0 4px rgba(255,230,109,0.6)',
            ],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      <motion.span
        animate={{
          scale: isSelected ? 1.15 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="relative z-10"
      >
        {displayIcon}
      </motion.span>
    </motion.div>
  );
};
