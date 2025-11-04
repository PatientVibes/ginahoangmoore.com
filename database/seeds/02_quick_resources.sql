-- Quick import of additional high-priority resources
-- Utilities, Housing, Mental Health

-- Spire Energy
INSERT INTO resources (name, category_id, description, website, city, state, services_provided, verified, verified_at, data_source)
VALUES ('Spire Energy - DollarHelp Program', 2, 'Natural gas provider offering flexible payment arrangements and DollarHelp emergency fund.', 'https://www.spireenergy.com', 'Kansas City', 'MO', '["Natural gas assistance", "DollarHelp emergency fund", "Payment plans"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- Missouri LIHEAP
INSERT INTO resources (name, category_id, description, website, state, services_provided, verified, verified_at, data_source)
VALUES ('Missouri LIHEAP', 2, 'State energy assistance providing one-time payments and Emergency Crisis Intervention.', 'https://mydss.mo.gov', 'MO', '["One-time energy payments", "Emergency Crisis Intervention"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- Kansas LIEAP
INSERT INTO resources (name, category_id, description, website, state, services_provided, verified, verified_at, data_source)
VALUES ('Kansas LIEAP', 2, 'State energy assistance providing one-time payments and Emergency Crisis Intervention.', 'https://dcf.ks.gov', 'KS', '["One-time energy payments", "Emergency Crisis Intervention"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- CAAGKC Rental Assistance
INSERT INTO resources (name, category_id, description, website, city, state, county, services_provided, verified, verified_at, data_source)
VALUES ('CAAGKC - Rental Assistance', 3, 'Assistance with past-due rent, first month rent, deposits, and weatherization programs.', 'https://caagkc.org', 'Kansas City', 'MO', 'Jackson, Clay, Platte', '["Past-due rent", "First month rent", "Security deposits", "Weatherization"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- Catholic Charities Rent (MO)
INSERT INTO resources (name, category_id, description, city, state, services_provided, verified, verified_at, data_source)
VALUES ('Catholic Charities KC-St. Joseph - Rent Assistance', 3, 'Rent assistance alongside food and utility aid.', 'Kansas City', 'MO', '["Rent assistance", "Food assistance", "Utility assistance"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- Salvation Army Rent
INSERT INTO resources (name, category_id, description, city, state, services_provided, verified, verified_at, data_source)
VALUES ('Salvation Army - KS & Western MO Rent Help', 3, 'Rent assistance and HeatShare program applicable to rent or utilities.', 'Kansas City', 'MO', '["Rent assistance", "HeatShare program"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- Section 8
INSERT INTO resources (name, category_id, description, city, state, services_provided, availability_notes, verified, verified_at, data_source)
VALUES ('Section 8 / HUD Housing Vouchers', 3, 'Long-term housing voucher programs through local housing authorities.', 'Kansas City', 'MO', '["Section 8 vouchers", "Long-term housing assistance"]', 'Lengthy waitlists - apply early', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- Missouri TANF
INSERT INTO resources (name, category_id, description, website, state, services_provided, availability_notes, verified, verified_at, data_source)
VALUES ('Missouri TANF - Cash Assistance', 5, 'Cash assistance continuing normally. Funded by block grants, unaffected by shutdown.', 'https://mydss.mo.gov', 'MO', '["Cash assistance", "Uninterrupted during shutdown"]', 'Continuing normally', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- ReDiscover
INSERT INTO resources (name, category_id, description, city, state, services_provided, verified, verified_at, data_source)
VALUES ('ReDiscover - Mental Health Services', 4, 'Mental health services and crisis intervention hotlines.', 'Kansas City', 'MO', '["Mental health services", "Crisis intervention", "Hotline support"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- University Health Mental Health
INSERT INTO resources (name, category_id, description, city, state, services_provided, verified, verified_at, data_source)
VALUES ('University Health - Mental Health Services', 4, 'Mental health services and crisis intervention. Formerly Truman Medical.', 'Kansas City', 'MO', '["Mental health services", "Crisis intervention"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- University Health WIC
INSERT INTO resources (name, category_id, description, website, city, state, county, services_provided, verified, verified_at, data_source)
VALUES ('University Health WIC', 6, 'Primary WIC provider with multiple clinic locations in Jackson County/KC Metro.', 'https://uhwic.org', 'Kansas City', 'MO', 'Jackson', '["WIC benefits", "Nutrition education", "Breastfeeding support"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');

-- KC Health Department
INSERT INTO resources (name, category_id, description, website, city, state, services_provided, verified, verified_at, data_source)
VALUES ('KC Health Department - Community Health', 6, 'WIC services and community health resources. Emphasizes calling 988 for crisis support.', 'https://www.kcmo.gov/city-hall/departments/health', 'Kansas City', 'MO', '["WIC services", "Community health assessments", "Crisis referrals"]', 1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md');
