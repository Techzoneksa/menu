-- Add is_hot and is_cold columns to menu_products
-- Safe to run multiple times (idempotent)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_products' AND column_name = 'is_hot'
  ) THEN
    ALTER TABLE menu_products ADD COLUMN is_hot boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_products' AND column_name = 'is_cold'
  ) THEN
    ALTER TABLE menu_products ADD COLUMN is_cold boolean DEFAULT false;
  END IF;
END $$;
