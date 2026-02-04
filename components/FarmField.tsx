'use client';

import React, { useState } from 'react';
import { Player, FarmPlot } from '@/types/game';
import { CROPS, FARM_LEVELS } from '@/types/gameConfig';
import { plantCrop, harvestCrop, addExperience } from '@/lib/gameLogic';

interface FarmFieldProps {
  player: Player;
  onUpdate: (updatedPlayer: Player) => void;
  onLevelUp?: (newLevel: number) => void;
}

export default function FarmField({ player, onUpdate, onLevelUp }: FarmFieldProps) {
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [showPlantMenu, setShowPlantMenu] = useState(false);
  
  const farmLevel = FARM_LEVELS.find(f => f.level === player.farmLevel);
  const availablePlots = player.farmPlots.slice(0, farmLevel?.maxSlots || 6);

  const handlePlantCrop = (cropId: string) => {
    if (!selectedPlot) return;
    const success = plantCrop(player, selectedPlot, cropId);
    if (success) {
      onUpdate({ ...player });
      setSelectedPlot(null);
      setShowPlantMenu(false);
    }
  };

  const handleHarvest = (plotId: string) => {
    const result = harvestCrop(player, plotId);
    if (result.success) {
      const expResult = addExperience(result.player, result.expGained);
      if (expResult.leveledUp && expResult.newLevel && onLevelUp) {
        onLevelUp(expResult.newLevel);
      }
      onUpdate(expResult.player);
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
    <div className="bg-yellow-50 rounded-lg p-6 shadow-md mb-6">
      <h3 className="text-2xl font-bold text-yellow-800 mb-4">🌾 Nông Trại</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availablePlots.map((plot) => {
          const crop = plot.cropId ? CROPS[plot.cropId] : null;
          
          return (
            <div
              key={plot.id}
              className={`relative rounded-lg p-4 cursor-pointer transition-all ${
                plot.cropId
                  ? 'bg-gradient-to-b from-green-100 to-green-200 border-2 border-green-400'
                  : 'bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-yellow-400 hover:border-yellow-600'
              }`}
              onClick={() => {
                if (!plot.cropId) {
                  setSelectedPlot(plot.id);
                  setShowPlantMenu(true);
                }
              }}
            >
              {plot.cropId ? (
                <>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{crop?.icon}</div>
                    <p className="font-semibold text-green-800">{crop?.name}</p>
                  </div>
                  
                  {!plot.isReady && plot.readyAt && (
                    <div className="mt-3 text-center">
                      <div className="w-full bg-green-300 rounded-full h-2 overflow-hidden mb-1">
                        <div
                          className="bg-green-600 h-full rounded-full"
                          style={{
                            width: `${Math.max(0, 100 - (Math.max(0, plot.readyAt - Date.now()) / (crop?.growthTime || 1) / 10))}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-700">
                        {getTimeRemaining(plot.readyAt)}
                      </p>
                    </div>
                  )}

                  {plot.isReady && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHarvest(plot.id);
                      }}
                      className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded"
                    >
                      Thu Hoạch
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-2">🌱</div>
                  <p className="font-semibold text-yellow-800">Trống</p>
                  <p className="text-xs text-yellow-700 mt-2">Nhấp để trồng</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Plant menu */}
      {showPlantMenu && selectedPlot && (
        <div className="mt-6 bg-white border-2 border-yellow-400 rounded-lg p-4">
          <h4 className="font-bold text-yellow-800 mb-4">Chọn cây để trồng:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {farmLevel?.availableCrops.map((cropId) => {
              const crop = CROPS[cropId];
              return (
                <button
                  key={cropId}
                  onClick={() => handlePlantCrop(cropId)}
                  className="bg-yellow-100 hover:bg-yellow-200 border border-yellow-400 rounded p-3 text-center transition-all"
                >
                  <div className="text-3xl mb-1">{crop.icon}</div>
                  <p className="font-semibold text-sm text-yellow-800">{crop.name}</p>
                  <p className="text-xs text-gray-600">Vàng: {crop.sellPrice}</p>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setShowPlantMenu(false)}
            className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
}