
import React from 'react';

interface TaskInputProps {
  task: string;
  setTask: (task: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const TaskInput: React.FC<TaskInputProps> = ({ task, setTask, onGenerate, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      onGenerate();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="큰일을 한 줄로 입력하세요. 예: 강의 준비"
        className="flex-1 w-full px-4 py-3 border border-[#A7D8F2] rounded-xl focus:ring-2 focus:ring-[#1E90FF] focus:outline-none transition-shadow"
        disabled={isLoading}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="bg-[#1E90FF] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#167dde] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            생성 중...
          </>
        ) : (
          '생성'
        )}
      </button>
    </div>
  );
};

export default TaskInput;
