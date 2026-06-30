import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MenuPage } from './pages/MenuPage';
import { LevelSelectPage } from './pages/LevelSelectPage';
import { GamePage } from './pages/GamePage';
import { ShopPage } from './pages/ShopPage';
import { SettingsPage } from './pages/SettingsPage';
import { GameOverPage } from './pages/GameOverPage';
import { RulesPage } from './pages/RulesPage';

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/games/fruit-joker">
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/levels" element={<LevelSelectPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/gameover" element={<GameOverPage />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
