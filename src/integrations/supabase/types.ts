export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: number
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: never
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: never
          password_hash?: string
        }
        Relationships: []
      }
      beneficiaries: {
        Row: {
          created_at: string
          description: string
          filled: boolean
          id: number
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          filled?: boolean
          id?: never
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          filled?: boolean
          id?: never
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: number
          message: string | null
          name: string | null
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: never
          message?: string | null
          name?: string | null
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: never
          message?: string | null
          name?: string | null
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      core_values: {
        Row: {
          created_at: string
          description: string
          id: number
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: never
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: never
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          attachment_name: string | null
          attachment_url: string | null
          category: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          id: number
          image: string
          link: string | null
          title: string
          updated_at: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_url?: string | null
          category?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: never
          image: string
          link?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          attachment_name?: string | null
          attachment_url?: string | null
          category?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: never
          image?: string
          link?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      press_room_items: {
        Row: {
          category: string
          cover_image: string | null
          created_at: string
          description: string | null
          document: string | null
          document_name: string | null
          id: number
          image: string | null
          link: string | null
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          document?: string | null
          document_name?: string | null
          id?: never
          image?: string | null
          link?: string | null
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          document?: string | null
          document_name?: string | null
          id?: never
          image?: string | null
          link?: string | null
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          attachment_name: string | null
          attachment_url: string | null
          cover_image: string | null
          created_at: string
          description: string
          id: number
          image: string | null
          long_description: string | null
          title: string
          updated_at: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_url?: string | null
          cover_image?: string | null
          created_at?: string
          description: string
          id?: never
          image?: string | null
          long_description?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          attachment_name?: string | null
          attachment_url?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string
          id?: never
          image?: string | null
          long_description?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      sub_programs: {
        Row: {
          attachment_name: string | null
          attachment_url: string | null
          cover_image: string | null
          created_at: string
          description: string
          id: number
          image: string | null
          long_description: string | null
          program_id: number
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_url?: string | null
          cover_image?: string | null
          created_at?: string
          description: string
          id?: never
          image?: string | null
          long_description?: string | null
          program_id: number
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          attachment_name?: string | null
          attachment_url?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string
          id?: never
          image?: string | null
          long_description?: string | null
          program_id?: number
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string
          phone: string | null
          photo: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: never
          name: string
          phone?: string | null
          photo?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: never
          name?: string
          phone?: string | null
          photo?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      team_members_public: {
        Row: {
          id: number | null
          name: string | null
          photo: string | null
          title: string | null
        }
        Insert: {
          id?: number | null
          name?: string | null
          photo?: string | null
          title?: string | null
        }
        Update: {
          id?: number | null
          name?: string | null
          photo?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
