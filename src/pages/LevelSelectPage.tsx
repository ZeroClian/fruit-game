import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../components/layout/GameLayout';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useGameStore } from '../stores/gameStore';
import { getLevelConfig } from '../data/levels';

const BIG_LEVEL_NAMES = [
  '🍎 初识果香',
  '🍌 倍率初现',
  '🍇 混合挑战',
  '🧊 冰冻之域',
  '☠️ 毒果暗影',
  '🔀 混沌之境',
  '🙈 全盲对决',
  '💀 终极试炼',
];

export const LevelSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { completedLevels, coins, lives, currentLevel } = useGameStore();

  // 8 big levels, each with 3 sub-levels
  const bigLevels = Array.from({ length: 8 }, (_, i) => i + 1);

  const isLevelUnlocked = (levelNumber: number): boolean => {
    if (levelNumber === 1) return true;
    return completedLevels.includes(levelNumber - 1);
  };

  const isLevelCompleted = (levelNumber: number): boolean => {
    return completedLevels.includes(levelNumber);
  };

  const isCurrentLevel = (levelNumber: number): boolean => {
    return levelNumber === currentLevel;
  };

  const handleLevelClick = (levelNumber: number) => {
    if (isLevelUnlocked(levelNumber)) {
      navigate(`/game?level=${levelNumber}`);
    }
  };

  return (
    <GameLayout>
      <TopBar title="关卡选择" coins={coins} lives={lives} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {bigLevels.map(bigLevel => {
          const subLevels = [1, 2, 3];
          const anyUnlocked = subLevels.some(sub => {
            const levelNum = (bigLevel - 1) * 3 + sub;
            return isLevelUnlocked(levelNum);
          });

          return (
            <Card
              key={bigLevel}
              className={`${!anyUnlocked ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-bold text-[var(--primary)]">
                  {bigLevel}
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {BIG_LEVEL_NAMES[bigLevel - 1]}
                </h3>
              </div>

              <div className="flex gap-3">
                {subLevels.map(sub => {
                  const levelNumber = (bigLevel - 1) * 3 + sub;
                  const unlocked = isLevelUnlocked(levelNumber);
                  const completed = isLevelCompleted(levelNumber);
                  const current = isCurrentLevel(levelNumber);
                  const config = getLevelConfig(levelNumber);

                  return (
                    <Button
                      key={sub}
                      variant={current ? 'accent' : completed ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleLevelClick(levelNumber)}
                      disabled={!unlocked}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-xs">
                        {completed ? '✅' : !unlocked ? '🔒' : `第${sub}关`}
                      </span>
                      <span className="text-xs text-[var(--text-light)]">
                        目标 {config.targetScore}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </Card>
          );
        })}

        {/* Shop button */}
        <div className="pt-2">
          <Button
            variant="accent"
            size="lg"
            className="w-full"
            onClick={() => navigate('/shop')}
          >
            🛒 前往商店
          </Button>
        </div>
      </div>
    </GameLayout>
  );
};
