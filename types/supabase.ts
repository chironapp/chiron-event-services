export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
            organisers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
            public_race_events: {
        Row: {
          created_at: string
          description: string | null
          distance1000: number | null
          id: string
          image: string | null
          organiser_id: string
          race_start_date: string | null
          race_started_at_local: string | null
          race_status: string | null
          race_type: number
          registration_url: string | null
          sport_type: number
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          distance1000?: number | null
          id?: string
          image?: string | null
          organiser_id: string
          race_start_date?: string | null
          race_started_at_local?: string | null
          race_status?: string | null
          race_type?: number
          registration_url?: string | null
          sport_type?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          distance1000?: number | null
          id?: string
          image?: string | null
          organiser_id?: string
          race_start_date?: string | null
          race_started_at_local?: string | null
          race_status?: string | null
          race_type?: number
          registration_url?: string | null
          sport_type?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_race_event_organiser_id_fkey"
            columns: ["organiser_id"]
            isOneToOne: false
            referencedRelation: "organisers"
            referencedColumns: ["id"]
          },
        ]
      }
            race_athlete_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          race_athlete_category_collection_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          race_athlete_category_collection_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          race_athlete_category_collection_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "race_athlete_categories_race_athlete_category_collection_i_fkey"
            columns: ["race_athlete_category_collection_id"]
            isOneToOne: false
            referencedRelation: "race_athlete_category_collections"
            referencedColumns: ["id"]
          },
        ]
      }
            race_athlete_category_collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
