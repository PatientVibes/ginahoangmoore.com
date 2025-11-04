-- ============================================
-- Remaining Resources (Batch 3)
-- Additional detailed entries not in previous imports
-- ============================================

-- Salvation Army HeatShare (utility)
INSERT INTO resources (name, category_id, description, city, state, eligibility_criteria, restrictions, services_provided, verified, verified_at, data_source)
VALUES ('Salvation Army - HeatShare Program', 2, 'Last-resort funding source for utility and rent assistance.', 'Kansas City', 'MO', 'Must first demonstrate denial from other primary assistance programs', 'Last resort only - requires proof of denial from other programs', '["Utility assistance", "Rent assistance (can apply to either)"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- CAAGKC Supportive Services (MO American Water)
INSERT INTO resources (name, category_id, description, website, city, state, county, services_provided, restrictions, verified, verified_at, data_source, source_url)
VALUES ('CAAGKC Supportive Services - MO American Water Assistance', 2, 'Utility assistance specifically for Missouri American Water customers in Jackson, Clay, and Platte counties.', 'https://caagkc.org/programs/supportive-services/', 'Kansas City', 'MO', 'Jackson, Clay, Platte', '["Water bill assistance", "Missouri American Water customers only"]', 'Limited to MO American Water customers only', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://caagkc.org/programs/supportive-services/');

-- Independence IShare
INSERT INTO resources (name, category_id, description, city, state, eligibility_criteria, services_provided, verified, verified_at, data_source)
VALUES ('IShare - Independence Utility Assistance', 2, 'One-time utility bill assistance for Independence, Missouri residents.', 'Independence', 'MO', 'Independence, MO residents only', '["One-time utility bill assistance"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- Independence IRAP
INSERT INTO resources (name, category_id, description, city, state, eligibility_criteria, services_provided, verified, verified_at, data_source)
VALUES ('IRAP - Independence Ongoing Utility Support', 2, 'Ongoing utility bill support (half the bill paid) for seniors or disabled Independence residents.', 'Independence', 'MO', 'Independence, MO residents only. Seniors or disabled. Income ≤150% Federal Poverty Level.', '["Ongoing utility assistance (50% of bill)", "For seniors/disabled"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- CAAGKC Rental Assistance (detailed housing version)
INSERT INTO resources (name, category_id, description, website, city, state, county, services_provided, verified, verified_at, data_source, source_url)
VALUES ('CAAGKC - Rental Assistance Programs', 3, 'Offers programs for qualifying Missouri households including assistance with past-due rent, first month rent, and deposits. Also administers weatherization programs (LIWAP).', 'https://caagkc.org', 'Kansas City', 'MO', 'Jackson, Clay, Platte', '["Past-due rent assistance", "First month rent", "Security deposits", "Weatherization (LIWAP)"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://caagkc.org');

-- Cross-Lines Rent Assistance (housing category)
INSERT INTO resources (name, category_id, description, city, state, county, eligibility_criteria, services_provided, verified, verified_at, data_source)
VALUES ('Cross-Lines Community Outreach - Rent Assistance', 3, 'Emergency rent and utility assistance exclusively for Wyandotte County, Kansas residents.', 'Kansas City', 'KS', 'Wyandotte', 'Wyandotte County residents only. Income below 150% Federal Poverty Level. Documented hardship and ID required.', '["Emergency rent assistance", "Utility assistance"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- Catholic Charities KC-St. Joseph Rent Assistance
INSERT INTO resources (name, category_id, description, city, state, services_provided, verified, verified_at, data_source)
VALUES ('Catholic Charities of Kansas City-St. Joseph - Rent Assistance', 3, 'Generalized rent assistance alongside food and utility aid.', 'Kansas City', 'MO', '["Rent assistance", "Food assistance", "Utility assistance"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- Catholic Charities Johnson County (KS)
INSERT INTO resources (name, category_id, description, city, state, county, services_provided, notes, verified, verified_at, data_source, source_url)
VALUES ('Catholic Charities - Johnson County Rent & Utility Assistance', 3, 'Rent, utility, and transportation assistance for Johnson County, Kansas residents. Specific funding award allocated for these services.', 'Johnson County', 'KS', 'Johnson', '["Rent assistance", "Utility assistance", "Transportation assistance"]', 'Johnson County-specific funding allocation', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://www.jocogov.org/best-times/november-december-2025/funding-offers-rent-utility-assistance');

-- Salvation Army Rent Assistance
INSERT INTO resources (name, category_id, description, city, state, services_provided, verified, verified_at, data_source)
VALUES ('Salvation Army - Kansas & Western Missouri Rent Assistance', 3, 'Provides rent assistance and operates programs like HeatShare which can be applied to rent or utility bills.', 'Kansas City', 'MO', '["Rent assistance", "HeatShare program", "Utility assistance"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- Metro Lutheran Ministry Emergency Rental Assistance
INSERT INTO resources (name, category_id, description, website, city, state, services_provided, notes, verified, verified_at, data_source, source_url)
VALUES ('Metro Lutheran Ministry - Emergency Rental Assistance', 3, 'Emergency Rental Assistance Programs (ERAP) administered through Metro Lutheran Ministry. Referrals often managed through United Way 211.', 'https://mlmkc.org', 'Kansas City', 'MO', '["Emergency rent assistance", "Referrals via 211"]', 'Contact United Way 211 for referrals', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://mlmkc.org');

-- Section 8/HUD Housing Vouchers (detailed version)
INSERT INTO resources (name, category_id, description, city, state, services_provided, availability_notes, notes, verified, verified_at, data_source)
VALUES ('Section 8 / HUD Housing Vouchers', 3, 'Long-term housing voucher programs available through local housing authorities. Known to have lengthy waitlists but provides sustained housing stability.', 'Kansas City', 'MO', '["Section 8 vouchers", "Long-term housing assistance", "Rental vouchers"]', 'Lengthy waitlists - apply immediately to establish position in queue', 'Apply early for future stability once immediate crisis subsides', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- Missouri TANF (detailed version)
INSERT INTO resources (name, category_id, description, website, state, services_provided, availability_notes, verified, verified_at, data_source, source_url)
VALUES ('Missouri TANF - Temporary Assistance for Needy Families', 5, 'Cash assistance continuing normally during SNAP crisis. Funded by pre-allocated block grants rather than discretionary appropriations.', 'https://mydss.mo.gov', 'MO', '["Cash assistance", "Uninterrupted during federal shutdown"]', 'Continuing normally - not affected by federal shutdown', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://mydss.mo.gov');

-- University Health WIC (detailed version)
INSERT INTO resources (name, category_id, description, website, city, state, county, services_provided, verified, verified_at, data_source, source_url)
VALUES ('University Health WIC - Multiple Locations', 6, 'Primary WIC provider in Jackson County/KC Metro with multiple clinic locations. Provides healthy food, nutrition education, breastfeeding support, and family resources.', 'https://uhwic.org', 'Kansas City', 'MO', 'Jackson', '["WIC benefits", "Nutrition education", "Breastfeeding support", "Family resources"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://uhwic.org');

-- Kansas City Health Department (detailed version)
INSERT INTO resources (name, category_id, description, website, city, state, services_provided, verified, verified_at, data_source, source_url)
VALUES ('Kansas City Health Department - Community Health Services', 6, 'Provides WIC services and community health resources. Emphasizes residents experiencing anxiety and distress related to food and financial difficulties should call 988.', 'https://www.kcmo.gov/city-hall/departments/health', 'Kansas City', 'MO', '["WIC services", "Community health assessments", "Crisis support referrals"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://www.kcmo.gov/city-hall/departments/health');

-- University Health Mental Health (detailed version)
INSERT INTO resources (name, category_id, description, city, state, services_provided, verified, verified_at, data_source)
VALUES ('University Health - Mental Health & Crisis Services', 4, 'Provides mental health services and crisis intervention through dedicated hotlines. Formerly Truman Medical Centers.', 'Kansas City', 'MO', '["Mental health services", "Crisis intervention", "Hotline support"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- Catholic Charities Counseling
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, city, state, services_provided, verified, verified_at, data_source)
VALUES ('Catholic Charities - Counseling & Mental Health Referrals', 4, 'Trained counselors available to connect callers to appropriate mental health resources.', '9134332100', '(913) 433-2100', 'https://catholiccharitiesks.org', 'Kansas City', 'KS', '["Mental health referrals", "Counseling services", "Resource navigation"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');
