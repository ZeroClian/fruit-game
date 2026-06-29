import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../components/layout/GameLayout';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useGameStore } from '../stores/gameStore';
import { useShopStore } from '../stores/shopStore';

const CATEGORY_TABS = [
  { key: 'permanent', label: '永久加成' },
  { key: 'probability', label: '概率加成' },
  { key: 'consumable', label: '道具' },
  { key: 'unlock', label: '解锁' },
] as const;

type CategoryKey = typeof CATEGORY_TABS[number]['key'];

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

  const isMaxed = (item: typeof shopItems[number]): boolean => {
    return item.maxPurchases !== -1 && item.currentPurchases >= item.maxPurchases;
  };

  return (
    <GameLayout>
      <TopBar title="🛒 商店" coins={coins} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredItems.map(item => {
            const affordable = canAfford(item.id, coins);
            const maxed = isMaxed(item);
            const disabled = !affordable || maxed;

            return (
              <Card key={item.id}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[var(--text-primary)]">{item.name}</div>
                    <div className="text-sm text-[var(--text-secondary)]">{item.description}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[var(--accent-dark)] font-bold text-sm">
                        🪙 {item.price}
                      </span>
                      {item.maxPurchases !== -1 && (
                        <span className="text-xs text-[var(--text-secondary)]">
                          {item.currentPurchases}/{item.maxPurchases}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => handleBuy(item.id, item.price)}
                    disabled={disabled}
                  >
                    {maxed ? '已满' : '购买'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-[var(--text-secondary)] py-8">
            该分类暂无商品
          </div>
        )}

        {/* Back button */}
        <div className="pt-2">
          <Button
            variant="secondary"
            size="lg"
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
