import type { MetaDB } from 'kysely-is-an-orm'
import type { Database } from './generated/Database.js'

export const meta = {
  audit_logs: {
    relations: {
      user: { model: 'users', type: 'one', from: 'user_id', to: 'id' },
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
    },
  },

  commission_history: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      changed_by_user: { model: 'users', type: 'one', from: 'changed_by', to: 'id' },
    },
  },

  product_price_history: {
    relations: {
      product: { model: 'products', type: 'one', from: 'product_id', to: 'id' },
      changed_by_user: { model: 'users', type: 'one', from: 'changed_by', to: 'id' },
    },
  },

  users: {
    relations: {
      staff_memberships: { model: 'flea_market_staff', type: 'many', from: 'id', to: 'user_id' },
      favorites: { model: 'favorites', type: 'many', from: 'id', to: 'user_id' },
      products: { model: 'products', type: 'many', from: 'id', to: 'seller_id' },
      reservations: { model: 'reservations', type: 'many', from: 'id', to: 'seller_id' },
      payouts: { model: 'payouts', type: 'many', from: 'id', to: 'seller_id' },
    },
  },

  flea_markets: {
    relations: {
      staff: { model: 'flea_market_staff', type: 'many', from: 'id', to: 'flea_market_id' },
      floors: { model: 'floors', type: 'many', from: 'id', to: 'flea_market_id' },
      spot_types: { model: 'spot_types', type: 'many', from: 'id', to: 'flea_market_id' },
      products: { model: 'products', type: 'many', from: 'id', to: 'flea_market_id' },
      reservations: { model: 'reservations', type: 'many', from: 'id', to: 'flea_market_id' },
      sales: { model: 'sales', type: 'many', from: 'id', to: 'flea_market_id' },
      payments: { model: 'payments', type: 'many', from: 'id', to: 'flea_market_id' },
      payouts: { model: 'payouts', type: 'many', from: 'id', to: 'flea_market_id' },
      upload_batches: { model: 'upload_batches', type: 'many', from: 'id', to: 'flea_market_id' },
      market_spaces: { model: 'market_spaces', type: 'many', from: 'id', to: 'flea_market_id' },
      space_reservations: { model: 'space_reservations', type: 'many', from: 'id', to: 'flea_market_id' },
      seller_memberships: { model: 'seller_market_memberships', type: 'many', from: 'id', to: 'flea_market_id' },
      seller_offers: { model: 'seller_offers', type: 'many', from: 'id', to: 'store_id' },
      suppliers: { model: 'suppliers', type: 'many', from: 'id', to: 'flea_market_id' },
      purchase_orders: { model: 'purchase_orders', type: 'many', from: 'id', to: 'flea_market_id' },
      commission_history: { model: 'commission_history', type: 'many', from: 'id', to: 'flea_market_id' },
      audit_logs: { model: 'audit_logs', type: 'many', from: 'id', to: 'flea_market_id' },
    },
  },

  flea_market_staff: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      user: { model: 'users', type: 'one', from: 'user_id', to: 'id' },
      invited_by_user: { model: 'users', type: 'one', from: 'invited_by', to: 'id' },
    },
  },

  floors: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      spots: { model: 'spots', type: 'many', from: 'id', to: 'floor_id' },
      elements: { model: 'floor_elements', type: 'many', from: 'id', to: 'floor_id' },
    },
  },

  floor_elements: {
    relations: {
      floor: { model: 'floors', type: 'one', from: 'floor_id', to: 'id' },
    },
  },

  spot_types: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      spots: { model: 'spots', type: 'many', from: 'id', to: 'spot_type_id' },
    },
  },

  spots: {
    relations: {
      floor: { model: 'floors', type: 'one', from: 'floor_id', to: 'id' },
      spot_type: { model: 'spot_types', type: 'one', from: 'spot_type_id', to: 'id' },
      reservations: { model: 'reservations', type: 'many', from: 'id', to: 'spot_id' },
    },
  },

  categories: {
    relations: {
      parent: { model: 'categories', type: 'one', from: 'parent_id', to: 'id' },
      children: { model: 'categories', type: 'many', from: 'id', to: 'parent_id' },
      products: { model: 'products', type: 'many', from: 'id', to: 'category_id' },
    },
  },

  products: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      seller: { model: 'users', type: 'one', from: 'seller_id', to: 'id' },
      category: { model: 'categories', type: 'one', from: 'category_id', to: 'id' },
      reservation: { model: 'space_reservations', type: 'one', from: 'reservation_id', to: 'id' },
      upload_batch: { model: 'upload_batches', type: 'one', from: 'upload_batch_id', to: 'id' },
      supplier: { model: 'suppliers', type: 'one', from: 'supplier_id', to: 'id' },
      collection: { model: 'product_collections', type: 'one', from: 'collection_id', to: 'id' },
      images: { model: 'product_images', type: 'many', from: 'id', to: 'product_id' },
      embeddings: { model: 'product_embeddings', type: 'one', from: 'id', to: 'product_id' },
      sale_items: { model: 'sale_items', type: 'many', from: 'id', to: 'product_id' },
      favorites: { model: 'favorites', type: 'many', from: 'id', to: 'product_id' },
      stock_movements: { model: 'stock_movements', type: 'many', from: 'id', to: 'product_id' },
      price_history: { model: 'product_price_history', type: 'many', from: 'id', to: 'product_id' },
    },
    projections: {
      summary: ['id', 'title', 'title_fi', 'price', 'status', 'flea_market_id', 'seller_id'],
      listing: ['id', 'title', 'title_fi', 'title_en', 'description_fi', 'price', 'status', 'condition_grade', 'barcode'],
    },
  },

  product_images: {
    relations: {
      product: { model: 'products', type: 'one', from: 'product_id', to: 'id' },
    },
  },

  product_embeddings: {
    relations: {
      product: { model: 'products', type: 'one', from: 'product_id', to: 'id' },
    },
  },

  product_collections: {
    relations: {
      user: { model: 'users', type: 'one', from: 'user_id', to: 'id' },
      products: { model: 'products', type: 'many', from: 'id', to: 'collection_id' },
    },
  },

  reservations: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      seller: { model: 'users', type: 'one', from: 'seller_id', to: 'id' },
      spot: { model: 'spots', type: 'one', from: 'spot_id', to: 'id' },
      extended_from: { model: 'reservations', type: 'one', from: 'extended_from_id', to: 'id' },
    },
  },

  space_reservations: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      seller: { model: 'users', type: 'one', from: 'seller_id', to: 'id' },
      space: { model: 'market_spaces', type: 'one', from: 'space_id', to: 'id' },
      products: { model: 'products', type: 'many', from: 'id', to: 'reservation_id' },
    },
  },

  market_spaces: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      reservations: { model: 'space_reservations', type: 'many', from: 'id', to: 'space_id' },
    },
  },

  seller_market_memberships: {
    relations: {
      seller: { model: 'users', type: 'one', from: 'seller_id', to: 'id' },
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
    },
  },

  sales: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      cashier: { model: 'users', type: 'one', from: 'cashier_id', to: 'id' },
      items: { model: 'sale_items', type: 'many', from: 'id', to: 'sale_id' },
      payments: { model: 'sale_payments', type: 'many', from: 'id', to: 'sale_id' },
    },
  },

  sale_items: {
    relations: {
      sale: { model: 'sales', type: 'one', from: 'sale_id', to: 'id' },
      product: { model: 'products', type: 'one', from: 'product_id', to: 'id' },
      seller: { model: 'users', type: 'one', from: 'seller_id', to: 'id' },
    },
  },

  sale_payments: {
    relations: {
      sale: { model: 'sales', type: 'one', from: 'sale_id', to: 'id' },
    },
  },

  pos_sessions: {
    relations: {
      store: { model: 'flea_markets', type: 'one', from: 'store_id', to: 'id' },
      cart_items: { model: 'pos_cart_items', type: 'many', from: 'id', to: 'session_id' },
    },
  },

  pos_cart_items: {
    relations: {
      session: { model: 'pos_sessions', type: 'one', from: 'session_id', to: 'id' },
      product: { model: 'products', type: 'one', from: 'product_id', to: 'id' },
    },
  },

  payouts: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      seller: { model: 'users', type: 'one', from: 'seller_id', to: 'id' },
      items: { model: 'payout_items', type: 'many', from: 'id', to: 'payout_id' },
    },
  },

  payout_items: {
    relations: {
      payout: { model: 'payouts', type: 'one', from: 'payout_id', to: 'id' },
      product: { model: 'products', type: 'one', from: 'product_id', to: 'id' },
    },
  },

  payments: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      user: { model: 'users', type: 'one', from: 'user_id', to: 'id' },
    },
  },

  favorites: {
    relations: {
      user: { model: 'users', type: 'one', from: 'user_id', to: 'id' },
      product: { model: 'products', type: 'one', from: 'product_id', to: 'id' },
    },
  },

  upload_batches: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      seller: { model: 'users', type: 'one', from: 'seller_id', to: 'id' },
      products: { model: 'products', type: 'many', from: 'id', to: 'upload_batch_id' },
    },
  },

  seller_offers: {
    relations: {
      seller: { model: 'users', type: 'one', from: 'seller_id', to: 'id' },
      store: { model: 'flea_markets', type: 'one', from: 'store_id', to: 'id' },
      items: { model: 'offer_items', type: 'many', from: 'id', to: 'offer_id' },
    },
  },

  offer_items: {
    relations: {
      offer: { model: 'seller_offers', type: 'one', from: 'offer_id', to: 'id' },
      images: { model: 'offer_images', type: 'many', from: 'id', to: 'offer_item_id' },
    },
  },

  offer_images: {
    relations: {
      offer_item: { model: 'offer_items', type: 'one', from: 'offer_item_id', to: 'id' },
    },
  },

  suppliers: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      products: { model: 'products', type: 'many', from: 'id', to: 'supplier_id' },
      purchase_orders: { model: 'purchase_orders', type: 'many', from: 'id', to: 'supplier_id' },
    },
  },

  purchase_orders: {
    relations: {
      flea_market: { model: 'flea_markets', type: 'one', from: 'flea_market_id', to: 'id' },
      supplier: { model: 'suppliers', type: 'one', from: 'supplier_id', to: 'id' },
      items: { model: 'purchase_order_items', type: 'many', from: 'id', to: 'purchase_order_id' },
    },
  },

  purchase_order_items: {
    relations: {
      purchase_order: { model: 'purchase_orders', type: 'one', from: 'purchase_order_id', to: 'id' },
      product: { model: 'products', type: 'one', from: 'product_id', to: 'id' },
    },
  },

  stock_movements: {
    relations: {
      product: { model: 'products', type: 'one', from: 'product_id', to: 'id' },
    },
  },
} as const satisfies MetaDB<Database>

export type Meta = typeof meta
