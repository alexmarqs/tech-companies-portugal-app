export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          careers_url: string;
          categories: string[];
          created_at: string;
          description: string;
          github_url: string;
          id: string;
          is_featured: boolean;
          locations: string[];
          logo_url: string | null;
          name: string;
          ownership_claimed: boolean;
          ownership_reason: string | null;
          published_at: string | null;
          slug: string;
          source: Database["public"]["Enums"]["company_source"];
          status: Database["public"]["Enums"]["company_status"];
          submitted_by: string | null;
          updated_at: string;
          website_url: string;
        };
        Insert: {
          careers_url?: string;
          categories?: string[];
          created_at?: string;
          description?: string;
          github_url?: string;
          id?: string;
          is_featured?: boolean;
          locations?: string[];
          logo_url?: string | null;
          name: string;
          ownership_claimed?: boolean;
          ownership_reason?: string | null;
          published_at?: string | null;
          slug: string;
          source?: Database["public"]["Enums"]["company_source"];
          status?: Database["public"]["Enums"]["company_status"];
          submitted_by?: string | null;
          updated_at?: string;
          website_url?: string;
        };
        Update: {
          careers_url?: string;
          categories?: string[];
          created_at?: string;
          description?: string;
          github_url?: string;
          id?: string;
          is_featured?: boolean;
          locations?: string[];
          logo_url?: string | null;
          name?: string;
          ownership_claimed?: boolean;
          ownership_reason?: string | null;
          published_at?: string | null;
          slug?: string;
          source?: Database["public"]["Enums"]["company_source"];
          status?: Database["public"]["Enums"]["company_status"];
          submitted_by?: string | null;
          updated_at?: string;
          website_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "companies_submitted_by_fkey";
            columns: ["submitted_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      companies_snapshot: {
        Row: {
          id: string;
          slugs: string[];
          snapshot_date: string;
        };
        Insert: {
          id?: string;
          slugs: string[];
          snapshot_date?: string;
        };
        Update: {
          id?: string;
          slugs?: string[];
          snapshot_date?: string;
        };
        Relationships: [];
      };
      company_drafts: {
        Row: {
          careers_url: string;
          categories: string[];
          company_id: string;
          created_at: string;
          created_by: string | null;
          description: string;
          github_url: string;
          id: string;
          locations: string[];
          name: string;
          updated_at: string;
          updated_by: string | null;
          website_url: string;
        };
        Insert: {
          careers_url?: string;
          categories?: string[];
          company_id: string;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          github_url?: string;
          id?: string;
          locations?: string[];
          name: string;
          updated_at?: string;
          updated_by?: string | null;
          website_url?: string;
        };
        Update: {
          careers_url?: string;
          categories?: string[];
          company_id?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          github_url?: string;
          id?: string;
          locations?: string[];
          name?: string;
          updated_at?: string;
          updated_by?: string | null;
          website_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "company_drafts_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: true;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "company_drafts_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "company_drafts_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      company_invitations: {
        Row: {
          company_id: string;
          created_at: string;
          email: string;
          expires_at: string;
          id: string;
          invited_by: string | null;
          responded_at: string | null;
          role: Database["public"]["Enums"]["company_member_role"];
          status: Database["public"]["Enums"]["company_invitation_status"];
          token: string;
          updated_at: string;
        };
        Insert: {
          company_id: string;
          created_at?: string;
          email: string;
          expires_at?: string;
          id?: string;
          invited_by?: string | null;
          responded_at?: string | null;
          role?: Database["public"]["Enums"]["company_member_role"];
          status?: Database["public"]["Enums"]["company_invitation_status"];
          token: string;
          updated_at?: string;
        };
        Update: {
          company_id?: string;
          created_at?: string;
          email?: string;
          expires_at?: string;
          id?: string;
          invited_by?: string | null;
          responded_at?: string | null;
          role?: Database["public"]["Enums"]["company_member_role"];
          status?: Database["public"]["Enums"]["company_invitation_status"];
          token?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "company_invitations_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "company_invitations_invited_by_fkey";
            columns: ["invited_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      company_members: {
        Row: {
          company_id: string;
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["company_member_role"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          company_id: string;
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["company_member_role"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          company_id?: string;
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["company_member_role"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "company_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      notification_settings: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"];
          created_at: string;
          enabled: boolean;
          id: string;
          type: Database["public"]["Enums"]["notification_type"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          channel: Database["public"]["Enums"]["notification_channel"];
          created_at?: string;
          enabled?: boolean;
          id?: string;
          type: Database["public"]["Enums"]["notification_type"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"];
          created_at?: string;
          enabled?: boolean;
          id?: string;
          type?: Database["public"]["Enums"]["notification_type"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_company_invitation: { Args: { _token: string }; Returns: string };
      company_is_approved: { Args: { _company_id: string }; Returns: boolean };
      decline_company_invitation: {
        Args: { _token: string };
        Returns: undefined;
      };
      has_pending_invitation_from: {
        Args: { _user_id: string };
        Returns: boolean;
      };
      has_pending_invitation_to: {
        Args: { _company_id: string };
        Returns: boolean;
      };
      shares_company_with: { Args: { _user_id: string }; Returns: boolean };
      user_company_role: {
        Args: { _company_id: string };
        Returns: Database["public"]["Enums"]["company_member_role"];
      };
    };
    Enums: {
      company_invitation_status:
        | "pending"
        | "accepted"
        | "declined"
        | "expired";
      company_member_role: "owner" | "editor";
      company_source: "github" | "submitted";
      company_status: "pending" | "approved" | "rejected";
      notification_channel: "email" | "push";
      notification_type: "new_companies";
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
      company_invitation_status: ["pending", "accepted", "declined", "expired"],
      company_member_role: ["owner", "editor"],
      company_source: ["github", "submitted"],
      company_status: ["pending", "approved", "rejected"],
      notification_channel: ["email", "push"],
      notification_type: ["new_companies"],
    },
  },
} as const;
