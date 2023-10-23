

interface MonthDataItem {
  day: string;
  tasks: any[]; // Define the appropriate type for tasks
  expenses: any[];
  totalExpense:Number
}

export type monthDataType = MonthDataItem[]



export interface DynamicTodo {
  name: string;
  [key: string]: any;
}

export interface EditTodoInfo {
  index: number | null;
  todo: DynamicTodo | null; // Replace "string" with the appropriate type
}