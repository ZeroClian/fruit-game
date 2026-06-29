import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../components/layout/GameLayout';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useGameStore } from '../stores/gameStore';
import { deleteSaveData } from '../engine/saveManager';

export const GameOverPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLevel, coins, completedLevels, highScores, resetGame } = useGameStore();

  const highestLevel = completedLevels.length > 0
    ? Math.max(...completedLevels)
    : 0;

  const totalCoinsEarned = Object.values(highScores).reduce((sum, score) => sum + score, 0);

  const handleRestart = () => {
    resetGame();
    deleteSaveData();
    navigate('/');
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  return (
    <GameLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        {/* Title */}
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">游戏结束</h1>
          <p className="text-[var(--text-secondary)] mt-2">生命值已耗尽</p>
        </div>

        {/* Stats */}
        <Card className="w-full max-w-sm">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">到达关卡</span>
              <span className="font-bold text-[var(--text-primary)]">
                第 {highestLevel} 关
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">当前关卡</span>
              <span className="font-bold text-[var(--text-primary)]">
                第 {currentLevel} 关
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">剩余金币</span>
              <span className="font-bold text-[var(--accent-dark)]">🪙 {coins}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">累计得分</span>
              <span className="font-bold text-[var(--success)]">{totalCoinsEarned}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">通过关卡数</span>
              <span className="font-bold text-[var(--primary)]">{completedLevels.length}/24</span>
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-64">
          <Button variant="primary" size="lg" onClick={handleRestart}>
            🔄 重新开始
          </Button>
          <Button variant="secondary" size="lg" onClick={handleBackToMenu}>
            🏠 返回主菜单
          </Button>
        </div>
      </div>
    </GameLayout>
  );
};
