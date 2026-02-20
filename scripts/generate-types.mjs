import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database types for Supabase
const databaseTypes = `export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          credits_balance: number
          custom_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          credits_balance?: number
          custom_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          credits_balance?: number
          custom_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      credit_purchases: {
        Row: {
          id: string
          user_id: string
          amount: number
          package_name: string
          payment_method: string | null
          status: 'pending' | 'completed' | 'cancelled'
          admin_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          package_name: string
          payment_method?: string | null
          status?: 'pending' | 'completed' | 'cancelled'
          admin_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          package_name?: string
          payment_method?: string | null
          status?: 'pending' | 'completed' | 'cancelled'
          admin_notes?: string | null
          created_at?: string
        }
      }
      sms_history: {
        Row: {
          id: string
          user_id: string
          phone_number: string
          message: string
          country: string | null
          operator: string | null
          cost: number
          status: 'pending' | 'sent' | 'delivered' | 'failed'
          delivery_status: string | null
          api_response: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phone_number: string
          message: string
          country?: string | null
          operator?: string | null
          cost: number
          status?: 'pending' | 'sent' | 'delivered' | 'failed'
          delivery_status?: string | null
          api_response?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phone_number?: string
          message?: string
          country?: string | null
          operator?: string | null
          cost?: number
          status?: 'pending' | 'sent' | 'delivered' | 'failed'
          delivery_status?: string | null
          api_response?: Record<string, unknown> | null
          created_at?: string
        }
      }
      sms_rates: {
        Row: {
          id: string
          country: string
          country_code: string | null
          dial_code: string | null
          operator: string
          api_cost: number
          sale_price: number
          coins_cost: number
          updated_at: string
        }
        Insert: {
          id?: string
          country: string
          country_code?: string | null
          dial_code?: string | null
          operator: string
          api_cost?: number
          sale_price?: number
          coins_cost?: number
          updated_at?: string
        }
        Update: {
          id?: string
          country?: string
          country_code?: string | null
          dial_code?: string | null
          operator?: string
          api_cost?: number
          sale_price?: number
          coins_cost?: number
          updated_at?: string
        }
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
  }
}`;

const typesDir = path.join(__dirname, '..', 'types');
const databaseFile = path.join(typesDir, 'database.ts');

// Ensure types directory exists
if (!fs.existsSync(typesDir)) {
  fs.mkdirSync(typesDir, { recursive: true });
}

// Write the database types file
fs.writeFileSync(databaseFile, databaseTypes, 'utf8');

console.log('✅ Database types generated successfully');
