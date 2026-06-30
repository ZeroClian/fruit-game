import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { GameLayout } from '../components/layout/GameLayout';
import { hasSaveData } from '../engine/saveManager';

const FALLING_FRUITS = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍉', '🥝', '🍓', '🍑'];

interface FallingFruit {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const [hasSave, setHasSave] = useState(false);
  const [fruits, setFruits] = useState<FallingFruit[]>([]);

  useEffect(() => {
    setHasSave(hasSaveData());

    // Generate falling fruit animation elements
    const items: FallingFruit[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: FALLING_FRUITS[Math.floor(Math.random() * FALLING_FRUITS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 6,
      size: 20 + Math.random() * 24,
    }));
    setFruits(items);
  }, []);

  return (
    <GameLayout>
      {/* Falling fruit background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {fruits.map(f => (
          <div
            key={f.id}
            className="absolute animate-fall opacity-30"
            style={{
              left: `${f.left}%`,
              fontSize: `${f.size}px`,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
            }}
          >
            {f.emoji}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-8 px-4">
        {/* Title */}
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🍎</div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">
            水果小丑牌
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">选择 · 组合 · 得分</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-64">
          <Button variant="primary" size="lg" onClick={() => navigate('/levels')}>
            🎮 开始游戏
          </Button>
          {hasSave && (
            <Button variant="accent" size="lg" onClick={() => navigate('/levels')}>
              📂 继续游戏
            </Button>
          )}
          <Button variant="secondary" size="lg" onClick={() => navigate('/rules')} className="!bg-[#20BF6B] hover:!bg-[#1aa85c]">
            📖 游戏规则
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/settings')}>
            ⚙️ 设置
          </Button>
        </div>
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </GameLayout>
  );
};
