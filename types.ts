
export interface SystemStat {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  status: 'nominal' | 'warning' | 'critical';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'system' | 'ai' | 'user';
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

export interface Attachment {
  type: 'image' | 'video' | 'audio';
  url: string;
  mimeType: string;
  data?: string; // base64 data for API
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text?: string;
  timestamp: Date;
  attachments?: Attachment[];
  groundingUrls?: Array<{title: string, uri: string}>;
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '2:3' | '3:2' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';
export type MediaType = 'text' | 'image' | 'video';
export type RenderStyle = 'realistic' | 'blueprint' | 'sketch' | 'cyberpunk';
export type AIProvider = 'gemini' | 'ollama';

export interface GenerationConfig {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  mode: MediaType;
  style: RenderStyle;
}

export type PageView = 'home' | 'tools' | 'settings' | 'files' | 'academic' | 'projects' | 'improvement';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface KnowledgeFile {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'pdf' | 'code' | 'image';
  size: string;
  status: 'indexed' | 'scanning' | 'corrupted' | 'missing';
  active: boolean;
  lastScanned: string;
}