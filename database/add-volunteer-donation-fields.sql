-- Add volunteer and donation fields to resources table
-- Supports lightweight integration model: stores nonprofit-provided links/buttons

-- Volunteer fields
ALTER TABLE resources ADD COLUMN volunteer_url TEXT;
ALTER TABLE resources ADD COLUMN volunteer_opportunities TEXT; -- JSON or comma-separated list

-- Donation fields
ALTER TABLE resources ADD COLUMN donation_url TEXT;
ALTER TABLE resources ADD COLUMN donation_button_html TEXT; -- For custom PayPal/Stripe/Givebutter buttons
ALTER TABLE resources ADD COLUMN donation_platform TEXT; -- 'paypal', 'stripe', 'givebutter', 'other'

-- Metadata
ALTER TABLE resources ADD COLUMN accepts_volunteers INTEGER DEFAULT 0; -- Boolean flag
ALTER TABLE resources ADD COLUMN accepts_donations INTEGER DEFAULT 0; -- Boolean flag

-- Indexes for filtering
CREATE INDEX IF NOT EXISTS idx_resources_volunteers ON resources(accepts_volunteers);
CREATE INDEX IF NOT EXISTS idx_resources_donations ON resources(accepts_donations);
