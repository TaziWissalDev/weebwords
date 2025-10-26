import React from 'react';

interface HintPanelProps {
  hints: {
    character: string;
    context: string;
    emoji: string;
  };
}

export const HintPanel: React.FC<HintPanelProps> = ({ hints }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{hints.emoji}</span>
        <h3 className="text-lg font-semibold text-yellow-800">Hints</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
          <div>
            <span className="font-medium text-yellow-800">Character: </span>
            <span className="text-yellow-700">{hints.character}</span>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
          <div>
            <span className="font-medium text-yellow-800">Context: </span>
            <span className="text-yellow-700">{hints.context}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
