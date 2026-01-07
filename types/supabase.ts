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
          distance: number | null
          id: string
          image: string | null
          include_teams: boolean
          location: string | null
          organiser_id: string
          race_start_date: string | null
          race_started_at_local: string | null
          race_status: string | null
          race_type: number
          record_age_category: boolean
          record_sex_category: boolean
          registration_url: string | null
          series_id: string | null
          sport_type: number
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          distance?: number | null
          id?: string
          image?: string | null
          include_teams?: boolean
          location?: string | null
          organiser_id: string
          race_start_date?: string | null
          race_started_at_local?: string | null
          race_status?: string | null
          race_type?: number
          record_age_category?: boolean
          record_sex_category?: boolean
          registration_url?: string | null
          series_id?: string | null
          sport_type?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          distance?: number | null
          id?: string
          image?: string | null
          include_teams?: boolean
          location?: string | null
          organiser_id?: string
          race_start_date?: string | null
          race_started_at_local?: string | null
          race_status?: string | null
          race_type?: number
          record_age_category?: boolean
          record_sex_category?: boolean
          registration_url?: string | null
          series_id?: string | null
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
          {
            foreignKeyName: "public_race_events_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "public_race_event_series"
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
            race_start_list_results: {
        Row: {
          age_category_id: number | null
          age_category_position: number | null
          created_at: string
          finish_time100: number | null
          finished_at_local: string | null
          first_name: string
          id: string
          last_name: string
          net_finish_time100: number | null
          net_started_at_local: string | null
          position: number | null
          public_race_event_id: string
          race_number: number
          series_participant_id: string | null
          sex_category_id: number | null
          sex_category_position: number | null
          team_id: string | null
          updated_at: string
        }
        Insert: {
          age_category_id?: number | null
          age_category_position?: number | null
          created_at?: string
          finish_time100?: number | null
          finished_at_local?: string | null
          first_name: string
          id?: string
          last_name: string
          net_finish_time100?: number | null
          net_started_at_local?: string | null
          position?: number | null
          public_race_event_id: string
          race_number: number
          series_participant_id?: string | null
          sex_category_id?: number | null
          sex_category_position?: number | null
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          age_category_id?: number | null
          age_category_position?: number | null
          created_at?: string
          finish_time100?: number | null
          finished_at_local?: string | null
          first_name?: string
          id?: string
          last_name?: string
          net_finish_time100?: number | null
          net_started_at_local?: string | null
          position?: number | null
          public_race_event_id?: string
          race_number?: number
          series_participant_id?: string | null
          sex_category_id?: number | null
          sex_category_position?: number | null
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "race_start_list_results_age_category_id_fkey"
            columns: ["age_category_id"]
            isOneToOne: false
            referencedRelation: "race_athlete_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_start_list_results_public_race_event_id_fkey"
            columns: ["public_race_event_id"]
            isOneToOne: false
            referencedRelation: "public_race_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_start_list_results_series_participant_id_fkey"
            columns: ["series_participant_id"]
            isOneToOne: false
            referencedRelation: "series_participant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_start_list_results_sex_category_id_fkey"
            columns: ["sex_category_id"]
            isOneToOne: false
            referencedRelation: "race_athlete_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_start_list_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "race_teams"
            referencedColumns: ["id"]
          },
        ]
      }
            race_teams: {
        Row: {
          created_at: string
          finish_time100: number | null
          id: string
          name: string
          position: number | null
          public_race_event_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          finish_time100?: number | null
          id?: string
          name: string
          position?: number | null
          public_race_event_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          finish_time100?: number | null
          id?: string
          name?: string
          position?: number | null
          public_race_event_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "race_teams_public_race_event_id_fkey"
            columns: ["public_race_event_id"]
            isOneToOne: false
            referencedRelation: "public_race_events"
            referencedColumns: ["id"]
          },
        ]
      }
            public_race_event_series: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image: string | null
          include_teams: boolean
          organiser_id: string
          race_type: number
          record_age_category: boolean
          record_sex_category: boolean
          registration_url: string | null
          scoring_config_id: string | null
          series_status: string | null
          sport_type: number
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          include_teams?: boolean
          organiser_id: string
          race_type?: number
          record_age_category?: boolean
          record_sex_category?: boolean
          registration_url?: string | null
          scoring_config_id?: string | null
          series_status?: string | null
          sport_type?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          include_teams?: boolean
          organiser_id?: string
          race_type?: number
          record_age_category?: boolean
          record_sex_category?: boolean
          registration_url?: string | null
          scoring_config_id?: string | null
          series_status?: string | null
          sport_type?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_public_race_event_series_scoring_config_id"
            columns: ["scoring_config_id"]
            isOneToOne: false
            referencedRelation: "series_standings_scoring_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_race_event_series_organiser_id_fkey"
            columns: ["organiser_id"]
            isOneToOne: false
            referencedRelation: "organisers"
            referencedColumns: ["id"]
          },
        ]
      }
            series_participant: {
        Row: {
          age_category_id: number | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          series_id: string
          sex_category_id: number | null
          updated_at: string
        }
        Insert: {
          age_category_id?: number | null
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          series_id: string
          sex_category_id?: number | null
          updated_at?: string
        }
        Update: {
          age_category_id?: number | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          series_id?: string
          sex_category_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_participant_age_category_id_fkey"
            columns: ["age_category_id"]
            isOneToOne: false
            referencedRelation: "race_athlete_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "series_participant_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "public_race_event_series"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "series_participant_sex_category_id_fkey"
            columns: ["sex_category_id"]
            isOneToOne: false
            referencedRelation: "race_athlete_categories"
            referencedColumns: ["id"]
          },
        ]
      }
            series_standings_scoring_config: {
        Row: {
          aggregation_method: string
          best_n_results: number | null
          created_at: string
          exclude_dnf: boolean
          id: string
          scoring_method: string
          updated_at: string
        }
        Insert: {
          aggregation_method: string
          best_n_results?: number | null
          created_at?: string
          exclude_dnf?: boolean
          id?: string
          scoring_method: string
          updated_at?: string
        }
        Update: {
          aggregation_method?: string
          best_n_results?: number | null
          created_at?: string
          exclude_dnf?: boolean
          id?: string
          scoring_method?: string
          updated_at?: string
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
