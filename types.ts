export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface ChartDataPoint {
  x: number;
  y: number;
}

export interface MathResponse {
  text: string;           // The conversational response
  latex?: string;         // The primary equation if applicable
  chartData?: ChartDataPoint[]; // Data points if a graph is requested
  chartLabel?: string;    // Label for the graph
  relatedTopics?: string[]; // Suggestions for follow-up
}

export interface Message {
  id: string;
  role: MessageRole;
  content: MathResponse;
  timestamp: number;
  isError?: boolean;
}

export interface AppState {
  messages: Message[];
  isLoading: boolean;
  currentInput: string;
  showGraph: boolean;
  useArabicDigits: boolean;
}