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
          bid_count: number | null
          bid_increment: number | null
          category: string
          condition: string | null
          counter_offer_amount: number | null
          counter_offer_expires_at: string | null
          created_at: string | null
          current_highest_bid: number | null
          dimensions: string | null
          duration_minutes: number
          go_live_at: string
          highest_bidder_id: string | null
          id: string
          item_description: string
          item_images: string[] | null
          item_name: string
          location: string | null
          payment_methods: string[] | null
          reserve_price: number | null
          seller_decision: string | null
          seller_id: string
          shipping_cost: number | null
          shipping_included: boolean | null
          starting_price: number
          status: string | null
          updated_at: string | null
          views_count: number | null
          watchers_count: number | null
          weight: string | null
        }
        Insert: {
          bid_count?: number | null
          bid_increment?: number | null
          category: string
          condition?: string | null
          counter_offer_amount?: number | null
          counter_offer_expires_at?: string | null
          created_at?: string | null
          current_highest_bid?: number | null
          dimensions?: string | null
          duration_minutes: number
          go_live_at: string
          highest_bidder_id?: string | null
          id?: string
          item_description: string
          item_images?: string[] | null
          item_name: string
          location?: string | null
          payment_methods?: string[] | null
          reserve_price?: number | null
          seller_decision?: string | null
          seller_id: string
          shipping_cost?: number | null
          shipping_included?: boolean | null
          starting_price: number
          status?: string | null
          updated_at?: string | null
          views_count?: number | null
          watchers_count?: number | null
          weight?: string | null
        }
        Update: {
          bid_count?: number | null
          bid_increment?: number | null
          category?: string
          condition?: string | null
          counter_offer_amount?: number | null
          counter_offer_expires_at?: string | null
          created_at?: string | null
          current_highest_bid?: number | null
          dimensions?: string | null
          duration_minutes?: number
          go_live_at?: string
          highest_bidder_id?: string | null
          id?: string
          item_description?: string
          item_images?: string[] | null
          item_name?: string
          location?: string | null
          payment_methods?: string[] | null
          reserve_price?: number | null
          seller_decision?: string | null
          seller_id?: string
          shipping_cost?: number | null
          shipping_included?: boolean | null
          starting_price?: number
          status?: string | null
          updated_at?: string | null
          views_count?: number | null
          watchers_count?: number | null
          weight?: string | null
        }
        Relationships: []
      }
      bids: {
        Row: {
          auction_id: string
          bid_amount: number
          bid_source: string | null
          bid_time: string | null
          bid_type: string | null
          bidder_id: string
          client_ip: string | null
          created_at: string | null
          id: string
          is_auto_bid: boolean | null
          is_winning_bid: boolean | null
          max_bid_amount: number | null
          user_agent: string | null
        }
        Insert: {
          auction_id: string
          bid_amount: number
          bid_source?: string | null
          bid_time?: string | null
          bid_type?: string | null
          bidder_id: string
          client_ip?: string | null
          created_at?: string | null
          id?: string
          is_auto_bid?: boolean | null
          is_winning_bid?: boolean | null
          max_bid_amount?: number | null
          user_agent?: string | null
        }
        Update: {
          auction_id?: string
          bid_amount?: number
          bid_source?: string | null
          bid_time?: string | null
          bid_type?: string | null
          bidder_id?: string
          client_ip?: string | null
          created_at?: string | null
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
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          auction_id: string | null
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          read_at: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auction_id?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          read_at?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auction_id?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          read_at?: string | null
          title?: string
          type?: string
          updated_at?: string | null
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
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          location: string | null
          member_since: string | null
          phone: string | null
          rating: number | null
          total_ratings: number | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          member_since?: string | null
          phone?: string | null
          rating?: number | null
          total_ratings?: number | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          member_since?: string | null
          phone?: string | null
          rating?: number | null
          total_ratings?: number | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          added_at: string | null
          auction_id: string
          id: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          auction_id: string
          id?: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          auction_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
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
          p_priority?: string
          p_title: string
          p_type: string
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
