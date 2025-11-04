-- Add library_updates table for tracking KC Library resource changes

CREATE TABLE IF NOT EXISTS library_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,              -- 'street_sheets', 'community_resources', etc.
    url TEXT NOT NULL,                 -- URL checked
    last_checked DATETIME NOT NULL,    -- When we last checked
    content_hash TEXT,                 -- Hash of content for change detection
    pdf_url TEXT,                      -- Latest PDF URL if applicable
    has_changes BOOLEAN DEFAULT 0,     -- Whether changes detected
    notified BOOLEAN DEFAULT 0,        -- Whether admin was notified
    notes TEXT,                        -- Any additional notes
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_library_updates_source
ON library_updates(source, updated_at DESC);

-- Index for checking notification status
CREATE INDEX IF NOT EXISTS idx_library_updates_notified
ON library_updates(notified, has_changes);
