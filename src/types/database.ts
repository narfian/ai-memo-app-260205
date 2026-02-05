export interface Database {
  public: {
    Tables: {
      memos: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// DB Row -> Memo 인터페이스 변환 헬퍼 타입
export type MemoRow = Database['public']['Tables']['memos']['Row']
export type MemoInsert = Database['public']['Tables']['memos']['Insert']
export type MemoUpdate = Database['public']['Tables']['memos']['Update']
