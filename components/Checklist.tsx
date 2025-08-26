import React, { useState, useMemo } from 'react';
import type { ChecklistItem } from '../types';

interface ChecklistProps {
  items: ChecklistItem[];
}

const Checklist: React.FC<ChecklistProps> = ({ items }) => {
  const [isCopied, setIsCopied] = useState(false);

  const checklistText = useMemo(() => {
    return items.map((item, index) => {
      const prepText = item.prep && item.prep.length > 0
        ? ` (${item.prep.join(', ')})`
        : '';
      return `${index + 1}. ${item.title}${prepText}`;
    }).join('\n');
  }, [items]);

  const handleCopy = async () => {
    if (!checklistText) return;
    try {
      await navigator.clipboard.writeText(checklistText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      alert('복사에 실패했습니다.');
    }
  };

  return (
    <div className="mt-8">
      <div className="relative bg-white border border-[#A7D8F2] rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-[#1E90FF]">간략한 할 일 목록</h2>
          <button 
            onClick={handleCopy}
            className="bg-[#FFD93B] text-[#1E90FF] font-bold py-2 px-4 rounded-lg hover:bg-[#ffd100] transition-colors duration-200 disabled:opacity-50"
            disabled={!checklistText}
          >
            {isCopied ? '복사 완료!' : '전체 복사'}
          </button>
        </div>
        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md font-mono text-sm leading-relaxed text-gray-800" style={{lineHeight: '1.7'}}>
          {checklistText || '생성된 할 일이 없습니다.'}
        </pre>
      </div>
    </div>
  );
};

export default Checklist;
