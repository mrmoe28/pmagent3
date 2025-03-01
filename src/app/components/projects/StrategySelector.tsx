"use client";

import { useState } from "react";
import { StrategyOption, StrategyType } from "@/app/types/project.types";
import { strategies } from "@/app/lib/strategies";

interface StrategySelectorProps {
  selectedStrategy: StrategyType;
  onStrategyChange: (strategy: StrategyType) => void;
  recommendedStrategies: StrategyOption[];
}

export function StrategySelector({
  selectedStrategy,
  onStrategyChange,
  recommendedStrategies,
}: StrategySelectorProps) {
  const [showAllStrategies, setShowAllStrategies] = useState(false);
  
  const displayedStrategies = showAllStrategies
    ? strategies
    : recommendedStrategies.length > 0
    ? recommendedStrategies
    : strategies.slice(0, 3);
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Project Management Strategy
        </label>
        <button
          type="button"
          onClick={() => setShowAllStrategies(!showAllStrategies)}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          {showAllStrategies ? "Show Recommended" : "Show All"}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedStrategies.map((strategy) => (
          <div
            key={strategy.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedStrategy === strategy.id
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
            }`}
            onClick={() => onStrategyChange(strategy.id)}
          >
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              {strategy.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {strategy.description}
            </p>
            
            <div className="mt-2">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Best For:
              </h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc pl-4 space-y-1">
                {strategy.bestFor.slice(0, 2).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 