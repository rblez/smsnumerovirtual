-- Migration: Add coins_cost column to sms_rates table
-- Created: 2025-02-18

-- Add coins_cost column with default value of 1
ALTER TABLE sms_rates ADD COLUMN IF NOT EXISTS coins_cost INTEGER DEFAULT 1;

-- Update existing rows with appropriate coin costs based on country
UPDATE sms_rates SET coins_cost = 1 WHERE country = 'Cuba' OR country_code = '53';
UPDATE sms_rates SET coins_cost = 1 WHERE country = 'United States' OR country_code LIKE '1%';
UPDATE sms_rates SET coins_cost = 1 WHERE country = 'Canada' OR country_code = '1';

-- Tier 2: 2 coins
UPDATE sms_rates SET coins_cost = 2 WHERE country IN (
  'Mexico', 'Spain', 'United Kingdom', 'Germany', 'France', 'Italy', 
  'Brazil', 'Argentina', 'Colombia', 'Peru', 'Chile'
);

-- Default: 3 coins for all other countries not yet updated
UPDATE sms_rates SET coins_cost = 3 WHERE coins_cost IS NULL OR coins_cost = 1 AND country NOT IN (
  'Cuba', 'United States', 'Canada'
);

-- Verify the update
SELECT country, country_code, coins_cost, COUNT(*) 
FROM sms_rates 
GROUP BY country, country_code, coins_cost 
ORDER BY coins_cost, country;
