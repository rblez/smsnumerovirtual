-- Migration: Add check constraint to prevent negative credits balance
-- This ensures users can never have a negative balance even if API validation fails

ALTER TABLE profiles 
ADD CONSTRAINT credits_balance_non_negative 
CHECK (credits_balance >= 0);

-- Add comment explaining the constraint
COMMENT ON CONSTRAINT credits_balance_non_negative ON profiles 
IS 'Prevents users from having negative credits balance';
