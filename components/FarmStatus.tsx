'use client';

import React from 'react';
import { Player } from '@/types/game';
import { FARM_LEVELS, ANIMALS } from '@/types/gameConfig';

interface FarmStatusProps {
  player: Player;
}

export default function FarmStatus({ player }: FarmStatusProps) {
  const farmLevel = FARM_LEVELS.find(f => f.level === player.farmLevel);
  const nextLevel = FARM_LEVELS.find(f => f.level === player.farmLevel + 1);
  const expProgress = nextLevel ? (player.experience / nextLevel.requiredExp) * 100 : 100;

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Farm info */}
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">{farmLevel?.name}</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white p-3 rounded">
              <span className="font-semibold text-gray-700">Người chơi:</span>
              <span className="text-lg text-gray-900">{player.name}</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded">
              <span className="font-semibold text-gray-700">Cấp Độ:</span>
              <span className="text-lg font-bold text-green-600">{player.farmLevel}</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded">
              <span className="font-semibold text-gray-700">Vàng:</span>
              <span className="text-lg font-bold text-yellow-600">💰 {player.gold}</span>
            </div>
          </div>
        </div>

        {/* Right side - Experience */}
        <div>
          <h3 className="text-xl font-bold text-green-800 mb-4">Kinh Nghiệm</h3>
          <div className="bg-white p-4 rounded">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700">EXP:</span>
              <span className="text-gray-900">
                {player.experience} / {nextLevel?.requiredExp || 'Max'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-300 flex items-center justify-center"
                style={{ width: `${Math.min(expProgress, 100)}%` }}
              >
                <span className="text-white text-xs font-bold">
                  {Math.round(expProgress)}%
                </span>
              </div>
            </div>
            {nextLevel && (
              <p className="text-sm text-gray-600 mt-2">
                Cần {nextLevel.requiredExp - player.experience} EXP để nâng cấp
              </p>
            )}
          </div>

          {/* Farm stats */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-white p-3 rounded text-center">
              <p className="text-sm text-gray-600">Mảnh đất</p>
              <p className="text-lg font-bold text-green-600">{farmLevel?.maxSlots}</p>
            </div>
            <div className="bg-white p-3 rounded text-center">
              <p className="text-sm text-gray-600">Nông trại tối đa</p>
              <p className="text-lg font-bold text-blue-600">{farmLevel?.availableAnimals.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}