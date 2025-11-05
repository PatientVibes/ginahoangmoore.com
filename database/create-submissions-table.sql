-- ============================================
-- Resource Submissions Table
-- For community-submitted resource updates
-- ============================================

CREATE TABLE IF NOT EXISTS resource_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Basic Information
    name TEXT NOT NULL,
    category_id INTEGER,
    description TEXT,

    -- Contact Information
    phone TEXT,
    email TEXT,
    website TEXT,

    -- Location
    address TEXT,
    city TEXT,
    state TEXT CHECK(state IN ('MO', 'KS')),
    zip TEXT,

    -- Service Details
    hours_of_operation TEXT,
    services_provided TEXT,

    -- Submission Metadata
    data_source TEXT,
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TEXT,
    reviewer_notes TEXT,

    -- Optional: Link to existing resource if this is an update
    related_resource_id INTEGER,

    FOREIGN KEY (category_id) REFERENCES resource_categories(id),
    FOREIGN KEY (related_resource_id) REFERENCES resources(id)
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_submissions_status ON resource_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON resource_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_submissions_category ON resource_submissions(category_id);
CREATE INDEX IF NOT EXISTS idx_submissions_city ON resource_submissions(city);
CREATE INDEX IF NOT EXISTS idx_submissions_state ON resource_submissions(state);
