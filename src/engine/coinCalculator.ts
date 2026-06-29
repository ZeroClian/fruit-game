/**
 * 计算金币利息：floor(coins / 5)，上限10
 */
export function calculateCoinInterest(currentCoins: number): number {
  return Math.min(Math.floor(currentCoins / 5), 10);
}

/**
 * 结算关卡金币奖励
 * @param currentCoins 当前持有金币
 * @param remainingSelections 剩余可选次数（用于提前通关奖励）
 * @param isFirstClear 是否首次通关
 * @param isPerfectClear 是否完美通关（所有可选次数用完且达标）
 */
export function settleCoins(
  currentCoins: number,
  remainingSelections: number,
  isFirstClear: boolean,
  isPerfectClear: boolean
): { totalCoins: number; breakdown: string[] } {
  const breakdown: string[] = [];
  let bonus = 0;

  // 提前通关奖励：剩余次数 × 2
  if (remainingSelections > 0) {
    const earlyClearBonus = remainingSelections * 2;
    bonus += earlyClearBonus;
    breakdown.push(`提前通关奖励: +${earlyClearBonus} (剩余${remainingSelections}次 × 2)`);
  }

  // 首次通关奖励：+3
  if (isFirstClear) {
    bonus += 3;
    breakdown.push('首次通关奖励: +3');
  }

  // 完美通关奖励：+5
  if (isPerfectClear) {
    bonus += 5;
    breakdown.push('完美通关奖励: +5');
  }

  // 利息
  const interest = calculateCoinInterest(currentCoins);
  if (interest > 0) {
    bonus += interest;
    breakdown.push(`利息: +${interest} (⌊${currentCoins}/5⌋, 上限10)`);
  }

  return {
    totalCoins: currentCoins + bonus,
    breakdown,
  };
}
