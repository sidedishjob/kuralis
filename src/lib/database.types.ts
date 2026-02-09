export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      categories: {
        Row: {
          icon: string | null;
          id: number;
          name: string;
        };
        Insert: {
          icon?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          icon?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      furniture: {
        Row: {
          brand: string | null;
          category_id: number | null;
          created_at: string | null;
          id: string;
          image_url: string | null;
          location_id: number | null;
          name: string;
          next_due_date: string | null;
          notes: string | null;
          purchased_at: string | null;
          purchased_from: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          brand?: string | null;
          category_id?: number | null;
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          location_id?: number | null;
          name: string;
          next_due_date?: string | null;
          notes?: string | null;
          purchased_at?: string | null;
          purchased_from?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          brand?: string | null;
          category_id?: number | null;
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          location_id?: number | null;
          name?: string;
          next_due_date?: string | null;
          notes?: string | null;
          purchased_at?: string | null;
          purchased_from?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "furniture_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "furniture_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "locations";
            referencedColumns: ["id"];
          },
        ];
      };
      locations: {
        Row: {
          id: number;
          name: string;
          user_id: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          user_id?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      maintenance_records: {
        Row: {
          created_at: string | null;
          id: string;
          next_due_date: string | null;
          notes: string | null;
          performed_at: string;
          status: Database["public"]["Enums"]["maintenance_status"] | null;
          task_cycle_unit: string | null;
          task_cycle_value: number | null;
          task_id: string | null;
          task_name: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          next_due_date?: string | null;
          notes?: string | null;
          performed_at: string;
          status?: Database["public"]["Enums"]["maintenance_status"] | null;
          task_cycle_unit?: string | null;
          task_cycle_value?: number | null;
          task_id?: string | null;
          task_name?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          next_due_date?: string | null;
          notes?: string | null;
          performed_at?: string;
          status?: Database["public"]["Enums"]["maintenance_status"] | null;
          task_cycle_unit?: string | null;
          task_cycle_value?: number | null;
          task_id?: string | null;
          task_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "maintenance_records_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "maintenance_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      maintenance_tasks: {
        Row: {
          created_at: string;
          cycle_unit: string;
          cycle_value: number;
          description: string | null;
          furniture_id: string;
          id: string;
          is_active: boolean;
          name: string;
        };
        Insert: {
          created_at?: string;
          cycle_unit: string;
          cycle_value: number;
          description?: string | null;
          furniture_id: string;
          id?: string;
          is_active?: boolean;
          name: string;
        };
        Update: {
          created_at?: string;
          cycle_unit?: string;
          cycle_value?: number;
          description?: string | null;
          furniture_id?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "maintenance_tasks_furniture_id_fkey";
            columns: ["furniture_id"];
            isOneToOne: false;
            referencedRelation: "furniture";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      maintenance_status: "completed" | "skipped" | "partial";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      maintenance_status: ["completed", "skipped", "partial"],
    },
  },
} as const;
