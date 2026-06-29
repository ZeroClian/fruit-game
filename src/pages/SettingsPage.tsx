import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../components/layout/GameLayout';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useGameStore } from '../stores/gameStore';
import { useAudioStore } from '../stores/audioStore';
import { deleteSaveData } from '../engine/saveManager';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetGame } = useGameStore();
  const { musicEnabled, sfxEnabled, toggleMusic, toggleSfx } = useAudioStore();
  const [showResetModal, setShowResetModal] = useState(false);

  const handleReset = () => {
    resetGame();
    deleteSaveData();
    setShowResetModal(false);
    navigate('/');
  };

  return (
    <GameLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">⚙️ 设置</h1>

        <div className="w-full max-w-sm space-y-4">
          {/* Music toggle */}
          <div className="flex items-center justify-between bg-[var(--bg-card)] rounded-2xl p-4 shadow-sm">
            <span className="text-[var(--text-primary)] font-medium">🎵 音乐</span>
            <Button
              variant={musicEnabled ? 'primary' : 'secondary'}
              size="sm"
              onClick={toggleMusic}
            >
              {musicEnabled ? '开启' : '关闭'}
            </Button>
          </div>

          {/* SFX toggle */}
          <div className="flex items-center justify-between bg-[var(--bg-card)] rounded-2xl p-4 shadow-sm">
            <span className="text-[var(--text-primary)] font-medium">🔊 音效</span>
            <Button
              variant={sfxEnabled ? 'primary' : 'secondary'}
              size="sm"
              onClick={toggleSfx}
            >
              {sfxEnabled ? '开启' : '关闭'}
            </Button>
          </div>

          {/* Reset progress */}
          <div className="bg-[var(--bg-card)] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-primary)] font-medium">🗑️ 重置进度</span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowResetModal(true)}
              >
                重置
              </Button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              此操作将清除所有存档数据，不可恢复
            </p>
          </div>
        </div>

        {/* Back button */}
        <Button variant="secondary" size="lg" onClick={() => navigate('/')}>
          返回主菜单
        </Button>
      </div>

      {/* Reset confirmation modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="确认重置"
      >
        <p className="text-[var(--text-secondary)] mb-4">
          确定要重置所有游戏进度吗？此操作不可撤销！
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)}>
            取消
          </Button>
          <Button variant="danger" size="sm" onClick={handleReset}>
            确认重置
          </Button>
        </div>
      </Modal>
    </GameLayout>
  );
};
