// Types temporaires pour remplacer Supabase - seront migrés vers Drizzle

export interface Tables {
  stores: {
    id: string;
    name: string;
    description?: string;
    slug: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  };
  products: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    category?: string;
    stock_quantity: number;
    store_id: string;
    created_at: string;
    updated_at: string;
  };
  orders: {
    id: string;
    store_id: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

// Type helper pour récupérer un type de table
export type Database = {
  public: {
    Tables: {
      [K in keyof Tables]: {
        Row: Tables[K];
        Insert: Partial<Tables[K]>;
        Update: Partial<Tables[K]>;
      };
    };
  };
};
