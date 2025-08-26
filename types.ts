export interface SubTask {
  title: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  prep: string[];
  duration_min: number;
  priority: '높음' | '중간' | '낮음';
  due: string | null;
  depends_on: string[];
  automation: string[];
  done_definition: string;
  sub_tasks?: SubTask[];
  isSubtaskLoading?: boolean;
}

export interface ChecklistResponse {
  big_task: string;
  context: {
    role: string | null;
    deadline: string | null;
    location: string | null;
    tools: string[];
  };
  checklist: ChecklistItem[];
  notes: string[];
}