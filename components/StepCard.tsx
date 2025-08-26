import React from 'react';
import type { ChecklistItem } from '../types';

interface StepCardProps {
  item: ChecklistItem;
  onDecomposeSubTask: (itemId: string, itemTitle: string, itemDescription: string) => void;
}

const StepCard: React.FC<StepCardProps> = ({ item, onDecomposeSubTask }) => {
  return (
    <div className="bg-white border border-[#A7D8F2] p-4 rounded-2xl shadow-lg flex flex-col items-center text-center transition-transform hover:scale-105 duration-300 h-full">
      <div className="text-5xl mb-3" aria-hidden="true">{item.emoji || '✨'}</div>
      <h3 className="text-md font-bold mb-2 text-[#1E90FF] flex-grow">
        {item.title}
      </h3>
      <div className="text-xs bg-[#E6F4FA] text-[#1666b8] rounded-full px-3 py-1">
        {item.duration_min}분 &middot; {item.priority}
      </div>

      <div className="w-full mt-4 pt-4 border-t border-gray-100 min-h-[76px] flex flex-col justify-center">
        {item.isSubtaskLoading ? (
          <div className="flex items-center justify-center text-sm text-gray-500">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#1E90FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>세분화 중...</span>
          </div>
        ) : item.sub_tasks && item.sub_tasks.length > 0 ? (
          <div className="text-left w-full">
            <h4 className="font-bold text-sm text-gray-600 mb-2 text-center">하위 할 일:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 pl-2">
              {item.sub_tasks.map((sub, index) => (
                <li key={index}>{sub.title}</li>
              ))}
            </ul>
          </div>
        ) : (
          <button
            onClick={() => onDecomposeSubTask(item.id, item.title, item.description)}
            className="w-full bg-white text-[#1E90FF] border border-[#1E90FF] font-semibold py-2 px-4 rounded-lg hover:bg-[#E6F4FA] transition-colors duration-200 text-sm"
          >
            더 쪼개기
          </button>
        )}
      </div>
    </div>
  );
};

export default StepCard;