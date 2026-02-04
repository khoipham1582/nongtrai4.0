'use client';

import React, { useState } from 'react';
import { Player, AnimalPen } from '@/types/game';
import { ANIMALS, FARM_LEVELS } from '@/types/gameConfig';
import { collectAnimalProduct } from '@/lib/gameLogic';

interface AnimalFarmProps {
  player: Player;
  onUpdate: (updatedPlayer: Player) => void;
}

export default function AnimalFarm({ player, onUpdate }: AnimalFarmProps) {
  const [notification, setNotification] = useState<string | null>(null);

  const farmLevel = FARM_LEVELS.find(f => f.level === player.farmLevel);
  const maxAnimals = farmLevel?.availableAnimals.length || 3;

  const handleCollect = (penId: string) => {
    const result = collectAnimalProduct(player, penId);
    if (result.success) {
      onUpdate({ ...player });
      setNotification(`Nhận được ${result.productName}! +${result.goldGained} vàng`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const getTimeRemaining = (readyAt: number | null): string => {
    if (!readyAt) return '';
    const remaining = Math.max(0, readyAt - Date.now());
    const seconds = Math.floor((remaining / 1000) % 60);
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="bg-orange-50 rounded-lg p-6 shadow-md mb-6">
      <h3 className="text-2xl font-bold text-orange-800 mb-4">🐾 Chăn Nuôi</h3>

      {notification && (
        <div className="mb-4 bg-green-200 border-2 border-green-400 rounded-lg p-3 text-green-800 font-semibold">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {player.animalPens.slice(0, maxAnimals).map((pen) => {
          const animal = ANIMALS[pen.animalId];

          return (
            <div
              key={pen.id}
              className="bg-gradient-to-b from-orange-100 to-orange-200 border-2 border-orange-400 rounded-lg p-4"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{animal.icon}</div>
                <p className="font-semibold text-orange-800">{animal.name}</p>
                <p className="text-xs text-gray-600 mt-1">Sản phẩm: {animal.productName}</p>
              </div>

              {!pen.isReady && pen.readyAt && (
                <div className="mt-3">
                  <div className="w-full bg-orange-300 rounded-full h-2 overflow-hidden mb-1">
                    <div
                      className="bg-orange-600 h-full rounded-full"
                      style={{
                        width: `${Math.max(0, 100 - (Math.max(0, pen.readyAt - Date.now()) / (animal.productionTime * 1000)))}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-center text-gray-700">
                    {getTimeRemaining(pen.readyAt)}
                  </p>
                </div>
              )}

              {pen.isReady && (
                <button
                  onClick={() => handleCollect(pen.id)}
                  className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-3 rounded"
                >
                  Thu Sản Phẩm
                </button>
              )}

              {!pen.isReady && !pen.readyAt && (
                <p className="mt-3 text-center text-sm text-orange-700 font-semibold">
                  Chuẩn bị sản xuất...
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-600 mt-4">
        Dung lượng: {player.animalPens.length} / {maxAnimals}
      </p>
    </div>
  );
}