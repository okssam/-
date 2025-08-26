import React, { useState } from 'react';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import StepCard from './components/StepCard';
import Checklist from './components/Checklist';
import { decomposeTask, decomposeSubTask } from './services/geminiService';
import type { ChecklistResponse } from './types';

const App: React.FC = () => {
  const [taskInput, setTaskInput] = useState<string>('');
  const [checklistData, setChecklistData] = useState<ChecklistResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!taskInput.trim()) {
      setError('큰일을 한 줄로 입력하세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setChecklistData(null);

    try {
      const data = await decomposeTask(taskInput);
      setChecklistData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecomposeSubTask = async (itemId: string, itemTitle: string, itemDescription: string) => {
    setChecklistData(prevData => {
        if (!prevData) return null;
        return {
            ...prevData,
            checklist: prevData.checklist.map(item =>
                item.id === itemId ? { ...item, isSubtaskLoading: true } : item
            ),
        };
    });

    try {
        const subTasks = await decomposeSubTask({ title: itemTitle, description: itemDescription });
        setChecklistData(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                checklist: prevData.checklist.map(item =>
                    item.id === itemId ? { ...item, isSubtaskLoading: false, sub_tasks: subTasks } : item
                ),
            };
        });
    } catch (err) {
        console.error("Failed to decompose sub-task:", err);
        setChecklistData(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                checklist: prevData.checklist.map(item =>
                    item.id === itemId ? { ...item, isSubtaskLoading: false } : item
                ),
            };
        });
    }
  };
  
  return (
    <div className="min-h-screen bg-sky-50 font-sans text-gray-800" style={{lineHeight: 1.5}}>
      <Header />
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <TaskInput
          task={taskInput}
          setTask={setTaskInput}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative text-center" role="alert">
            <strong className="font-bold">오류: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {checklistData && (
          <div className="mt-6" aria-live="polite">
            <h2 className="text-2xl font-bold text-[#1E90FF] mb-4">단계별 할 일 카드</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {checklistData.checklist.map((item) => (
                <StepCard 
                  key={item.id} 
                  item={item} 
                  onDecomposeSubTask={handleDecomposeSubTask}
                />
              ))}
            </div>
            <Checklist items={checklistData.checklist} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;