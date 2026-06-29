import type { ShopItem } from '../types/shop';

export const SHOP_ITEMS: ShopItem[] = [
  // Permanent upgrades
  { id: 'apple_boost', name: '苹果强化', description: '苹果基础分+5', icon: '🍎', price: 8, category: 'permanent', maxPurchases: 5, currentPurchases: 0 },
  { id: 'banana_boost', name: '香蕉强化', description: '香蕉加成+1', icon: '🍌', price: 10, category: 'permanent', maxPurchases: 5, currentPurchases: 0 },
  { id: 'cherry_boost', name: '车厘子强化', description: '车厘子倍率+0.1', icon: '🍒', price: 12, category: 'permanent', maxPurchases: 3, currentPurchases: 0 },
  { id: 'orange_boost', name: '橙子强化', description: '橙子基础分+10', icon: '🍊', price: 10, category: 'permanent', maxPurchases: 5, currentPurchases: 0 },
  { id: 'grape_boost', name: '葡萄强化', description: '葡萄基础分+5', icon: '🍇', price: 8, category: 'permanent', maxPurchases: 5, currentPurchases: 0 },
  { id: 'watermelon_boost', name: '西瓜强化', description: '西瓜基础分+15', icon: '🍉', price: 15, category: 'permanent', maxPurchases: 5, currentPurchases: 0 },
  { id: 'kiwi_boost', name: '猕猴桃强化', description: '猕猴桃加成+10', icon: '🥝', price: 12, category: 'permanent', maxPurchases: 5, currentPurchases: 0 },

  // Probability upgrades
  { id: 'apple_luck', name: '苹果幸运', description: '苹果出现概率提升', icon: '🍀', price: 6, category: 'probability', maxPurchases: 3, currentPurchases: 0 },
  { id: 'banana_luck', name: '香蕉幸运', description: '香蕉出现概率提升', icon: '🍀', price: 8, category: 'probability', maxPurchases: 3, currentPurchases: 0 },
  { id: 'cherry_luck', name: '车厘子幸运', description: '车厘子出现概率提升', icon: '🍀', price: 8, category: 'probability', maxPurchases: 3, currentPurchases: 0 },

  // Consumables
  { id: 'life_potion', name: '生命药水', description: '恢复1条生命', icon: '🧪', price: 5, category: 'consumable', maxPurchases: -1, currentPurchases: 0 },
  { id: 'reroll_card', name: '重抽卡', description: '重新生成矩阵', icon: '🃏', price: 6, category: 'consumable', maxPurchases: -1, currentPurchases: 0 },
  { id: 'xray_card', name: '透视卡', description: '揭示隐藏水果', icon: '👁️', price: 4, category: 'consumable', maxPurchases: -1, currentPurchases: 0 },
  { id: 'shield_card', name: '护盾卡', description: '免疫1次毒果', icon: '🛡️', price: 8, category: 'consumable', maxPurchases: -1, currentPurchases: 0 },
  { id: 'precision_card', name: '精准卡', description: '本次选择必出高分', icon: '🎯', price: 5, category: 'consumable', maxPurchases: -1, currentPurchases: 0 },

  // Unlocks
  { id: 'unlock_grape', name: '解锁葡萄', description: '提前解锁葡萄', icon: '🍇', price: 10, category: 'unlock', maxPurchases: 1, currentPurchases: 0 },
  { id: 'unlock_orange', name: '解锁橙子', description: '提前解锁橙子', icon: '🍊', price: 15, category: 'unlock', maxPurchases: 1, currentPurchases: 0 },
  { id: 'unlock_watermelon', name: '解锁西瓜', description: '提前解锁西瓜', icon: '🍉', price: 20, category: 'unlock', maxPurchases: 1, currentPurchases: 0 },
  { id: 'unlock_kiwi', name: '解锁猕猴桃', description: '提前解锁猕猴桃', icon: '🥝', price: 18, category: 'unlock', maxPurchases: 1, currentPurchases: 0 },
  { id: 'unlock_strawberry', name: '解锁草莓', description: '提前解锁草莓', icon: '🍓', price: 15, category: 'unlock', maxPurchases: 1, currentPurchases: 0 },
  { id: 'unlock_peach', name: '解锁桃子', description: '提前解锁桃子', icon: '🍑', price: 20, category: 'unlock', maxPurchases: 1, currentPurchases: 0 },
];
