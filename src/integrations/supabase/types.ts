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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      auctions: {
        Row: {
          auto_extend_enabled: boolean | null
          auto_extend_minutes: number | null
          bid_count: number | null
          bid_increment: number
          category: string | null
          condition: string | null
          counter_offer_amount: number | null
          counter_offer_expires_at: string | null
          created_at: string
          current_highest_bid: number | null
          duration_minutes: number
          featured: boolean | null
          go_live_at: string
          highest_bidder_id: string | null
          id: string
          item_description: string | null
          item_images: string[] | null
          item_name: string
          location: string | null
          payment_methods: string[] | null
          reserve_price: number | null
          seller_decision:
            | Database["public"]["Enums"]["enum_auctions_seller_decision"]
            | null
          seller_id: string
          shipping_cost: number | null
          shipping_included: boolean | null
          starting_price: number
          status: Database["public"]["Enums"]["enum_auctions_status"] | null
          updated_at: string
          view_count: number | null
        }
        Insert: {
          auto_extend_enabled?: boolean | null
          auto_extend_minutes?: number | null
          bid_count?: number | null
          bid_increment: number
          category?: string | null
          condition?: string | null
          counter_offer_amount?: number | null
          counter_offer_expires_at?: string | null
          created_at: string
          current_highest_bid?: number | null
          duration_minutes: number
          featured?: boolean | null
          go_live_at: string
          highest_bidder_id?: string | null
          id: string
          item_description?: string | null
          item_images?: string[] | null
          item_name: string
          location?: string | null
          payment_methods?: string[] | null
          reserve_price?: number | null
          seller_decision?:
            | Database["public"]["Enums"]["enum_auctions_seller_decision"]
            | null
          seller_id: string
          shipping_cost?: number | null
          shipping_included?: boolean | null
          starting_price: number
          status?: Database["public"]["Enums"]["enum_auctions_status"] | null
          updated_at: string
          view_count?: number | null
        }
        Update: {
          auto_extend_enabled?: boolean | null
          auto_extend_minutes?: number | null
          bid_count?: number | null
          bid_increment?: number
          category?: string | null
          condition?: string | null
          counter_offer_amount?: number | null
          counter_offer_expires_at?: string | null
          created_at?: string
          current_highest_bid?: number | null
          duration_minutes?: number
          featured?: boolean | null
          go_live_at?: string
          highest_bidder_id?: string | null
          id?: string
          item_description?: string | null
          item_images?: string[] | null
          item_name?: string
          location?: string | null
          payment_methods?: string[] | null
          reserve_price?: number | null
          seller_decision?:
            | Database["public"]["Enums"]["enum_auctions_seller_decision"]
            | null
          seller_id?: string
          shipping_cost?: number | null
          shipping_included?: boolean | null
          starting_price?: number
          status?: Database["public"]["Enums"]["enum_auctions_status"] | null
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auctions_highest_bidder_id_fkey"
            columns: ["highest_bidder_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auctions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          auction_id: string
          bid_amount: number
          bid_source: Database["public"]["Enums"]["enum_bids_bid_source"] | null
          bid_time: string | null
          bid_type: Database["public"]["Enums"]["enum_bids_bid_type"] | null
          bidder_id: string
          client_ip: unknown | null
          id: string
          is_auto_bid: boolean | null
          is_winning_bid: boolean | null
          max_bid_amount: number | null
          user_agent: string | null
        }
        Insert: {
          auction_id: string
          bid_amount: number
          bid_source?:
            | Database["public"]["Enums"]["enum_bids_bid_source"]
            | null
          bid_time?: string | null
          bid_type?: Database["public"]["Enums"]["enum_bids_bid_type"] | null
          bidder_id: string
          client_ip?: unknown | null
          id: string
          is_auto_bid?: boolean | null
          is_winning_bid?: boolean | null
          max_bid_amount?: number | null
          user_agent?: string | null
        }
        Update: {
          auction_id?: string
          bid_amount?: number
          bid_source?:
            | Database["public"]["Enums"]["enum_bids_bid_source"]
            | null
          bid_time?: string | null
          bid_type?: Database["public"]["Enums"]["enum_bids_bid_type"] | null
          bidder_id?: string
          client_ip?: unknown | null
          id?: string
          is_auto_bid?: boolean | null
          is_winning_bid?: boolean | null
          max_bid_amount?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          auction_id: string | null
          created_at: string
          data: Json | null
          expires_at: string | null
          id: string
          is_email_sent: boolean | null
          is_push_sent: boolean | null
          is_read: boolean | null
          message: string
          priority:
            | Database["public"]["Enums"]["enum_notifications_priority"]
            | null
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["enum_notifications_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          auction_id?: string | null
          created_at: string
          data?: Json | null
          expires_at?: string | null
          id: string
          is_email_sent?: boolean | null
          is_push_sent?: boolean | null
          is_read?: boolean | null
          message: string
          priority?:
            | Database["public"]["Enums"]["enum_notifications_priority"]
            | null
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["enum_notifications_type"]
          updated_at: string
          user_id: string
        }
        Update: {
          auction_id?: string | null
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_email_sent?: boolean | null
          is_push_sent?: boolean | null
          is_read?: boolean | null
          message?: string
          priority?:
            | Database["public"]["Enums"]["enum_notifications_priority"]
            | null
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["enum_notifications_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_login_at: string | null
          login_count: number | null
          password_hash: string
          password_reset_expires: string | null
          password_reset_token: string | null
          phone: string | null
          profile_image_url: string | null
          updated_at: string
          username: string
          verification_token: string | null
        }
        Insert: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login_at?: string | null
          login_count?: number | null
          password_hash: string
          password_reset_expires?: string | null
          password_reset_token?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at: string
          username: string
          verification_token?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login_at?: string | null
          login_count?: number | null
          password_hash?: string
          password_reset_expires?: string | null
          password_reset_token?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
          username?: string
          verification_token?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          p_auction_id?: string
          p_data?: Json
          p_message: string
          p_priority?: Database["public"]["Enums"]["enum_notifications_priority"]
          p_title: string
          p_type: Database["public"]["Enums"]["enum_notifications_type"]
          p_user_id: string
        }
        Returns: string
      }
      update_auction_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      enum_auctions_seller_decision:
        | "pending"
        | "accepted"
        | "rejected"
        | "counter_offer"
      enum_auctions_status:
        | "draft"
        | "pending"
        | "active"
        | "ended"
        | "cancelled"
        | "completed"
      enum_bids_bid_source: "web" | "mobile" | "api"
      enum_bids_bid_type: "manual" | "automatic" | "proxy"
      enum_notifications_priority: "low" | "medium" | "high" | "urgent"
      enum_notifications_type:
        | "bid_placed"
        | "outbid"
        | "auction_won"
        | "auction_ended"
        | "seller_decision"
        | "counter_offer"
        | "payment_reminder"
        | "auction_starting_soon"
        | "price_drop"
        | "new_auction_in_category"
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
    Enums: {
      enum_auctions_seller_decision: [
        "pending",
        "accepted",
        "rejected",
        "counter_offer",
      ],
      enum_auctions_status: [
        "draft",
        "pending",
        "active",
        "ended",
        "cancelled",
        "completed",
      ],
      enum_bids_bid_source: ["web", "mobile", "api"],
      enum_bids_bid_type: ["manual", "automatic", "proxy"],
      enum_notifications_priority: ["low", "medium", "high", "urgent"],
      enum_notifications_type: [
        "bid_placed",
        "outbid",
        "auction_won",
        "auction_ended",
        "seller_decision",
        "counter_offer",
        "payment_reminder",
        "auction_starting_soon",
        "price_drop",
        "new_auction_in_category",
      ],
    },
  },
} as const
