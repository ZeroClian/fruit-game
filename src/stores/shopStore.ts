import { create } from 'zustand';
import type { ShopItem } from '../types/shop';
import { SHOP_ITEMS } from '../data/shopItems';

interface ShopStore {
  shopItems: ShopItem[];
  purchaseItem: (itemId: string) => boolean;
  canAfford: (itemId: string, coins: number) => boolean;
  getItemById: (itemId: string) => ShopItem | undefined;
  resetPurchases: () => void;
}

export const useShopStore = create<ShopStore>((set, get) => ({
  shopItems: SHOP_ITEMS.map(item => ({ ...item })),

  purchaseItem: (itemId: string): boolean => {
    const { shopItems } = get();
    const index = shopItems.findIndex(item => item.id === itemId);
    if (index === -1) return false;

    const item = shopItems[index];

    // Check max purchases (-1 means unlimited)
    if (item.maxPurchases !== -1 && item.currentPurchases >= item.maxPurchases) {
      return false;
    }

    const newItems = [...shopItems];
    newItems[index] = {
      ...item,
      currentPurchases: item.currentPurchases + 1,
    };

    set({ shopItems: newItems });
    return true;
  },

  canAfford: (itemId: string, coins: number): boolean => {
    const { shopItems } = get();
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return false;

    // Check max purchases
    if (item.maxPurchases !== -1 && item.currentPurchases >= item.maxPurchases) {
      return false;
    }

    return coins >= item.price;
  },

  getItemById: (itemId: string): ShopItem | undefined => {
    const { shopItems } = get();
    return shopItems.find(item => item.id === itemId);
  },

  resetPurchases: () => {
    set({
      shopItems: SHOP_ITEMS.map(item => ({ ...item, currentPurchases: 0 })),
    });
  },
}));
