export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
        };
        Update: {
          display_name?: string | null;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          ai_provider: Record<string, unknown> | null;
          setup_answers: Record<string, unknown> | null;
          instructions: string;
          is_setup_complete: boolean;
          updated_at: string;
        };
        Insert: {
          id: string;
          ai_provider?: Record<string, unknown> | null;
          setup_answers?: Record<string, unknown> | null;
          instructions?: string;
          is_setup_complete?: boolean;
        };
        Update: {
          ai_provider?: Record<string, unknown> | null;
          setup_answers?: Record<string, unknown> | null;
          instructions?: string;
          is_setup_complete?: boolean;
          updated_at?: string;
        };
      };
      games: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          sorting_name: string | null;
          score: number | null;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          name: string;
          sorting_name?: string | null;
          score?: number | null;
        };
        Update: {
          name?: string;
          sorting_name?: string | null;
          score?: number | null;
        };
      };
      analysis_history: {
        Row: {
          id: string;
          user_id: string;
          game_name: string;
          price: number;
          response: string;
          timestamp: number;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          game_name: string;
          price: number;
          response: string;
          timestamp: number;
        };
        Update: {
          game_name?: string;
          price?: number;
          response?: string;
        };
      };
    };
  };
}
