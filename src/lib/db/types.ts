/**
 * Hand-written Supabase Database types matching `supabase/migrations/0001_init.sql`.
 * Replace with generated types once linked: `supabase gen types typescript --linked`.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      folders: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recordings: {
        Row: {
          id: string;
          user_id: string;
          folder_id: string | null;
          title: string;
          storage_path: string;
          mime_type: string;
          size_bytes: number;
          duration_sec: number | null;
          status:
            | "uploading"
            | "queued"
            | "transcribing"
            | "summarizing"
            | "ready"
            | "failed";
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          folder_id?: string | null;
          title: string;
          storage_path: string;
          mime_type: string;
          size_bytes: number;
          duration_sec?: number | null;
          status?:
            | "uploading"
            | "queued"
            | "transcribing"
            | "summarizing"
            | "ready"
            | "failed";
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          folder_id?: string | null;
          title?: string;
          storage_path?: string;
          mime_type?: string;
          size_bytes?: number;
          duration_sec?: number | null;
          status?:
            | "uploading"
            | "queued"
            | "transcribing"
            | "summarizing"
            | "ready"
            | "failed";
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      transcripts: {
        Row: {
          recording_id: string;
          user_id: string;
          language: string | null;
          full_text: string;
          segments: Json;
          token_count: number | null;
          created_at: string;
        };
        Insert: {
          recording_id: string;
          user_id: string;
          language?: string | null;
          full_text: string;
          segments?: Json;
          token_count?: number | null;
          created_at?: string;
        };
        Update: {
          recording_id?: string;
          user_id?: string;
          language?: string | null;
          full_text?: string;
          segments?: Json;
          token_count?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      summaries: {
        Row: {
          recording_id: string;
          user_id: string;
          tldr: string;
          bullets: Json;
          takeaways: Json;
          topics: Json | null;
          model: string;
          created_at: string;
        };
        Insert: {
          recording_id: string;
          user_id: string;
          tldr: string;
          bullets?: Json;
          takeaways?: Json;
          topics?: Json | null;
          model: string;
          created_at?: string;
        };
        Update: {
          recording_id?: string;
          user_id?: string;
          tldr?: string;
          bullets?: Json;
          takeaways?: Json;
          topics?: Json | null;
          model?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      chats: {
        Row: {
          id: string;
          recording_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          recording_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          recording_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          chat_id: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          tokens_in: number | null;
          tokens_out: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          tokens_in?: number | null;
          tokens_out?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          user_id?: string;
          role?: "user" | "assistant";
          content?: string;
          tokens_in?: number | null;
          tokens_out?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      promocodes: {
        Row: {
          id: string;
          code: string;
          description: string | null;
          type: "free_minutes" | "discount_percent" | "free_package";
          free_minutes: number | null;
          discount_percent: number | null;
          package_id: string | null;
          max_uses: number | null;
          used_count: number;
          expires_at: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description?: string | null;
          type: "free_minutes" | "discount_percent" | "free_package";
          free_minutes?: number | null;
          discount_percent?: number | null;
          package_id?: string | null;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          description?: string | null;
          type?: "free_minutes" | "discount_percent" | "free_package";
          free_minutes?: number | null;
          discount_percent?: number | null;
          package_id?: string | null;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      promocode_redemptions: {
        Row: {
          id: string;
          promocode_id: string;
          user_id: string;
          redeemed_at: string;
          granted_minutes: number | null;
        };
        Insert: {
          id?: string;
          promocode_id: string;
          user_id: string;
          redeemed_at?: string;
          granted_minutes?: number | null;
        };
        Update: {
          id?: string;
          promocode_id?: string;
          user_id?: string;
          redeemed_at?: string;
          granted_minutes?: number | null;
        };
        Relationships: [];
      };
      recording_feedback: {
        Row: {
          recording_id: string;
          user_id: string;
          rating: -1 | 0 | 1;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          recording_id: string;
          user_id: string;
          rating: -1 | 0 | 1;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          recording_id?: string;
          user_id?: string;
          rating?: -1 | 0 | 1;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      recording_status:
        | "uploading"
        | "queued"
        | "transcribing"
        | "summarizing"
        | "ready"
        | "failed";
      chat_role: "user" | "assistant";
    };
    CompositeTypes: Record<string, never>;
  };
}
