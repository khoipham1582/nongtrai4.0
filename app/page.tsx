'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types/game';
import { createNewPlayer, savePlayer, loadPlayer, updateFarmState } from '@/lib/gameLogic';
import FarmStatus from '@/components/FarmStatus';
import FarmField from '@/components/FarmField';
import AnimalFarm from '@/components/AnimalFarm';
import FarmProgress from '@/components/FarmProgress';

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [showNewGame, setShowNewGame] = useState(false);

  useEffect(() => {
    const savedPlayer = loadPlayer();
    if (savedPlayer) {
      const updatedPlayer = updateFarmState(savedPlayer);
      setPlayer(updatedPlayer);
      savePlayer(updatedPlayer);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        const updatedPlayer = updateFarmState({ ...player });
        setPlayer(updatedPlayer);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player]);

  const handleCreateNewGame = async () => {
    if (!playerName.trim()) {
      alert('Vui lòng nhập tên người chơi!');
      return;
    }

    const newPlayer = createNewPlayer(playerName);
    savePlayer(newPlayer);
    setPlayer(newPlayer);
    setShowNewGame(false);
    setPlayerName('');
  };

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayer(updatedPlayer);
    savePlayer(updatedPlayer);
  };

  const handleNewGame = () => {
    setShowNewGame(true);
  };

  const handleResetGame = () => {
    if (confirm('Bạn có chắc muốn xóa trò chơi hiện tại?')) {
      setPlayer(null);
      setShowNewGame(false);
    }
  };

  if (!player) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center text-green-600 mb-2">🌾</h1>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Nông Trại Vui Vẻ
          </h2>

          {!showNewGame ? (
            <div className="space-y-4">
              <p className="text-center text-gray-600 mb-6">
                Bắt đầu xây dựng nông trại của bạn ngay hôm nay!
              </p>
              <button
                onClick={handleNewGame}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                🎮 Chơi Mới
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nhập tên người chơi:
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleCreateNewGame();
                  }}
                  placeholder="Tên của bạn"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                  autoFocus
                />
              </div>
              <button
                onClick={handleCreateNewGame}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                ✅ Bắt Đầu Chơi
              </button>
              <button
                onClick={() => setShowNewGame(false)}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-600">🌾 Nông Trại Vui Vẻ</h1>
          <button
            onClick={handleResetGame}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            🔄 Trò Chơi Mới
          </button>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-1">
            <FarmStatus player={player} />
            <FarmProgress player={player} />
          </div>

          {/* Right content */}
          <div className="lg:col-span-2">
            <FarmField player={player} onUpdate={handleUpdatePlayer} />
            <AnimalFarm player={player} onUpdate={handleUpdatePlayer} />
          </div>
        </div>
      </div>
    </main>
  );
}