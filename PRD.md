# 🍎 水果小丑牌 (Fruit Joker) — 产品开发文档

> **文档版本**: v2.0  
> **更新日期**: 2026-06-30  
> **技术栈**: H5 + React (TypeScript)  
> **视觉风格**: 卡通可爱风  
> **部署方案**: Vercel/Netlify（主） + 自有服务器（备）  
> **目标读者**: AI 开发工具 / 开发工程师

---

## 目录

1. [产品概述](#1-产品概述)
2. [核心玩法](#2-核心玩法)
3. [游戏系统设计](#3-游戏系统设计)
4. [关卡系统](#4-关卡系统)
5. [商店系统](#5-商店系统)
6. [限制效果系统](#6-限制效果系统)
7. [UI/UX 设计规范](#7-uiux-设计规范)
8. [技术架构](#8-技术架构)
9. [数据模型](#9-数据模型)
10. [核心算法](#10-核心算法)
11. [音效与动画](#11-音效与动画)
12. [部署方案](#12-部署方案)
13. [项目结构](#13-项目结构)
14. [开发里程碑](#14-开发里程碑)
15. [附录](#15-附录)

---

## 1. 产品概述

### 1.1 产品定位

水果小丑牌是一款基于"小丑牌"(Balatro) 核心机制设计的 H5 休闲益智小游戏。玩家在 10×10 的水果矩阵中，通过选择 3×3 区域来组合分数与倍率，策略性地完成关卡目标。

### 1.2 核心特色

- **策略选择**: 3×3 区域选择 + 3~5 次选择机会（随关卡递增） = 丰富的策略组合
- **水果倍率系统**: 分数水果与倍率水果的搭配产生化学反应
- **渐进式难度**: 8 大关 × 3 小关 = 24 个关卡，指数递增难度
- **随机限制效果**: 第 2、3 小关引入随机限制，增加挑战与趣味
- **商店加成系统**: 金币经济 + 商店购买永久/临时加成
- **卡通可爱视觉**: 圆润水果造型、明亮色彩、流畅动画

### 1.3 目标平台

- 移动端 H5（微信/浏览器）
- PC 端浏览器
- 响应式设计，适配 320px ~ 1920px 宽度

---

## 2. 核心玩法

### 2.1 游戏基本流程

```
开始游戏 → 选择关卡 → 进入矩阵 → 选择3×3区域(3~5次) → 计算得分 → 判定通关
    ↓                                                              ↓
    ← ← ← ← ← ← ← ← ← ← 未通过（可重试）← ← ← ← ← ← ← ← ← ←
    ↓                                                              ↓
  通关 → 进入商店（每关结算后）→ 继续挑战
```

### 2.2 矩阵与水果

#### 2.2.1 矩阵规格

| 属性 | 值 |
|------|-----|
| 矩阵行数 | 10 |
| 矩阵列数 | 10 |
| 总格子数 | 100 |
| 每格内容 | 1 个水果 |

#### 2.2.2 基础水果类型

| 水果 | 图标建议 | 类型 | 效果 | 基础数值 |
|------|---------|------|------|---------|
| 🍎 苹果 | 红色圆苹果 | 分数型 | 直接加分 | +10 分 |
| 🍌 香蕉 | 黄色弯香蕉 | 倍率型 | 增加倍率 | 倍率 +3 |
| 🍒 车厘子 | 红色双樱桃 | 倍率型 | 乘算倍率 | 倍率 ×1.1 |

#### 2.2.3 高级水果类型（商店解锁 / 后续关卡出现）

| 水果 | 图标建议 | 类型 | 效果 | 基础数值 | 解锁条件 |
|------|---------|------|------|---------|---------|
| 🍊 橙子 | 橙色圆橙 | 分数型 | 直接加分 | +25 分 | 商店购买 / 第 3 大关起 |
| 🍇 葡萄 | 紫色葡萄串 | 分数型 | 直接加分 | +15 分 | 商店购买 / 第 2 大关起 |
| 🍓 草莓 | 红色三角草莓 | 特殊型 | 随机效果 | 随机 | 商店购买 / 第 4 大关起 |
| 🍉 西瓜 | 绿色大西瓜 | 分数型 | 直接加分 | +50 分 | 商店购买 / 第 5 大关起 |
| 🥝 猕猴桃 | 绿色切片 | 倍率型 | 增加倍率 | 倍率 +20 | 商店购买 / 第 4 大关起 |
| 🍋 柠檬 | 黄色椭圆 | 特殊型 | 减少倍率 | 倍率 -5 | 第 3 大关起自然出现 |
| 🍑 桃子 | 粉色桃子 | 特殊型 | 双倍本次选择 | 本次分数 ×2 | 商店购买 / 第 6 大关起 |

### 2.3 选择机制

#### 2.3.1 选择规则

- 玩家使用 **3×3 正方形框** 在 10×10 矩阵中选择区域
- 每关选择次数随大关递增（3 / 4 / 5 次）
- 3×3 框可放置在矩阵中任意合法位置（左上角坐标范围：行 0~7，列 0~7）
- 已被选中的格子**不可重复选择**（选择后标记为已使用）
- 如果 3×3 框中包含已使用的格子，该位置**不可放置**选择框
- 每关选择次数随大关递增：第 1~2 大关 3 次，第 3~4 大关 4 次，第 5~8 大关 5 次

#### 2.3.2 选择交互

1. 玩家在矩阵上**滑动/拖拽** 3×3 选择框
2. 选择框实时高亮显示覆盖的 9 个格子
3. 系统实时预览当前选择的**预估得分**
4. 玩家点击"确认选择"按钮锁定当前区域
5. 已选区域变为灰色/半透明，不可再次选择
6. 剩余选择次数 -1

#### 2.3.3 提前通关奖励

- 若玩家**未用完所有选择次数**即达到目标分数，剩余次数**转化为金币**
- 转化规则：**每剩余 1 次选择 = 2 枚金币**
- 示例：关卡共 4 次选择机会，第 2 次后已达目标 → 剩余 2 次 → 获得 4 枚金币

### 2.4 得分计算

#### 2.4.1 单次选择得分计算

```
单次选择得分 = 基础分数总和 × 最终倍率

计算步骤：
1. 遍历 3×3 区域中的 9 个水果
2. 累加所有「分数型水果」的基础分数 → 得到「基础分数总和」
3. 累加所有「倍率+型水果」的倍率值 → 得到「加法倍率」
4. 乘算所有「倍率×型水果」的倍率值 → 得到「乘法倍率」
5. 处理特殊型水果效果
6. 最终倍率 = (1 + 加法倍率) × 乘法倍率
7. 单次选择得分 = 基础分数总和 × 最终倍率
```

#### 2.4.2 计算示例

假设 3×3 区域内包含：
- 3 个苹果（每个 +10 分）
- 2 个香蕉（每个倍率 +3）
- 1 个车厘子（倍率 ×1.1）
- 3 个橙子（每个 +25 分）

```
基础分数总和 = 3×10 + 3×25 = 30 + 75 = 105
加法倍率 = 2×3 = 6
乘法倍率 = 1.1
最终倍率 = (1 + 6) × 1.1 = 7.7
单次选择得分 = 105 × 7.7 = 808.5 → 809 分（四舍五入）
```

#### 2.4.3 关卡总分

```
关卡总分 = 第1次选择得分 + 第2次选择得分 + ... + 第N次选择得分
（N 取决于大关，第 1~2 大关 N=3，第 3~4 大关 N=4，第 5~8 大关 N=5）
```

#### 2.4.4 通关判定

```
关卡总分 ≥ 关卡目标分数 → 通关
关卡总分 < 关卡目标分数 → 失败（可重试）
```

---

## 3. 游戏系统设计

### 3.1 金币系统

#### 3.1.1 金币获取

| 来源 | 数量 | 说明 |
|------|------|------|
| 初始金币 | 5 枚 | 新游戏开始时 |
| 提前通关奖励 | 剩余次数 × 2 | 每关结算时 |
| 关卡首次通关奖励 | 3 枚 | 每小关首次通关 |
| 关卡完美通关奖励 | 5 枚 | 单次选择即通关 |
| 利息 | 见下方规则 | 每关结算时 |

#### 3.1.2 金币利息机制

```
利息计算规则：
- 每关结算时计算利息
- 基础利息 = floor(当前金币数 / 5) × 1
- 利息上限 = 10 枚（即最多获得 10 枚利息）
- 实际利息 = min(基础利息, 10)
- 结算后金币 = 当前金币 + 实际利息 + 通关奖励
```

**示例**：
- 拥有 5 枚金币 → 利息 = floor(5/5) × 1 = 1 枚
- 拥有 12 枚金币 → 利息 = floor(12/5) × 1 = 2 枚
- 拥有 55 枚金币 → 利息 = floor(55/5) × 1 = 11 枚 → 但上限 10 枚 → 实际利息 = 10 枚

#### 3.1.3 金币用途

- 在水果商店中购买加成效果
- 金币为**永久货币**，跨关卡保留

### 3.2 生命系统

| 属性 | 值 |
|------|-----|
| 初始生命 | 3 条 |
| 失败消耗 | -1 条 |
| 生命耗尽 | 游戏结束，需从头开始 |
| 生命恢复 | 商店购买（5 枚金币恢复 1 条） |
| 每大关奖励 | 通关一个大关（3 小关）恢复 1 条 |

### 3.3 存档系统

- 使用 **localStorage** 存储游戏进度
- 存储内容：当前关卡、金币数、已解锁水果、已购买加成、生命值
- 自动存档：每次关卡结算后自动保存
- 手动存档：设置页面可手动保存

---

## 4. 关卡系统

### 4.1 关卡结构

```
8 大关 × 3 小关 = 24 个关卡

大关 1: 1-1, 1-2, 1-3
大关 2: 2-1, 2-2, 2-3
...
大关 8: 8-1, 8-2, 8-3
```

### 4.2 小关规则

| 小关 | 特殊效果 | 说明 |
|------|---------|------|
| 第 1 小关 (X-1) | 无 | 纯分数挑战，无限制效果 |
| 第 2 小关 (X-2) | 1 个随机限制效果 | 目标分数递增 + 随机限制 |
| 第 3 小关 (X-3) | 2 个随机限制效果（叠加） | 目标分数最高 + 双重限制 |

### 4.3 关卡目标分数

目标分数根据 10×10 矩阵和低倍率体系（香蕉 +3、车厘子 ×1.1）精心调校。每个大关的 3 个小关呈递增难度，第 3 小关目标为第 1 小关的 2~3 倍。最终 Boss 关（8-3）目标为 400,000 分，需要充分利用所有水果组合。

| 大关 | 小关 | 关卡编号 | 目标分数 | 可用水果 | 选择次数 | 说明 |
|------|------|---------|---------|---------|---------|------|
| 1 | 1-1 | #1 | 300 | 苹果、香蕉、车厘子 | 3 | 入门关 |
| 1 | 1-2 | #2 | 450 | 苹果、香蕉、车厘子 | 3 | +1 随机限制 |
| 1 | 1-3 | #3 | 900 | 苹果、香蕉、车厘子 | 3 | +2 随机限制 |
| 2 | 2-1 | #4 | 600 | + 葡萄 | 3 | 新水果登场 |
| 2 | 2-2 | #5 | 900 | + 葡萄 | 3 | +1 随机限制 |
| 2 | 2-3 | #6 | 1,800 | + 葡萄 | 3 | +2 随机限制 |
| 3 | 3-1 | #7 | 960 | + 橙子、柠檬 | 4 | 新水果登场，选择次数+1 |
| 3 | 3-2 | #8 | 1,440 | + 橙子、柠檬 | 4 | +1 随机限制 |
| 3 | 3-3 | #9 | 2,880 | + 橙子、柠檬 | 4 | +2 随机限制 |
| 4 | 4-1 | #10 | 2,200 | + 猕猴桃 | 4 | 新水果登场 |
| 4 | 4-2 | #11 | 3,000 | + 猕猴桃 | 4 | +1 随机限制 |
| 4 | 4-3 | #12 | 4,000 | + 猕猴桃 | 4 | +2 随机限制 |
| 5 | 5-1 | #13 | 5,500 | + 西瓜 | 5 | 新水果登场，选择次数+1 |
| 5 | 5-2 | #14 | 7,500 | + 西瓜 | 5 | +1 随机限制 |
| 5 | 5-3 | #15 | 10,000 | + 西瓜 | 5 | +2 随机限制 |
| 6 | 6-1 | #16 | 13,500 | + 草莓、桃子 | 5 | 新水果登场 |
| 6 | 6-2 | #17 | 18,000 | + 草莓、桃子 | 5 | +1 随机限制 |
| 6 | 6-3 | #18 | 24,000 | + 草莓、桃子 | 5 | +2 随机限制 |
| 7 | 7-1 | #19 | 32,000 | 全部水果 | 5 | 终极挑战开始 |
| 7 | 7-2 | #20 | 42,000 | 全部水果 | 5 | +1 随机限制 |
| 7 | 7-3 | #21 | 56,000 | 全部水果 | 5 | +2 随机限制 |
| 8 | 8-1 | #22 | 74,000 | 全部水果 | 5 | 最终章 |
| 8 | 8-2 | #23 | 96,000 | 全部水果 | 5 | +1 随机限制 |
| 8 | 8-3 | #24 | 400,000 | 全部水果 | 5 | +2 随机限制，Boss 关 |

### 4.4 水果生成概率

#### 4.4.1 基础生成概率（第 1 大关）

| 水果 | 概率 |
|------|------|
| 苹果 | 55% |
| 香蕉 | 20% |
| 车厘子 | 25% |

#### 4.4.2 概率随关卡变化

随着新水果的引入，概率会重新分配。新水果初始概率较低，随关卡推进逐步提升。

**通用分配原则**：
- 分数型水果总概率 ≈ 50~55%
- 倍率型水果总概率 ≈ 25~30%
- 特殊型水果总概率 ≈ 20~25%
- 新水果引入时，从同类水果中按比例分出概率
- 车厘子（核心倍率水果）概率始终不低于 5%，保证策略可行性

#### 4.4.3 完整概率表

| 水果 | 类型 | 大关1 | 大关2 | 大关3 | 大关4 | 大关5 | 大关6 | 大关7 | 大关8 |
|------|------|-------|-------|-------|-------|-------|-------|-------|-------|
| 苹果 | 分数 | 55% | 40% | 30% | 25% | 20% | 15% | 12% | 10% |
| 香蕉 | 倍率+ | 20% | 15% | 10% | 8% | 7% | 5% | 5% | 4% |
| 车厘子 | 倍率× | 25% | 20% | 15% | 12% | 10% | 8% | 7% | 6% |
| 葡萄 | 分数 | - | 25% | 20% | 15% | 12% | 10% | 8% | 7% |
| 橙子 | 分数 | - | - | 15% | 12% | 10% | 8% | 8% | 7% |
| 柠檬 | 特殊 | - | - | 10% | 8% | 6% | 5% | 5% | 4% |
| 猕猴桃 | 倍率+ | - | - | - | 20% | 15% | 10% | 8% | 7% |
| 西瓜 | 分数 | - | - | - | - | 20% | 15% | 12% | 10% |
| 草莓 | 特殊 | - | - | - | - | - | 12% | 15% | 18% |
| 桃子 | 特殊 | - | - | - | - | - | 12% | 20% | 27% |

### 4.5 矩阵生成算法

```typescript
// 伪代码
function generateMatrix(levelConfig: LevelConfig): FruitType[][] {
  const matrix: FruitType[][] = [];
  for (let row = 0; row < 10; row++) {
    matrix[row] = [];
    for (let col = 0; col < 10; col++) {
      matrix[row][col] = weightedRandom(levelConfig.fruitProbabilities);
    }
  }
  return matrix;
}
```

**保证机制**：
- 车厘子和香蕉通过概率自然保证，不强制设定最少数量（10×10 矩阵共 100 格，按概率足以出现）
- 启用限制效果 `DISABLE_*` 时，会被排除在生成池之外
- 启用限制效果 `POISON` 时，会替换 5% 格子为毒果

---

## 5. 商店系统

### 5.1 商店入口

- **触发时机**: 每关通关后自动弹出
- **可跳过**: 玩家可选择"跳过"不进入商店
- **界面**: 全屏弹窗，展示可用商品

### 5.2 商品列表

#### 5.2.1 永久加成（购买后永久生效）

| 商品 | 价格 | 效果 | 最大购买次数 | 说明 |
|------|------|------|-------------|------|
| 🍎 苹果强化 | 8 金币 | 苹果基础分数 +5 | 5 次 | 10→15→20→25→30→35 |
| 🍌 香蕉强化 | 10 金币 | 香蕉倍率 +1 | 5 次 | +3→+4→+5→+6→+7→+8 |
| 🍒 车厘子强化 | 12 金币 | 车厘子倍率 +0.1（叠加） | 3 次 | ×1.1→×1.2→×1.3→×1.4 |
| 🍊 橙子强化 | 10 金币 | 橙子基础分数 +10 | 5 次 | 25→35→45→55→65→75 |
| 🍇 葡萄强化 | 8 金币 | 葡萄基础分数 +5 | 5 次 | 15→20→25→30→35→40 |
| 🍉 西瓜强化 | 15 金币 | 西瓜基础分数 +15 | 5 次 | 50→65→80→95→110→125 |
| 🥝 猕猴桃强化 | 12 金币 | 猕猴桃倍率 +10 | 5 次 | +20→+30→+40→+50→+60→+70 |

#### 5.2.2 概率加成（购买后永久生效）

| 商品 | 价格 | 效果 | 最大购买次数 | 说明 |
|------|------|------|-------------|------|
| 🍀 苹果幸运草 | 6 金币 | 苹果出现概率提升 | 3 次 | 在基数上叠加 |
| 🍀 香蕉幸运草 | 8 金币 | 香蕉出现概率提升 | 3 次 | 在基数上叠加 |
| 🍀 车厘子幸运草 | 8 金币 | 车厘子出现概率提升 | 3 次 | 在基数上叠加 |

#### 5.2.3 功能道具（一次性消耗）

| 商品 | 价格 | 效果 | 说明 |
|------|------|------|------|
| ❤️ 生命药水 | 5 金币 | 恢复 1 条生命 | 可重复购买 |
| 🔄 重选卡 | 6 金币 | 当前关卡额外 +1 次选择机会 | 仅当前关卡有效 |
| 👁️ 透视卡 | 4 金币 | 当前关卡移除"水果隐藏"限制效果 | 仅当前关卡有效 |
| 🛡️ 护盾卡 | 8 金币 | 当前关卡失败不消耗生命 | 仅当前关卡有效 |
| 🎯 精准卡 | 5 金币 | 当前关卡选择框可变为 4×4（覆盖16格） | 仅当前关卡有效 |

#### 5.2.4 新水果解锁

| 商品 | 价格 | 效果 | 说明 |
|------|------|------|------|
| 🍇 解锁葡萄 | 10 金币 | 葡萄提前出现 | 原第 2 大关 → 立即可用 |
| 🍊 解锁橙子 | 15 金币 | 橙子提前出现 | 原第 3 大关 → 立即可用 |
| 🍉 解锁西瓜 | 20 金币 | 西瓜提前出现 | 原第 5 大关 → 立即可用 |
| 🥝 解锁猕猴桃 | 18 金币 | 猕猴桃提前出现 | 原第 4 大关 → 立即可用 |
| 🍓 解锁草莓 | 15 金币 | 草莓提前出现 | 原第 6 大关 → 立即可用 |
| 🍑 解锁桃子 | 20 金币 | 桃子提前出现 | 原第 6 大关 → 立即可用 |

### 5.3 商店 UI 设计

```
┌─────────────────────────────────────┐
│  🏪 水果商店          金币: 🪙 12   │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌────────┐│
│  │🍎苹果强化│ │🍌香蕉强化│ │🍒车厘子││
│  │  8金币   │ │  10金币  │ │ 12金币 ││
│  │ 已购2/5  │ │ 已购0/5  │ │已购1/3 ││
│  │  [购买]  │ │  [购买]  │ │ [购买] ││
│  └─────────┘ └─────────┘ └────────┘│
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌────────┐│
│  │🍀苹果幸运│ │❤️生命药水│ │🔄重选卡││
│  │  6金币   │ │  5金币   │ │  6金币 ││
│  │ 已购1/3  │ │  [购买]  │ │ [购买] ││
│  │  [购买]  │ │          │ │        ││
│  └─────────┘ └─────────┘ └────────┘│
│                                     │
│         [ 跳过商店 ]                 │
└─────────────────────────────────────┘
```

---

## 6. 限制效果系统

### 6.1 限制效果列表

| 效果 ID | 效果名称 | 描述 | 强度等级 | 出现关卡 |
|---------|---------|------|---------|---------|
| `HIDDEN` | 水果迷雾 | 随机隐藏 30% 的水果（显示为 ❓），选择后才揭示 | ⭐ | 第 2 大关起 |
| `DISABLE_APPLE` | 苹果禁忌 | 矩阵中不出现苹果 | ⭐ | 第 2 大关起 |
| `DISABLE_CHERRY` | 车厘子禁忌 | 矩阵中不出现车厘子 | ⭐⭐ | 第 3 大关起 |
| `DISABLE_BANANA` | 香蕉禁忌 | 矩阵中不出现香蕉 | ⭐⭐ | 第 3 大关起 |
| `SHRINK` | 缩小选择 | 选择框缩小为 2×2（覆盖 4 格） | ⭐⭐ | 第 3 大关起 |
| `TIMER` | 时间压力 | 每次选择限时 15 秒，超时自动随机选择 | ⭐⭐ | 第 4 大关起 |
| `FROZEN` | 冰冻区域 | 矩阵中随机 20% 格子被冻结（不可选择） | ⭐⭐⭐ | 第 5 大关起 |
| `SHUFFLE` | 水果洗牌 | 每次选择后，未选中区域的水果随机重排 | ⭐⭐⭐ | 第 5 大关起 |
| `REVERSE` | 倍率反转 | 所有倍率效果取反（+变-，×变÷） | ⭐⭐⭐ | 第 6 大关起 |
| `POISON` | 毒果陷阱 | 矩阵中混入 5% 的毒果（紫色），选中则本次得分为 0 | ⭐⭐⭐ | 第 6 大关起 |
| `BLIND` | 全盲模式 | 所有水果显示为 ❓，仅在鼠标悬停时短暂显示 | ⭐⭐⭐⭐ | 第 7 大关起 |
| `EXTRA_GOAL` | 额外目标 | 除分数外，还需满足额外条件（如至少选择 2 个车厘子） | ⭐⭐⭐⭐ | 第 7 大关起 |
| `ONE_CHANCE` | 一击必杀 | 仅允许 1 次选择机会（替代原有次数） | ⭐⭐⭐⭐⭐ | 第 8 大关起 |

### 6.2 限制效果分配规则

```typescript
// 伪代码：限制效果分配
function getRestrictions(bigLevel: number, subLevel: number): Restriction[] {
  const restrictions: Restriction[] = [];
  const availablePool = getAvailableRestrictions(bigLevel);
  
  if (subLevel === 2) {
    // 第 2 小关：1 个随机限制
    restrictions.push(randomPick(availablePool));
  } else if (subLevel === 3) {
    // 第 3 小关：2 个不重复的随机限制
    const first = randomPick(availablePool);
    const remaining = availablePool.filter(r => r.id !== first.id);
    restrictions.push(first, randomPick(remaining));
  }
  
  return restrictions;
}

function getAvailableRestrictions(bigLevel: number): Restriction[] {
  // 根据大关等级，返回可用的限制效果池
  // 第 2 大关: HIDDEN, DISABLE_APPLE
  // 第 3 大关: +DISABLE_CHERRY, DISABLE_BANANA, SHRINK
  // 第 4 大关: +TIMER
  // 第 5 大关: +FROZEN, SHUFFLE
  // 第 6 大关: +REVERSE, POISON
  // 第 7 大关: +BLIND, EXTRA_GOAL
  // 第 8 大关: +ONE_CHANCE
}
```

### 6.3 限制效果 UI 提示

- 关卡开始前，**全屏展示**当前关卡的所有限制效果
- 每个限制效果配有**图标 + 简短描述**
- 游戏过程中，屏幕右上角**持续显示**当前生效的限制效果图标
- 限制效果触发时，播放**对应的动画/音效**

---

## 7. UI/UX 设计规范

### 7.1 视觉风格定义

- **风格**: 卡通可爱风
- **色彩方案**: 明亮、饱和度高、温暖色调
- **圆角**: 所有 UI 元素使用大圆角 (12px ~ 20px)
- **阴影**: 柔和投影，增加层次感
- **字体**: 圆体/可爱风格字体

### 7.2 色彩系统

```css
:root {
  /* 主色调 */
  --primary: #FF6B6B;       /* 珊瑚红 - 主按钮、强调 */
  --primary-light: #FF8E8E; /* 浅珊瑚红 */
  --primary-dark: #E85555;  /* 深珊瑚红 */
  
  /* 辅助色 */
  --secondary: #4ECDC4;    /* 薄荷绿 - 成功、确认 */
  --accent: #FFE66D;       /* 柠檬黄 - 金币、高亮 */
  --accent-dark: #FFD93D;   /* 深柠檬黄 */
  
  /* 背景色 */
  --bg-main: #FFF5E4;      /* 奶油色 - 主背景 */
  --bg-card: #FFFFFF;       /* 纯白 - 卡片背景 */
  --bg-overlay: rgba(0, 0, 0, 0.5); /* 遮罩层 */
  
  /* 文字色 */
  --text-primary: #2D3436;  /* 深灰 - 主文字 */
  --text-secondary: #636E72; /* 中灰 - 副文字 */
  --text-light: #FFFFFF;    /* 白色 - 反色文字 */
  
  /* 状态色 */
  --success: #00B894;       /* 绿色 - 通关 */
  --warning: #FDCB6E;       /* 黄色 - 警告 */
  --danger: #E17055;        /* 红色 - 失败 */
  
  /* 水果色 */
  --apple-red: #FF4757;
  --banana-yellow: #FFC312;
  --cherry-red: #C44569;
  --grape-purple: #A55EEA;
  --orange-color: #FF9F43;
  --watermelon-green: #26DE81;
  --kiwi-green: #20BF6B;
  --lemon-yellow: #F7F1A3;
  --strawberry-red: #EB3B5A;
  --peach-pink: #FDA7DF;
}
```

### 7.3 页面结构

#### 7.3.1 主页面层级

```
App
├── MainMenu          // 主菜单
│   ├── Logo + 标题
│   ├── [开始游戏] [继续游戏] [设置]
│   └── 背景动画（飘落的水果）
├── LevelSelect       // 关卡选择
│   ├── 8 大关横向/纵向排列
│   ├── 每大关显示 3 小关状态
│   ├── 当前金币显示
│   └── [商店] 按钮
├── GameScreen        // 游戏主界面
│   ├── TopBar (关卡信息、分数、剩余次数、限制效果)
│   ├── MatrixView (10×10 水果矩阵)
│   ├── SelectionBox (3×3 选择框)
│   ├── ScorePreview (实时预估分数)
│   ├── ActionButtons (确认选择、撤销)
│   └── ResultPanel (结算面板)
├── ShopScreen        // 商店
│   ├── 金币显示
│   ├── 商品网格
│   ├── 商品详情弹窗
│   └── [跳过] [确认]
├── SettingsScreen    // 设置
│   ├── 音效开关
│   ├── 音乐开关
│   ├── 重置进度
│   └── 返回
└── GameOverScreen    // 游戏结束
    ├── 最终分数
    ├── [重新开始] [返回主菜单]
    └── 分享按钮
```

#### 7.3.2 游戏主界面布局

```
┌──────────────────────────────────────────┐
│ 🍎水果小丑牌  关卡 1-1  🪙12  ❤️❤️❤️   │  ← TopBar
│ 目标: 150分  当前: 0分  剩余: 4次        │
├──────────────────────────────────────────┤
│ [限制效果图标区域]                         │  ← 限制效果提示
├──────────────────────────────────────────┤
│                                          │
│   ┌─────────────────────────────────┐    │
│   │                                 │    │  ← 水果矩阵
│   │        10 × 10 矩阵             │    │     (可滚动)
│   │        (可缩放)                 │    │
│   │                                 │    │
│   │     ┌───┬───┬───┐              │    │  ← 3×3 选择框
│   │     │🍎 │🍌 │🍒 │              │    │
│   │     ├───┼───┼───┤              │    │
│   │     │🍎 │🍊 │🍌 │              │    │
│   │     ├───┼───┼───┤              │    │
│   │     │🍒 │🍎 │🍌 │              │    │
│   │     └───┴───┴───┘              │    │
│   │                                 │    │
│   └─────────────────────────────────┘    │
│                                          │
├──────────────────────────────────────────┤
│ 预估得分: 1,530    [确认选择]            │  ← 底部操作栏
└──────────────────────────────────────────┘
```

### 7.4 水果图标设计规范

- **尺寸**: 基础格子 40×40px（可缩放）
- **风格**: 卡通圆润，带有高光和阴影
- **动画**: 
  - 出现时：弹跳缩放动画 (scale 0 → 1.2 → 1)
  - 被选中时：发光 + 放大动画
  - 得分计算时：飞向分数区域的动画
- **实现方式**: 使用 SVG 或 Emoji + CSS 样式（推荐 SVG 以获得更好的视觉效果）

### 7.5 响应式设计

| 断点 | 宽度范围 | 矩阵缩放 | 布局调整 |
|------|---------|---------|---------|
| 移动端竖屏 | < 480px | 0.5x | 矩阵占满宽度，底部固定操作栏 |
| 移动端横屏 | 480px ~ 768px | 0.7x | 矩阵居中，操作栏在右侧 |
| 平板 | 768px ~ 1024px | 0.85x | 矩阵居中，信息栏在顶部 |
| 桌面端 | > 1024px | 1x | 矩阵居中，两侧信息面板 |

### 7.6 交互反馈

| 操作 | 视觉反馈 | 音效 |
|------|---------|------|
| 拖拽选择框 | 实时高亮 + 预估分数更新 | 轻柔滑动音 |
| 确认选择 | 格子闪烁 + 分数飞入动画 | 确认音 + 金币音 |
| 通关 | 全屏庆祝动画（五彩纸屑） | 胜利音乐 |
| 失败 | 屏幕震动 + 红色闪烁 | 失败音效 |
| 购买商品 | 商品弹跳 + 金币减少动画 | 收银音 |
| 限制效果触发 | 对应特效动画 | 警告/特殊音效 |

---

## 8. 技术架构

### 8.1 技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | React | 18.x | UI 框架 |
| 语言 | TypeScript | 5.x | 类型安全 |
| 构建 | Vite | 5.x | 构建工具 |
| 样式 | CSS Modules + Tailwind CSS | 3.x | 样式方案 |
| 状态管理 | Zustand | 4.x | 轻量状态管理 |
| 路由 | React Router | 6.x | 页面路由 |
| 动画 | Framer Motion | 11.x | UI 动画 |
| 音效 | Howler.js | 2.x | 音效管理 |
| 存储 | localStorage | - | 本地存档 |
| 测试 | Vitest + React Testing Library | - | 单元/集成测试 |
| 部署 | Vercel / Netlify | - | 静态部署 |

### 8.2 项目架构图

```
┌─────────────────────────────────────────────┐
│                   App                        │
│  ┌───────────┐  ┌───────────┐  ┌──────────┐ │
│  │  Pages    │  │  Stores   │  │ Services │ │
│  │  - Menu   │  │  - Game   │  │  - Audio │ │
│  │  - Level  │  │  - Shop   │  │  - Save  │ │
│  │  - Game   │  │  - UI    │  │  - Score │ │
│  │  - Shop   │  │           │  │          │ │
│  └─────┬─────┘  └─────┬─────┘  └────┬─────┘ │
│        │              │              │       │
│  ┌─────▼──────────────▼──────────────▼─────┐ │
│  │              Components                  │ │
│  │  - Matrix / FruitCell / SelectionBox    │ │
│  │  - ScoreBoard / TopBar / ActionButtons  │ │
│  │  - ShopItem / ShopGrid / Modal          │ │
│  │  - LevelCard / RestrictionBadge          │ │
│  └──────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────┐ │
│  │              Game Engine                 │ │
│  │  - MatrixGenerator / ScoreCalculator     │ │
│  │  - RestrictionManager / ShopManager      │ │
│  │  - LevelConfig / GameConfig               │ │
│  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 8.3 状态管理设计 (Zustand)

```typescript
// 游戏状态 Store
interface GameStore {
  // 游戏状态
  gameState: 'menu' | 'playing' | 'paused' | 'result' | 'shop' | 'gameover';
  currentLevel: number;        // 当前关卡编号 (1-24)
  currentBigLevel: number;     // 当前大关 (1-8)
  currentSubLevel: number;     // 当前小关 (1-3)
  
  // 矩阵数据
  matrix: FruitType[][];       // 10×10 水果矩阵
  selectedAreas: SelectedArea[]; // 已选择的区域列表
  currentSelection: { row: number; col: number } | null; // 当前选择框位置
  
  // 分数
  targetScore: number;          // 目标分数
  currentScores: number[];     // 每次选择的得分
  totalScore: number;           // 当前总分
  
  // 选择次数（按大关递增：1~2 关 3 次，3~4 关 4 次，5~8 关 5 次）
  maxSelections: number;       // 最大选择次数 (3|4|5)
  remainingSelections: number; // 剩余选择次数
  
  // 金币
  coins: number;                // 当前金币
  
  // 生命
  lives: number;               // 当前生命值
  
  // 限制效果
  activeRestrictions: Restriction[]; // 当前生效的限制效果
  
  // 加成效果
  permanentUpgrades: Record<string, number>; // 永久加成 { 'apple_boost': 2, ... }
  unlockedFruits: string[];    // 已解锁的高级水果
  
  // 道具
  consumables: Record<string, number>; // 一次性道具 { 'reroll': 1, ... }
  
  // Actions
  startLevel: (level: number) => void;
  selectArea: (row: number, col: number) => void;
  confirmSelection: () => void;
  calculateScore: () => number;
  checkLevelComplete: () => boolean;
  endLevel: (won: boolean) => void;
  purchaseShopItem: (itemId: string) => boolean;
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
}
```

---

## 9. 数据模型

### 9.1 核心类型定义

```typescript
// 水果类型枚举
enum FruitType {
  APPLE = 'apple',           // 苹果 +10
  BANANA = 'banana',         // 香蕉 倍率+3
  CHERRY = 'cherry',         // 车厘子 倍率×1.1
  GRAPE = 'grape',           // 葡萄 +15
  ORANGE = 'orange',         // 橙子 +25
  WATERMELON = 'watermelon', // 西瓜 +50
  KIWI = 'kiwi',             // 猕猴桃 倍率+20
  LEMON = 'lemon',           // 柠檬 倍率-5
  STRAWBERRY = 'strawberry', // 草莓 随机
  PEACH = 'peach',           // 桃子 本次×2
  POISON = 'poison',         // 毒果 得分=0
}

// 水果效果类型
enum FruitEffectType {
  SCORE_ADD = 'score_add',     // 直接加分
  MULTIPLIER_ADD = 'multiplier_add', // 倍率加法
  MULTIPLIER_MUL = 'multiplier_mul', // 倍率乘法
  MULTIPLIER_SUB = 'multiplier_sub', // 倍率减法
  RANDOM = 'random',           // 随机效果
  DOUBLE = 'double',           // 双倍
  POISON = 'poison',           // 毒果
}

// 水果配置
interface FruitConfig {
  type: FruitType;
  name: string;
  icon: string;           // SVG 路径或 emoji
  effectType: FruitEffectType;
  baseValue: number;
  color: string;
  unlockLevel?: number;  // 解锁关卡
}

// 已选择区域
interface SelectedArea {
  row: number;           // 左上角行
  col: number;           // 左上角列
  fruits: FruitType[][];  // 3×3 水果
  score: number;         // 本次得分
  timestamp: number;
}

// 限制效果
interface Restriction {
  id: string;
  name: string;
  description: string;
  icon: string;
  intensity: number;     // 1-5
  apply: (matrix: FruitType[][]) => FruitType[][];
  onApply?: () => void;  // 效果触发时的回调
  onRemove?: () => void;  // 效果移除时的回调
}

// 关卡配置
interface LevelConfig {
  levelNumber: number;       // 1-24
  bigLevel: number;         // 1-8
  subLevel: number;         // 1-3
  targetScore: number;
  availableFruits: FruitType[];
  fruitProbabilities: Record<FruitType, number>;
  restrictions: Restriction[];
  maxSelections: number;    // 默认 4
}

// 商店商品
interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  category: 'permanent' | 'probability' | 'consumable' | 'unlock';
  maxPurchases: number;     // -1 表示无限
  currentPurchases: number;
  effect: (gameStore: GameStore) => void;
  isAvailable: (gameStore: GameStore) => boolean;
}

// 存档数据
interface SaveData {
  version: string;
  currentLevel: number;
  coins: number;
  lives: number;
  permanentUpgrades: Record<string, number>;
  unlockedFruits: string[];
  consumables: Record<string, number>;
  completedLevels: number[];
  highScores: Record<number, number>;
  lastSaved: number;
}
```

### 9.2 水果配置数据

```typescript
export const FRUIT_CONFIGS: Record<FruitType, FruitConfig> = {
  [FruitType.APPLE]: {
    type: FruitType.APPLE,
    name: '苹果',
    icon: '🍎',
    effectType: FruitEffectType.SCORE_ADD,
    baseValue: 10,
    color: '#FF4757',
  },
  [FruitType.BANANA]: {
    type: FruitType.BANANA,
    name: '香蕉',
    icon: '🍌',
    effectType: FruitEffectType.MULTIPLIER_ADD,
    baseValue: 3,
    color: '#FFC312',
  },
  [FruitType.CHERRY]: {
    type: FruitType.CHERRY,
    name: '车厘子',
    icon: '🍒',
    effectType: FruitEffectType.MULTIPLIER_MUL,
    baseValue: 1.1,
    color: '#C44569',
  },
  [FruitType.GRAPE]: {
    type: FruitType.GRAPE,
    name: '葡萄',
    icon: '🍇',
    effectType: FruitEffectType.SCORE_ADD,
    baseValue: 15,
    color: '#A55EEA',
    unlockLevel: 4,
  },
  [FruitType.ORANGE]: {
    type: FruitType.ORANGE,
    name: '橙子',
    icon: '🍊',
    effectType: FruitEffectType.SCORE_ADD,
    baseValue: 25,
    color: '#FF9F43',
    unlockLevel: 7,
  },
  [FruitType.WATERMELON]: {
    type: FruitType.WATERMELON,
    name: '西瓜',
    icon: '🍉',
    effectType: FruitEffectType.SCORE_ADD,
    baseValue: 50,
    color: '#26DE81',
    unlockLevel: 13,
  },
  [FruitType.KIWI]: {
    type: FruitType.KIWI,
    name: '猕猴桃',
    icon: '🥝',
    effectType: FruitEffectType.MULTIPLIER_ADD,
    baseValue: 20,
    color: '#20BF6B',
    unlockLevel: 10,
  },
  [FruitType.LEMON]: {
    type: FruitType.LEMON,
    name: '柠檬',
    icon: '🍋',
    effectType: FruitEffectType.MULTIPLIER_SUB,
    baseValue: 5,
    color: '#F7F1A3',
    unlockLevel: 7,
  },
  [FruitType.STRAWBERRY]: {
    type: FruitType.STRAWBERRY,
    name: '草莓',
    icon: '🍓',
    effectType: FruitEffectType.RANDOM,
    baseValue: 0,
    color: '#EB3B5A',
    unlockLevel: 16,
  },
  [FruitType.PEACH]: {
    type: FruitType.PEACH,
    name: '桃子',
    icon: '🍑',
    effectType: FruitEffectType.DOUBLE,
    baseValue: 2,
    color: '#FDA7DF',
    unlockLevel: 16,
  },
  [FruitType.POISON]: {
    type: FruitType.POISON,
    name: '毒果',
    icon: '☠️',
    effectType: FruitEffectType.POISON,
    baseValue: 0,
    color: '#6C5CE7',
  },
};
```

---

## 10. 核心算法

### 10.1 分数计算算法

```typescript
/**
 * 计算单次 3×3 区域的得分
 * @param fruits 3×3 水果矩阵
 * @param upgrades 当前永久加成
 * @returns 本次选择得分
 */
function calculateAreaScore(
  fruits: FruitType[][],
  upgrades: Record<string, number>
): number {
  let baseScore = 0;
  let addMultiplier = 0;
  let mulMultiplier = 1;
  let hasPoison = false;
  let hasDouble = false;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const fruit = fruits[row][col];
      const config = FRUIT_CONFIGS[fruit];
      const boostLevel = upgrades[`${fruit}_boost`] || 0;

      switch (config.effectType) {
        case FruitEffectType.SCORE_ADD:
          baseScore += config.baseValue + boostLevel * getBoostStep(fruit);
          break;
        case FruitEffectType.MULTIPLIER_ADD:
          addMultiplier += config.baseValue + boostLevel * getBoostStep(fruit);
          break;
        case FruitEffectType.MULTIPLIER_MUL:
          mulMultiplier *= config.baseValue + boostLevel * 0.5;
          break;
        case FruitEffectType.MULTIPLIER_SUB:
          addMultiplier -= config.baseValue;
          break;
        case FruitEffectType.DOUBLE:
          hasDouble = true;
          break;
        case FruitEffectType.POISON:
          hasPoison = true;
          break;
        case FruitEffectType.RANDOM:
          // 随机效果：50% 概率双倍分数，50% 概率无效果
          if (Math.random() > 0.5) hasDouble = true;
          break;
      }
    }
  }

  if (hasPoison) return 0;

  const finalMultiplier = (1 + addMultiplier) * mulMultiplier;
  let score = baseScore * finalMultiplier;

  if (hasDouble) score *= 2;

  return Math.round(score);
}

function getBoostStep(fruit: FruitType): number {
  const steps: Record<string, number> = {
    apple: 5,
    banana: 1,
    cherry: 0.1,
    grape: 5,
    orange: 10,
    watermelon: 15,
    kiwi: 10,
  };
  return steps[fruit] || 0;
}
```

### 10.2 矩阵生成算法

```typescript
/**
 * 生成关卡矩阵
 * @param config 关卡配置
 * @returns 10×10 水果矩阵
 */
function generateMatrix(
  config: LevelConfig
): FruitType[][] {
  // 1. 根据概率生成基础矩阵（加权随机池方式）
  const matrix: FruitType[][] = [];
  for (let row = 0; row < 10; row++) {
    matrix[row] = [];
    for (let col = 0; col < 10; col++) {
      matrix[row][col] = randomFromWeightedPool(config.fruitProbabilities);
    }
  }

  // 2. 应用限制效果（DISABLE 在生成时排除，POISON 生成后替换）
  for (const restriction of config.restrictions) {
    if (restriction.id === 'POISON') {
      applyPoison(matrix, 0.05); // 替换 5% 格子为毒果
    }
  }

  return matrix;
}

/**
 * 加权随机选择水果
 */
function weightedRandom(probabilities: Record<FruitType, number>): FruitType {
  const entries = Object.entries(probabilities) as [FruitType, number][];
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (const [fruit, weight] of entries) {
    random -= weight;
    if (random <= 0) return fruit;
  }

  return entries[entries.length - 1][0];
}
```

### 10.3 可通关性校验算法

```typescript
/**
 * 校验矩阵是否可通关（贪心算法 + 蒙特卡洛验证）
 * @returns 是否可通关
 */
function isSolvable(
  matrix: FruitType[][],
  targetScore: number,
  maxSelections: number,
  upgrades: Record<string, number>
): boolean {
  // 方法 1: 贪心搜索最优选择
  const greedyScore = greedyBestScore(matrix, maxSelections, upgrades);
  if (greedyScore >= targetScore) return true;

  // 方法 2: 蒙特卡洛随机采样（100 次随机选择）
  let monteCarloSuccess = 0;
  const trials = 100;
  for (let i = 0; i < trials; i++) {
    const score = randomSelectionScore(matrix, maxSelections, upgrades);
    if (score >= targetScore) monteCarloSuccess++;
  }

  // 如果蒙特卡洛成功率 > 15%，认为可通关
  return monteCarloSuccess / trials > 0.15;
}

/**
 * 贪心搜索：每次选择得分最高的 3×3 区域
 */
function greedyBestScore(
  matrix: FruitType[][],
  maxSelections: number,
  upgrades: Record<string, number>
): number {
  const used = Array.from({ length: 10 }, () => Array(10).fill(false));
  let totalScore = 0;

  for (let selection = 0; selection < maxSelections; selection++) {
    let bestScore = 0;
    let bestPos = { row: 0, col: 0 };

    for (let row = 0; row <= 7; row++) {
      for (let col = 0; col <= 7; col++) {
        // 检查 3×3 区域是否可用
        if (!isAreaAvailable(used, row, col)) continue;

        const fruits = extractArea(matrix, row, col);
        const score = calculateAreaScore(fruits, upgrades);
        if (score > bestScore) {
          bestScore = score;
          bestPos = { row, col };
        }
      }
    }

    if (bestScore === 0) break;

    markAreaUsed(used, bestPos.row, bestPos.col);
    totalScore += bestScore;
  }

  return totalScore;
}
```

### 10.4 金币利息计算

```typescript
function calculateCoinInterest(currentCoins: number): number {
  const baseInterest = Math.floor(currentCoins / 5) * 1;
  return Math.min(baseInterest, 10); // 上限 10 枚
}

function settleCoins(
  currentCoins: number,
  remainingSelections: number,
  isFirstClear: boolean,
  isPerfectClear: boolean
): { totalCoins: number; breakdown: string[] } {
  const breakdown: string[] = [];
  let earned = 0;

  // 提前通关奖励
  if (remainingSelections > 0) {
    const bonus = remainingSelections * 2;
    earned += bonus;
    breakdown.push(`提前通关: +${bonus} 金币`);
  }

  // 首次通关奖励
  if (isFirstClear) {
    earned += 3;
    breakdown.push(`首次通关: +3 金币`);
  }

  // 完美通关奖励
  if (isPerfectClear) {
    earned += 5;
    breakdown.push(`完美通关: +5 金币`);
  }

  // 利息
  const interest = calculateCoinInterest(currentCoins);
  if (interest > 0) {
    earned += interest;
    breakdown.push(`利息: +${interest} 金币`);
  }

  return {
    totalCoins: currentCoins + earned,
    breakdown,
  };
}
```

---

## 11. 音效与动画

### 11.1 音效列表

| 音效 ID | 描述 | 触发场景 | 格式 |
|---------|------|---------|------|
| `bgm_menu` | 主菜单背景音乐 | 主菜单 | MP3 (循环) |
| `bgm_game` | 游戏中背景音乐 | 游戏中 | MP3 (循环) |
| `bgm_shop` | 商店背景音乐 | 商店 | MP3 (循环) |
| `sfx_select` | 选择框移动 | 拖拽选择框 | MP3 |
| `sfx_confirm` | 确认选择 | 点击确认 | MP3 |
| `sfx_score` | 得分飞入 | 计算得分时 | MP3 |
| `sfx_win` | 通关音效 | 通关 | MP3 |
| `sfx_lose` | 失败音效 | 失败 | MP3 |
| `sfx_coin` | 金币音效 | 获得金币 | MP3 |
| `sfx_buy` | 购买音效 | 商店购买 | MP3 |
| `sfx_click` | 按钮点击 | 通用 | MP3 |
| `sfx_restriction` | 限制效果触发 | 限制效果出现 | MP3 |

### 11.2 动画列表

| 动画 ID | 描述 | 持续时间 | 实现方式 |
|---------|------|---------|---------|
| `fruit_appear` | 水果出现弹跳 | 300ms | Framer Motion spring |
| `fruit_selected` | 水果被选中发光 | 500ms | CSS glow + scale |
| `score_fly` | 分数飞向计分板 | 800ms | Framer Motion layout |
| `selection_move` | 选择框移动 | 150ms | CSS transform |
| `level_complete` | 通关五彩纸屑 | 2000ms | canvas-confetti |
| `screen_shake` | 失败屏幕震动 | 500ms | CSS shake keyframes |
| `coin_collect` | 金币收集动画 | 600ms | Framer Motion |
| `restriction_reveal` | 限制效果揭示 | 1000ms | Framer Motion |
| `matrix_scroll` | 矩阵滚动 | - | CSS scroll-snap |

---

## 12. 部署方案

### 12.1 Vercel 部署（主方案）

```bash
# 1. 初始化项目
npm create vite@latest fruit-joker -- --template react-ts
cd fruit-joker

# 2. 安装依赖
npm install zustand react-router-dom framer-motion howler
npm install -D tailwindcss @tailwindcss/vite

# 3. 构建验证
npm run build

# 4. 部署到 Vercel
# 方式 A: 通过 Vercel CLI
npm i -g vercel
vercel --prod

# 方式 B: 通过 GitHub 集成
# 将代码推送到 GitHub，在 Vercel 控制台导入项目
```

**Vercel 配置文件** `vercel.json`：
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### 12.2 Netlify 部署（备选方案）

**Netlify 配置文件** `netlify.toml`：
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 12.3 自有服务器部署方案

#### 方案 A: Nginx 静态托管

```nginx
# /etc/nginx/conf.d/fruit-joker.conf
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/fruit-joker/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # HTTPS (推荐使用 certbot)
    # listen 443 ssl;
    # ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
}
```

**部署步骤**：
```bash
# 1. 本地构建
npm run build

# 2. 上传到服务器
scp -r dist/* user@server:/var/www/fruit-joker/dist/

# 3. 重启 Nginx
ssh user@server "sudo nginx -s reload"
```

#### 方案 B: Docker 容器化部署

**Dockerfile**：
```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml**：
```yaml
version: '3.8'
services:
  fruit-joker:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

**部署命令**：
```bash
# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 更新部署
docker-compose up -d --build --force-recreate
```

#### 方案 C: Node.js 服务端渲染（可选）

如需服务端能力（排行榜、用户系统等），可使用 Express 托管：

```javascript
// server.js
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000, () => {
  console.log('Fruit Joker running on http://localhost:3000');
});
```

### 12.4 域名与 CDN 配置

- **域名**: 建议使用简短易记的域名
- **CDN**: Vercel/Netlify 自带全球 CDN
- **自有服务器**: 建议配合 Cloudflare CDN 使用
- **HTTPS**: 所有方案均应启用 HTTPS

---

## 13. 项目结构

```
fruit-joker/
├── public/
│   ├── favicon.ico
│   ├── audio/                    # 音效文件
│   │   ├── bgm/
│   │   │   ├── menu.mp3
│   │   │   ├── game.mp3
│   │   │   └── shop.mp3
│   │   └── sfx/
│   │       ├── select.mp3
│   │       ├── confirm.mp3
│   │       ├── score.mp3
│   │       ├── win.mp3
│   │       ├── lose.mp3
│   │       ├── coin.mp3
│   │       ├── buy.mp3
│   │       ├── click.mp3
│   │       └── restriction.mp3
│   └── images/                   # 静态图片资源
│
├── src/
│   ├── main.tsx                   # 入口文件
│   ├── App.tsx                    # 根组件
│   ├── index.css                  # 全局样式
│   │
│   ├── components/                # UI 组件
│   │   ├── common/               # 通用组件
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── layout/               # 布局组件
│   │   │   ├── TopBar.tsx
│   │   │   ├── BottomBar.tsx
│   │   │   └── GameLayout.tsx
│   │   │
│   │   ├── game/                 # 游戏组件
│   │   │   ├── Matrix.tsx        # 水果矩阵
│   │   │   ├── MatrixCell.tsx    # 单个水果格子
│   │   │   ├── SelectionBox.tsx  # 3×3 选择框
│   │   │   ├── ScoreBoard.tsx    # 计分板
│   │   │   ├── ScorePreview.tsx  # 预估分数
│   │   │   ├── RestrictionDisplay.tsx  # 限制效果展示
│   │   │   └── ResultPanel.tsx   # 结算面板
│   │   │
│   │   ├── menu/                 # 菜单组件
│   │   │   ├── MainMenu.tsx
│   │   │   ├── LevelSelect.tsx
│   │   │   └── LevelCard.tsx
│   │   │
│   │   └── shop/                 # 商店组件
│   │       ├── ShopScreen.tsx
│   │       ├── ShopGrid.tsx
│   │       ├── ShopItem.tsx
│   │       └── CoinDisplay.tsx
│   │
│   ├── pages/                     # 页面
│   │   ├── MenuPage.tsx
│   │   ├── LevelSelectPage.tsx
│   │   ├── GamePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── GameOverPage.tsx
│   │
│   ├── stores/                    # 状态管理
│   │   ├── gameStore.ts          # 游戏状态
│   │   ├── shopStore.ts          # 商店状态
│   │   ├── audioStore.ts         # 音效状态
│   │   └── uiStore.ts            # UI 状态
│   │
│   ├── engine/                    # 游戏引擎
│   │   ├── matrixGenerator.ts     # 矩阵生成
│   │   ├── scoreCalculator.ts    # 分数计算
│   │   ├── restrictionManager.ts # 限制效果管理
│   │   ├── shopManager.ts        # 商店管理
│   │   ├── levelConfig.ts        # 关卡配置
│   │   ├── gameConfig.ts         # 游戏配置
│   │   └── saveManager.ts        # 存档管理
│   │
│   ├── data/                      # 游戏数据
│   │   ├── fruits.ts             # 水果配置
│   │   ├── levels.ts             # 关卡数据
│   │   ├── restrictions.ts       # 限制效果数据
│   │   └── shopItems.ts          # 商店商品数据
│   │
│   ├── hooks/                     # 自定义 Hooks
│   │   ├── useGameLoop.ts
│   │   ├── useSelection.ts
│   │   ├── useAudio.ts
│   │   └── useResponsive.ts
│   │
│   ├── utils/                     # 工具函数
│   │   ├── random.ts
│   │   ├── format.ts
│   │   └── constants.ts
│   │
│   └── types/                     # 类型定义
│       ├── game.ts
│       ├── fruit.ts
│       ├── shop.ts
│       └── level.ts
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── vercel.json                   # Vercel 部署配置
├── netlify.toml                  # Netlify 部署配置
├── Dockerfile                    # Docker 部署配置
├── docker-compose.yml            # Docker Compose 配置
├── nginx.conf                    # Nginx 配置
└── README.md
```

---

## 14. 开发里程碑

### Phase 1: 核心框架 (Day 1-3)

- [ ] 项目初始化（Vite + React + TypeScript + Tailwind）
- [ ] 基础页面路由搭建
- [ ] 游戏状态管理（Zustand）
- [ ] 水果矩阵渲染（10×10）
- [ ] 3×3 选择框拖拽交互
- [ ] 基础分数计算（苹果、香蕉、车厘子）

### Phase 2: 游戏系统 (Day 4-6)

- [ ] 完整得分计算逻辑
- [ ] 关卡系统（8×3 = 24 关）
- [ ] 关卡目标分数与难度曲线
- [ ] 水果生成概率系统
- [ ] 矩阵生成算法（含可通关性校验）
- [ ] 通关判定与结算流程

### Phase 3: 经济系统 (Day 7-8)

- [ ] 金币系统（获取、利息、消耗）
- [ ] 商店系统（永久加成、概率加成、道具、解锁）
- [ ] 存档系统（localStorage）

### Phase 4: 限制效果 (Day 9-10)

- [ ] 限制效果框架
- [ ] 实现所有 13 种限制效果
- [ ] 限制效果分配算法
- [ ] 限制效果 UI 展示

### Phase 5: UI/UX 完善 (Day 11-13)

- [ ] 主菜单页面
- [ ] 关卡选择页面
- [ ] 游戏结算动画
- [ ] 商店界面
- [ ] 设置页面
- [ ] 游戏结束页面
- [ ] 响应式适配

### Phase 6: 音效与动画 (Day 14-15)

- [ ] 音效系统集成
- [ ] 背景音乐
- [ ] UI 动画（Framer Motion）
- [ ] 特效动画（五彩纸屑、屏幕震动等）

### Phase 7: 高级水果与平衡 (Day 16-17)

- [ ] 实现所有高级水果
- [ ] 游戏平衡性测试与调整
- [ ] 难度曲线微调

### Phase 8: 部署与优化 (Day 18-20)

- [ ] 性能优化（虚拟滚动、懒加载）
- [ ] 打包优化
- [ ] Vercel/Netlify 部署
- [ ] 自有服务器部署方案
- [ ] 最终测试与 Bug 修复

---

## 15. 附录

### 15.1 名词术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 矩阵 | Matrix | 10×10 的水果网格 |
| 选择框 | Selection Box | 3×3 的区域选择工具 |
| 基础分数 | Base Score | 分数型水果累加的原始分数 |
| 最终倍率 | Final Multiplier | (1 + 加法倍率) × 乘法倍率 |
| 大关 | Big Level / World | 8 个大关，每关 3 小关 |
| 小关 | Sub Level / Stage | 每大关的 3 个子关卡 |
| 限制效果 | Restriction | 第 2、3 小关的随机限制 |
| 永久加成 | Permanent Upgrade | 商店购买的永久效果 |
| 消耗品 | Consumable | 一次性使用的道具 |

### 15.2 设计决策记录

| 决策 | 选择 | 原因 |
|------|------|------|
| 状态管理 | Zustand | 轻量、TypeScript 友好、适合游戏 |
| 构建工具 | Vite | 快速 HMR、优秀 TS 支持 |
| 样式方案 | Tailwind CSS | 快速开发、一致设计、响应式友好 |
| 动画库 | Framer Motion | React 生态最佳动画库 |
| 存储方案 | localStorage | 无需后端、离线可用、简单可靠 |
| 部署方案 | Vercel | 零配置部署、全球 CDN、免费额度充足 |

### 15.3 后续迭代方向

1. **社交功能**: 排行榜、好友挑战
2. **每日挑战**: 每天一个特殊关卡
3. **无尽模式**: 无限关卡，追求最高分
4. **自定义模式**: 玩家自定义矩阵和规则
5. **成就系统**: 解锁成就获得奖励
6. **皮肤系统**: 不同主题的水果皮肤
7. **多语言支持**: 英文、日文等
8. **PVE 对战**: 与 AI 对手比拼分数

---

> **文档结束**  
> 本文档为水果小丑牌游戏的完整产品开发文档，涵盖了从游戏设计到技术实现的所有细节。  
> 开发团队或 AI 工具可直接依据本文档进行开发实施。
