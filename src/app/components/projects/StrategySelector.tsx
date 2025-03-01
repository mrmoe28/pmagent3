"use client";

import { useState } from "react";
import { StrategyOption, StrategyType } from "@/app/types/project.types";
import { strategies } from "@/app/lib/strategies";
import { motion } from "framer-motion";

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Project Management Strategy
        </label>
        <button
          type="button"
          onClick={() => setShowAllStrategies(!showAllStrategies)}
          className="text-sm text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors"
        >
          {showAllStrategies ? "Show Recommended" : "Show All"}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedStrategies.map((strategy, index) => (
          <motion.div
            key={strategy.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedStrategy === strategy.id
                ? "border-orange-500 ring-1 ring-orange-500 bg-orange-50 dark:bg-orange-900/10"
                : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md"
            }`}
            onClick={() => onStrategyChange(strategy.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedStrategy === strategy.id && (
              <div className="h-1 bg-orange-500 w-full"></div>
            )}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-1 flex items-center">
                {selectedStrategy === strategy.id && (
                  <svg className="w-4 h-4 text-orange-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                )}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
} 