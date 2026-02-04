'use client';

import React, { useState, useEffect } from 'react';
import { Player } from '@/types/game';
import { getLeaderboard } from '@/lib/gameLogic';
import { FARM_LEVELS } from '@/types/gameConfig';

interface LeaderboardProps {
  currentPlayerId?: string;
}

export default function Leaderboard({ currentPlayerId }: LeaderboardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const updateLeaderboard = () => {
      const leaderboard = getLeaderboard();
      setPlayers(leaderboard);
    };

    updateLeaderboard();
    
    // Update leaderboard every 5 seconds
    const interval = setInterval(updateLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const getRankIcon = (rank: number): string => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getFarmLevelName = (level: number): string => {
    const farmLevel = FARM_LEVELS.find(f => f.level === level);
    return farmLevel?.name || `Cấp ${level}`;
  };

  if (!showLeaderboard) {
    return (
      <button
        onClick={() => setShowLeaderboard(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-all duration-200 z-40"
      >
        🏆 BXH
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🏆 Bảng Xếp Hạng</h2>
              <p className="text-blue-100 mt-1">Top người chơi nông trại xuất sắc</p>
            </div>
            <button
              onClick={() => setShowLeaderboard(false)}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {players.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Chưa có người chơi nào</p>
              <p className="text-gray-400 mt-2">Hãy bắt đầu chơi để lên bảng xếp hạng!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {players.slice(0, 20).map((player, index) => {
                const rank = index + 1;
                const isCurrentPlayer = player.id === currentPlayerId;
                
                return (
                  <div
                    key={player.id}
                    className={`rounded-lg border-2 p-4 transition-all duration-200 ${
                      isCurrentPlayer
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : rank <= 3
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Rank and Avatar */}
                      <div className="flex items-center space-x-4">
                        <div className={`text-2xl font-bold ${
                          rank <= 3 ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {getRankIcon(rank)}
                        </div>
                        
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        
                        <div>
                          <h3 className={`font-bold text-lg ${isCurrentPlayer ? 'text-green-700' : 'text-gray-800'}`}>
                            {player.name}
                            {isCurrentPlayer && <span className="ml-2 text-sm text-green-600">(Bạn)</span>}
                          </h3>
                          <p className="text-gray-600">{getFarmLevelName(player.farmLevel)}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-6 text-right">
                        <div>
                          <p className="text-sm text-gray-500">EXP</p>
                          <p className="font-bold text-lg text-blue-600">
                            {formatNumber(player.experience)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gold</p>
                          <p className="font-bold text-lg text-yellow-600">
                            💰 {formatNumber(player.gold)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress to next level */}
                    {rank <= 10 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Tiến độ cấp {player.farmLevel}</span>
                          <span>
                            {formatNumber(player.experience)} / {formatNumber(FARM_LEVELS.find(f => f.level === player.farmLevel + 1)?.requiredExp || player.experience)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, (player.experience / (FARM_LEVELS.find(f => f.level === player.farmLevel + 1)?.requiredExp || player.experience)) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-center text-gray-600 text-sm">
            Bảng xếp hạng cập nhật mỗi 5 giây • Tổng cộng {players.length} người chơi
          </p>
        </div>
      </div>
    </div>
  );
}