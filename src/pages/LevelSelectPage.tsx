import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../components/layout/GameLayout';
import { TopBar } from '../components/layout/TopBar';
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

      <div className="flex-1 overflow-y-auto p-2.5 sm:p-4 space-y-2.5 sm:space-y-4">
        {bigLevels.map(bigLevel => {
          const subLevels = [1, 2, 3];
          const anyUnlocked = subLevels.some(sub => {
            const levelNum = (bigLevel - 1) * 3 + sub;
            return isLevelUnlocked(levelNum);
          });

          return (
            <div
              key={bigLevel}
              className={`bg-[var(--bg-card)] rounded-2xl p-2.5 sm:p-4 shadow-md ${!anyUnlocked ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1.5 sm:gap-3 sm:mb-3">
                <span className="text-lg sm:text-2xl font-bold text-[var(--primary)]">
                  {bigLevel}
                </span>
                <h3 className="text-sm sm:text-lg font-bold text-[var(--text-primary)]">
                  {BIG_LEVEL_NAMES[bigLevel - 1]}
                </h3>
              </div>

              <div className="flex gap-2 sm:gap-3">
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
                      className="flex-1 flex flex-col items-center gap-0.5 sm:gap-1 !px-1.5 sm:!px-3 !py-1 sm:!py-1.5"
                    >
                      <span className="text-xs">
                        {completed ? '✅' : !unlocked ? '🔒' : `第${sub}关`}
                      </span>
                      <span className="text-[11px] sm:text-xs text-[var(--text-light)]">
                        目标 {config.targetScore}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Shop button */}
        <div className="pt-1 sm:pt-2">
          <Button
            variant="accent"
            size="sm"
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
