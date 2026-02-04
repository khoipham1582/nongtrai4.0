'use client';

import React, { useEffect, useState } from 'react';
import { Player } from '@/types/game';
import { FARM_LEVELS } from '@/types/gameConfig';

interface FarmProgressProps {
  player: Player;
}

export default function FarmProgress({ player }: FarmProgressProps) {
  const currentLevel = FARM_LEVELS.find(f => f.level === player.farmLevel);
  const nextLevel = FARM_LEVELS.find(f => f.level === player.farmLevel + 1);

  return (
    <div className="bg-blue-50 rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold text-blue-800 mb-4">📊 Tiến Độ Nâng Cấp</h3>

      {nextLevel ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Cấp độ hiện tại</p>
              <p className="text-2xl font-bold text-blue-600">{currentLevel?.name}</p>
            </div>
            <div className="bg-white p-4 rounded border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Cấp độ tiếp theo</p>
              <p className="text-2xl font-bold text-green-600">{nextLevel.name}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700">EXP:</span>
              <span className="font-semibold text-gray-900">
                {player.experience.toLocaleString()} / {nextLevel.requiredExp.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  width: `${Math.min((player.experience / nextLevel.requiredExp) * 100, 100)}%`,
                }}
              >
                <span className="text-white text-sm font-bold">
                  {Math.round((player.experience / nextLevel.requiredExp) * 100)}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Cần {Math.max(0, nextLevel.requiredExp - player.experience).toLocaleString()} EXP nữa
            </p>
          </div>

          <div className="mt-6">
            <h4 className="font-bold text-blue-800 mb-3">Lợi ích khi nâng cấp:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="font-semibold text-blue-700">🌾 Cây trồng thêm:</p>
                <p className="text-sm text-gray-700 mt-1">
                  {nextLevel.availableCrops.filter(c => !currentLevel?.availableCrops.includes(c)).join(', ')}
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="font-semibold text-blue-700">🐾 Vật nuôi thêm:</p>
                <p className="text-sm text-gray-700 mt-1">
                  {nextLevel.availableAnimals.filter(a => !currentLevel?.availableAnimals.includes(a)).join(', ')}
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="font-semibold text-blue-700">📍 Thêm mảnh đất:</p>
                <p className="text-sm text-gray-700 mt-1">
                  {currentLevel?.maxSlots} → {nextLevel.maxSlots} mảnh
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="font-semibold text-blue-700">🐶 Thêm nông trại:</p>
                <p className="text-sm text-gray-700 mt-1">
                  {currentLevel?.availableAnimals.length} → {nextLevel.availableAnimals.length}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-400 rounded-lg p-6 text-center">
          <p className="text-2xl mb-2">🏆</p>
          <p className="text-lg font-bold text-purple-800">Bạn đã đạt cấp độ tối đa!</p>
          <p className="text-gray-700 mt-2">Tiếp tục chơi để kiếm thêm vàng và kinh nghiệm</p>
        </div>
      )}
    </div>
  );
}