import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../components/layout/GameLayout';
import { TopBar } from '../components/layout/TopBar';

interface RuleSection {
  title: string;
  icon: string;
  content: React.ReactNode;
}

const SECTIONS: RuleSection[] = [
  {
    title: '基本玩法',
    icon: '🎮',
    content: (
      <div className="space-y-2">
        <p>屏幕上有一个 10×10 的水果矩阵，你需要选择一个 3×3 的区域来得分。</p>
        <p>点击矩阵中的任意位置，会选中以该位置为左上角的 3×3 区域。确认选择后，该区域的分数就会累加到你的总分中。</p>
        <p>每关有有限的选择次数，总分达到目标分数即可过关！</p>
      </div>
    ),
  },
  {
    title: '水果类型',
    icon: '🍎',
    content: (
      <div className="space-y-3">
        <div className="bg-[var(--bg-main)] rounded-lg p-2.5">
          <div className="font-bold text-sm mb-1">基础分水果</div>
          <p className="text-xs text-[var(--text-secondary)] mb-2">直接提供基础分数，是得分的基石。</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span>🍎 苹果 = <span className="font-mono font-bold">10</span> 分</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🍇 葡萄 = <span className="font-mono font-bold">15</span> 分</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🍊 橙子 = <span className="font-mono font-bold">25</span> 分</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🍉 西瓜 = <span className="font-mono font-bold">50</span> 分</span>
            </div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            例：选到 3 个🍎 + 1 个🍉 = 30 + 50 = 80 基础分
          </p>
        </div>

        <div className="bg-[var(--bg-main)] rounded-lg p-2.5">
          <div className="font-bold text-sm mb-1">加法倍率水果</div>
          <p className="text-xs text-[var(--text-secondary)] mb-2">增加固定倍率，让分数翻得更高。</p>
          <div className="space-y-1 text-sm">
            <div>🍌 香蕉 = 倍率 <span className="font-mono font-bold">+3</span></div>
            <div>🥝 猕猴桃 = 倍率 <span className="font-mono font-bold">+20</span></div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            例：80 基础分 + 2 根🍌(倍率+6) → 80 × 6 = 480 分
          </p>
        </div>

        <div className="bg-[var(--bg-main)] rounded-lg p-2.5">
          <div className="font-bold text-sm mb-1">乘法倍率水果</div>
          <p className="text-xs text-[var(--text-secondary)] mb-2">乘法叠加，让分数爆炸式增长！</p>
          <div className="space-y-1 text-sm">
            <div>🍒 车厘子 = 倍率 <span className="font-mono font-bold">×1.1</span></div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            例：80 基础分 + 2 根🍌(倍率+6) + 1 个🍒(×1.1) → 80 × 6 × 1.1 = 528 分
          </p>
        </div>

        <div className="bg-[var(--bg-main)] rounded-lg p-2.5">
          <div className="font-bold text-sm mb-1">减法倍率水果</div>
          <p className="text-xs text-[var(--text-secondary)] mb-2">减少你的倍率，要小心！</p>
          <div className="space-y-1 text-sm">
            <div>🍋 柠檬 = 倍率 <span className="font-mono font-bold">-5</span></div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            例：2 根🍌(+6) + 1 个🍋(-5) → 实际倍率只有 +1
          </p>
        </div>

        <div className="bg-[var(--bg-main)] rounded-lg p-2.5">
          <div className="font-bold text-sm mb-1">特殊水果</div>
          <div className="space-y-1 text-sm">
            <div>🍓 草莓 = 50% 概率分数翻倍</div>
            <div>🍑 桃子 = 分数必定翻倍</div>
            <div>☠️ 毒果 = 整个选择分数归零！</div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            例：480 分 + 🍑 → 960 分！但如果有 ☠️ 毒果 → 0 分 💀
          </p>
        </div>
      </div>
    ),
  },
  {
    title: '分数计算',
    icon: '🧮',
    content: (
      <div className="space-y-2">
        <p>分数的计算公式为：</p>
        <div className="bg-[var(--bg-main)] rounded-lg p-2.5 text-center font-mono text-sm font-bold">
          总分 = 基础分 × (加法倍率 - 减法倍率) × 乘法倍率
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          如果有🍑桃子，最终分数再 ×2；如果有🍓草莓，50% 概率 ×2；如果有☠️毒果，直接 0 分。
        </p>
        <div className="bg-[var(--bg-main)] rounded-lg p-2.5 mt-2">
          <div className="font-bold text-sm mb-1">完整举例</div>
          <p className="text-xs">选中：🍎🍎🍎 + 🍉 + 🍌🍌 + 🍒</p>
          <p className="text-xs">基础分 = 10+10+10+50 = 80</p>
          <p className="text-xs">加法倍率 = 3+3 = 6</p>
          <p className="text-xs">乘法倍率 = 1.1</p>
          <p className="text-xs font-bold">总分 = 80 × 6 × 1.1 = 528</p>
        </div>
      </div>
    ),
  },
  {
    title: '关卡与限制',
    icon: '🏔️',
    content: (
      <div className="space-y-2">
        <p>游戏共有 8 大关，每关 3 小关，共 24 关。随着关卡推进，会出现各种限制条件：</p>
        <div className="bg-[var(--bg-main)] rounded-lg p-2.5 space-y-1 text-sm">
          <div>🧊 <b>冰冻</b> — 部分格子被冻结，无法选中</div>
          <div>🙈 <b>隐藏</b> — 部分水果被遮挡，看不到是什么</div>
          <div>🔀 <b>洗牌</b> — 每次选择后，剩余水果重新打乱</div>
          <div>⏱️ <b>限时</b> — 选择后有倒计时，时间到自动确认</div>
          <div>🔄 <b>反转</b> — 加法变减法，减法变加法，乘法变除法</div>
          <div>☠️ <b>毒果</b> — 矩阵中出现毒果</div>
          <div>🎯 <b>额外目标</b> — 除了达标分数，还需满足额外条件</div>
        </div>
      </div>
    ),
  },
  {
    title: '商店与道具',
    icon: '🛒',
    content: (
      <div className="space-y-2">
        <p>过关获得的金币可以在商店中购买升级和道具：</p>
        <div className="bg-[var(--bg-main)] rounded-lg p-2.5 space-y-1 text-sm">
          <div><b>永久加成</b> — 提升水果的基础数值（如🍎苹果强化 +5）</div>
          <div><b>概率加成</b> — 提升水果的出现概率</div>
          <div><b>道具</b> — 关卡中使用的消耗品：</div>
        </div>
        <div className="bg-[var(--bg-main)] rounded-lg p-2.5 space-y-1 text-sm">
          <div>🧪 生命药水 — 恢复 1 条生命</div>
          <div>🃏 重抽卡 — 重新生成矩阵</div>
          <div>👁️ 透视卡 — 揭示所有隐藏水果</div>
          <div>🛡️ 护盾卡 — 免疫 1 次毒果</div>
          <div>🎯 精准卡 — 本次选择分数翻倍</div>
        </div>
      </div>
    ),
  },
];

export const RulesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <GameLayout>
      <TopBar title="📖 游戏规则" onBack={() => navigate('/')} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {SECTIONS.map(section => (
          <div key={section.title} className="bg-[var(--bg-card)] rounded-2xl p-4 shadow-sm">
            <div className="text-base font-bold text-[var(--text-primary)] mb-2">
              {section.icon} {section.title}
            </div>
            <div className="text-sm text-[var(--text-primary)] leading-relaxed">
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </GameLayout>
  );
};
