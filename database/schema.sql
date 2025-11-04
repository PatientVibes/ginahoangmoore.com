-- ============================================
-- KC Food Security Hub - Database Schema
-- Cloudflare D1 (SQLite)
-- ============================================

-- ============================================
-- Resource Categories
-- ============================================
CREATE TABLE IF NOT EXISTS resource_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    parent_category_id INTEGER,
    icon TEXT,
    color TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES resource_categories(id)
);

CREATE INDEX idx_categories_slug ON resource_categories(slug);
CREATE INDEX idx_categories_parent ON resource_categories(parent_category_id);

-- ============================================
-- Resources (Organizations & Services)
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    description TEXT,

    -- Contact Information
    phone TEXT,
    phone_formatted TEXT,
    email TEXT,
    website TEXT,

    -- Address
    address TEXT,
    city TEXT,
    state TEXT CHECK(state IN ('MO', 'KS')),
    zip TEXT,
    county TEXT,

    -- Geolocation
    latitude REAL,
    longitude REAL,

    -- Hours & Availability
    hours_of_operation TEXT, -- JSON format: {"monday": "9-5", ...}
    availability_notes TEXT,

    -- Eligibility & Requirements
    eligibility_criteria TEXT,
    income_requirements TEXT,
    documents_required TEXT,
    restrictions TEXT,

    -- Service Details
    services_provided TEXT, -- JSON array
    languages_spoken TEXT, -- JSON array

    -- Capacity & Status
    capacity_limit INTEGER,
    current_status TEXT CHECK(current_status IN ('open', 'closed', 'at_capacity', 'unknown')) DEFAULT 'unknown',
    status_updated_at DATETIME,

    -- Verification
    verified BOOLEAN DEFAULT 0,
    verified_at DATETIME,
    verified_by TEXT,
    data_source TEXT,
    source_url TEXT,

    -- Metadata
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES resource_categories(id)
);

CREATE INDEX idx_resources_category ON resources(category_id);
CREATE INDEX idx_resources_zip ON resources(zip);
CREATE INDEX idx_resources_county ON resources(county);
CREATE INDEX idx_resources_state ON resources(state);
CREATE INDEX idx_resources_status ON resources(current_status);
CREATE INDEX idx_resources_verified ON resources(verified);
CREATE INDEX idx_resources_geolocation ON resources(latitude, longitude);

-- ============================================
-- ZIP Codes & Geographic Data
-- ============================================
CREATE TABLE IF NOT EXISTS zipcodes (
    zip TEXT PRIMARY KEY,
    city TEXT NOT NULL,
    county TEXT NOT NULL,
    state TEXT NOT NULL CHECK(state IN ('MO', 'KS')),
    latitude REAL,
    longitude REAL,

    -- Demographics (from Census ACS)
    population INTEGER,
    median_income INTEGER,
    poverty_rate REAL,
    snap_participation_rate REAL,

    -- KC Metro Area Flag
    is_kc_metro BOOLEAN DEFAULT 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_zipcodes_county ON zipcodes(county);
CREATE INDEX idx_zipcodes_state ON zipcodes(state);
CREATE INDEX idx_zipcodes_kc_metro ON zipcodes(is_kc_metro);

-- ============================================
-- SNAP Participation Data
-- ============================================
CREATE TABLE IF NOT EXISTS snap_participation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    county TEXT NOT NULL,
    state TEXT NOT NULL CHECK(state IN ('MO', 'KS')),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK(month BETWEEN 1 AND 12),

    -- Participation Metrics
    households INTEGER,
    individuals INTEGER,
    total_benefits_dollars INTEGER,
    average_benefit_per_household REAL,
    average_benefit_per_person REAL,

    -- Data Source
    data_source TEXT NOT NULL,
    source_url TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(county, state, year, month)
);

CREATE INDEX idx_snap_county_date ON snap_participation(county, state, year, month);
CREATE INDEX idx_snap_date ON snap_participation(year, month);

-- ============================================
-- Food Insecurity Data
-- ============================================
CREATE TABLE IF NOT EXISTS food_insecurity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    county TEXT NOT NULL,
    state TEXT NOT NULL CHECK(state IN ('MO', 'KS')),
    year INTEGER NOT NULL,

    -- Food Insecurity Metrics
    overall_rate REAL,
    child_rate REAL,
    meal_gap INTEGER, -- Number of meals needed
    cost_per_meal REAL,
    total_cost_to_close_gap INTEGER,

    -- Data Source
    data_source TEXT NOT NULL DEFAULT 'Feeding America',
    source_url TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(county, state, year)
);

CREATE INDEX idx_food_insecurity_county ON food_insecurity(county, state, year);

-- ============================================
-- Crisis Updates
-- ============================================
CREATE TABLE IF NOT EXISTS crisis_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    impact TEXT,
    severity TEXT CHECK(severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',

    -- Status
    active BOOLEAN DEFAULT 1,
    start_date DATE,
    end_date DATE,

    -- Content
    content_html TEXT,
    action_items TEXT, -- JSON array

    -- Source
    source TEXT,
    source_url TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_crisis_active ON crisis_updates(active, start_date, severity);

-- ============================================
-- User Feedback / Resource Updates
-- ============================================
CREATE TABLE IF NOT EXISTS resource_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_id INTEGER,
    feedback_type TEXT CHECK(feedback_type IN ('correction', 'hours_change', 'closed', 'phone_change', 'other')) NOT NULL,

    -- Feedback Content
    message TEXT NOT NULL,
    suggested_correction TEXT,

    -- Contact (optional)
    contact_email TEXT,

    -- Status
    status TEXT CHECK(status IN ('pending', 'reviewed', 'applied', 'rejected')) DEFAULT 'pending',
    reviewed_at DATETIME,
    reviewed_by TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (resource_id) REFERENCES resources(id)
);

CREATE INDEX idx_feedback_resource ON resource_feedback(resource_id);
CREATE INDEX idx_feedback_status ON resource_feedback(status);

-- ============================================
-- Analytics / Usage Tracking (Privacy-Friendly)
-- ============================================
CREATE TABLE IF NOT EXISTS search_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    search_type TEXT CHECK(search_type IN ('zip', 'category', 'keyword')) NOT NULL,
    search_value TEXT NOT NULL,
    results_count INTEGER,
    session_date DATE NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_date ON search_analytics(session_date, search_type);

-- ============================================
-- Insert Default Categories
-- ============================================
INSERT INTO resource_categories (name, slug, icon, color, description, sort_order) VALUES
    ('Food Assistance', 'food', '🍎', '#10b981', 'Food pantries, meal programs, SNAP assistance', 1),
    ('Utility Assistance', 'utilities', '💡', '#3b82f6', 'Electric, gas, water bill help', 2),
    ('Housing Aid', 'housing', '🏠', '#f59e0b', 'Rent assistance, emergency housing, shelters', 3),
    ('Mental Health', 'mental-health', '💚', '#8b5cf6', 'Crisis counseling, mental health services', 4),
    ('Financial Support', 'financial', '💰', '#ef4444', 'Cash assistance, emergency funds', 5),
    ('Healthcare', 'healthcare', '🏥', '#ec4899', 'Medical care, WIC, health services', 6);

-- Insert subcategories for Food Assistance
INSERT INTO resource_categories (name, slug, parent_category_id, description, sort_order)
SELECT 'Food Pantries', 'food-pantries', id, 'Emergency food assistance', 1
FROM resource_categories WHERE slug = 'food';

INSERT INTO resource_categories (name, slug, parent_category_id, description, sort_order)
SELECT 'Meal Programs', 'meal-programs', id, 'Free or low-cost meals', 2
FROM resource_categories WHERE slug = 'food';

INSERT INTO resource_categories (name, slug, parent_category_id, description, sort_order)
SELECT 'SNAP Assistance', 'snap-assistance', id, 'SNAP application help', 3
FROM resource_categories WHERE slug = 'food';

INSERT INTO resource_categories (name, slug, parent_category_id, description, sort_order)
SELECT 'Mobile Distributions', 'mobile-distributions', id, 'Mobile food distribution events', 4
FROM resource_categories WHERE slug = 'food';

-- Insert subcategories for Utility Assistance
INSERT INTO resource_categories (name, slug, parent_category_id, description, sort_order)
SELECT 'Electric/Gas', 'electric-gas', id, 'Electric and gas bill assistance', 1
FROM resource_categories WHERE slug = 'utilities';

INSERT INTO resource_categories (name, slug, parent_category_id, description, sort_order)
SELECT 'Water', 'water', id, 'Water bill assistance', 2
FROM resource_categories WHERE slug = 'utilities';

-- ============================================
-- Triggers for updated_at timestamps
-- ============================================
CREATE TRIGGER update_resource_categories_timestamp
    AFTER UPDATE ON resource_categories
BEGIN
    UPDATE resource_categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_resources_timestamp
    AFTER UPDATE ON resources
BEGIN
    UPDATE resources SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_zipcodes_timestamp
    AFTER UPDATE ON zipcodes
BEGIN
    UPDATE zipcodes SET updated_at = CURRENT_TIMESTAMP WHERE zip = NEW.zip;
END;

CREATE TRIGGER update_snap_participation_timestamp
    AFTER UPDATE ON snap_participation
BEGIN
    UPDATE snap_participation SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_food_insecurity_timestamp
    AFTER UPDATE ON food_insecurity
BEGIN
    UPDATE food_insecurity SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_crisis_updates_timestamp
    AFTER UPDATE ON crisis_updates
BEGIN
    UPDATE crisis_updates SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
