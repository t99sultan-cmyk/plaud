export type RecordingStatus =
  | "uploading"
  | "queued"
  | "transcribing"
  | "summarizing"
  | "ready"
  | "failed";

export type ChatRole = "user" | "assistant";

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recording {
  id: string;
  user_id: string;
  folder_id: string | null;
  title: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  duration_sec: number | null;
  status: RecordingStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  speaker?: string | null; // "A", "B", "C" etc — present when diarization succeeded
}

export interface Transcript {
  recording_id: string;
  user_id: string;
  language: string | null;
  full_text: string;
  segments: TranscriptSegment[];
  token_count: number | null;
  created_at: string;
}

export interface Summary {
  recording_id: string;
  user_id: string;
  tldr: string;
  bullets: string[];
  takeaways: string[];
  topics: string[];
  model: string;
  created_at: string;
}

export interface Chat {
  id: string;
  recording_id: string;
  user_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  user_id: string;
  role: ChatRole;
  content: string;
  tokens_in: number | null;
  tokens_out: number | null;
  created_at: string;
}

export type FeedbackRating = -1 | 0 | 1;

export interface RecordingFeedback {
  recording_id: string;
  user_id: string;
  rating: FeedbackRating;
  comment: string | null;
  created_at: string;
  updated_at: string;
}
