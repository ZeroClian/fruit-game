import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../components/layout/GameLayout';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/common/Button';
import { useGameStore } from '../stores/gameStore';
import { useShopStore } from '../stores/shopStore';
import { FRUIT_CONFIGS, BOOST_STEPS } from '../data/fruits';
import { PROBABILITIES_BY_BIG_LEVEL } from '../data/levels';
import type { ShopItem } from '../types/shop';

const CATEGORY_TABS = [
  { key: 'permanent', label: '永久加成' },
  { key: 'probability', label: '概率加成' },
  { key: 'consumable', label: '道具' },
] as const;

type CategoryKey = typeof CATEGORY_TABS[number]['key'];

// 永久加成按效果类型分组
const PERMANENT_GROUPS = [
  {
    key: 'base',
    label: '基础分',
    desc: '增加分数型水果的基础分',
    itemIds: ['apple_boost', 'grape_boost', 'orange_boost', 'watermelon_boost'],
  },
  {
    key: 'add',
    label: '倍率',
    desc: '增加加法倍率型水果的倍率值',
    itemIds: ['banana_boost', 'kiwi_boost'],
  },
  {
    key: 'mul',
    label: '倍乘',
    desc: '增加乘法倍率型水果的倍乘值',
    itemIds: ['cherry_boost'],
  },
];

// 水果 ID 映射到 fruitType（用于查询基础概率与强化步长）
const ITEM_FRUIT_MAP: Record<string, string> = {
  apple_boost: 'apple',
  banana_boost: 'banana',
  cherry_boost: 'cherry',
  orange_boost: 'orange',
  grape_boost: 'grape',
  watermelon_boost: 'watermelon',
  kiwi_boost: 'kiwi',
  apple_luck: 'apple',
  banana_luck: 'banana',
  cherry_luck: 'cherry',
};

// 取第一关作为代表性的基础概率展示
const BASE_PROBABILITIES = PROBABILITIES_BY_BIG_LEVEL[1];

/**
 * 计算某个道具当前的加成数值（已购买累计）
 */
function getCurrentBonus(item: ShopItem): string {
  const fruit = ITEM_FRUIT_MAP[item.id];
  if (!fruit) return '-';

  if (item.category === 'permanent') {
    const config = FRUIT_CONFIGS[fruit];
    const base = config?.baseValue ?? 0;
    const step = BOOST_STEPS[fruit] ?? 0;
    const total = base + step * item.currentPurchases;
    return `${total}`;
  }

  if (item.category === 'probability') {
    // 每次购买 +5% 概率
    return `+${item.currentPurchases * 5}%`;
  }

  return '-';
}

/**
 * 计算某个水果当前的出现概率（基础 + 加成）
 */
function getCurrentProbability(item: ShopItem): string {
  const fruit = ITEM_FRUIT_MAP[item.id];
  if (!fruit) return '-';

  const base = BASE_PROBABILITIES[fruit] ?? 0;
  const bonus = item.category === 'probability' ? item.currentPurchases * 0.05 : 0;
  const total = base + bonus;
  return `${Math.round(total * 100)}%`;
}

export const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { coins, purchaseUpgrade } = useGameStore();
  const { shopItems, purchaseItem, canAfford } = useShopStore();
  const [activeTab, setActiveTab] = useState<CategoryKey>('permanent');

  const filteredItems = shopItems.filter(item => item.category === activeTab);

  const handleBuy = (itemId: string, price: number) => {
    if (!canAfford(itemId, coins)) return;
    const success = purchaseItem(itemId);
    if (success) {
      purchaseUpgrade(itemId, price);
    }
  };

  const isMaxed = (item: ShopItem): boolean => {
    return item.maxPurchases !== -1 && item.currentPurchases >= item.maxPurchases;
  };

  return (
    <GameLayout>
      <TopBar title="🛒 商店" coins={coins} onBack={() => navigate('/')} />

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORY_TABS.map(tab => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Permanent items grouped by effect type */}
        {activeTab === 'permanent' ? (
          <div className="space-y-4">
            {PERMANENT_GROUPS.map(group => {
              const groupItems = shopItems.filter(i => group.itemIds.includes(i.id));
              if (groupItems.length === 0) return null;

              return (
                <div key={group.key}>
                  {/* 分组标题 */}
                  <div className="mb-1.5 px-1">
                    <span className="font-bold text-sm text-[var(--text-primary)]">{group.label}</span>
                    <span className="text-[10px] text-[var(--text-secondary)] ml-2">{group.desc}</span>
                  </div>
                  {/* 2 列卡片网格 */}
                  <div className="grid grid-cols-2 gap-2">
                    {groupItems.map(item => {
                      const affordable = canAfford(item.id, coins);
                      const maxed = isMaxed(item);
                      const disabled = !affordable || maxed;

                      return (
                        <div
                          key={item.id}
                          className="bg-[var(--bg-card)] rounded-xl p-2 shadow-md flex flex-col"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-bold text-xs text-[var(--text-primary)] line-clamp-1">
                              {item.name}
                            </span>
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)] mb-1 line-clamp-1">
                            {item.description}
                          </div>
                          <div className="bg-[var(--bg-main)] rounded-lg p-1.5 mb-2 space-y-0.5">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-[var(--text-secondary)]">当前加成</span>
                              <span className="font-bold text-[var(--success)] font-mono">
                                {getCurrentBonus(item)}
                              </span>
                            </div>
                            {item.maxPurchases !== -1 && (
                              <div className="flex justify-between text-[10px]">
                                <span className="text-[var(--text-secondary)]">等级</span>
                                <span className="text-[var(--text-secondary)] font-mono">
                                  {item.currentPurchases}/{item.maxPurchases}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mt-auto flex items-center justify-between gap-1.5">
                            <span className="text-[var(--accent-dark)] font-bold text-xs">
                              🪙 {item.price}
                            </span>
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => handleBuy(item.id, item.price)}
                              disabled={disabled}
                              className="!px-2 !py-1 !text-xs"
                            >
                              {maxed ? '已满' : '升级'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 概率加成 & 道具：普通 2 列网格 */
          <div className="grid grid-cols-2 gap-2">
            {filteredItems.map(item => {
              const affordable = canAfford(item.id, coins);
              const maxed = isMaxed(item);
              const disabled = !affordable || maxed;
              const isUpgradeItem = item.category === 'probability';

              return (
                <div
                  key={item.id}
                  className="bg-[var(--bg-card)] rounded-xl p-2 shadow-md flex flex-col"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-bold text-xs text-[var(--text-primary)] line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] mb-1 line-clamp-1">
                    {item.description}
                  </div>
                  {isUpgradeItem && (
                    <div className="bg-[var(--bg-main)] rounded-lg p-1.5 mb-2 space-y-0.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[var(--text-secondary)]">当前加成</span>
                        <span className="font-bold text-[var(--success)] font-mono">
                          {getCurrentBonus(item)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[var(--text-secondary)]">当前概率</span>
                        <span className="font-bold text-[var(--text-primary)] font-mono">
                          {getCurrentProbability(item)}
                        </span>
                      </div>
                      {item.maxPurchases !== -1 && (
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[var(--text-secondary)]">等级</span>
                          <span className="text-[var(--text-secondary)] font-mono">
                            {item.currentPurchases}/{item.maxPurchases}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-1.5">
                    <span className="text-[var(--accent-dark)] font-bold text-xs">
                      🪙 {item.price}
                    </span>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => handleBuy(item.id, item.price)}
                      disabled={disabled}
                      className="!px-2 !py-1 !text-xs"
                    >
                      {maxed ? '已满' : isUpgradeItem ? '升级' : '购买'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center text-[var(--text-secondary)] py-8">
            该分类暂无商品
          </div>
        )}

        {/* Back button */}
        <div className="pt-1">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => navigate('/levels')}
          >
            返回关卡选择
          </Button>
        </div>
      </div>
    </GameLayout>
  );
};
