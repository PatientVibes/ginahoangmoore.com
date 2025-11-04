-- ============================================
-- Verified Resources from KC SNAP Crisis Guide
-- Source: KC SNAP Benefit Assistance Planning - REVISED.md
-- ============================================

-- ============================================
-- Food Assistance Resources
-- ============================================

-- Harvesters Community Food Network
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    address, city, state, zip, county,
    hours_of_operation, services_provided,
    verified, verified_at, data_source, source_url
) VALUES (
    'Harvesters Community Food Network - Customer Care',
    1, -- Food Assistance
    'Central food bank serving 27 counties across Missouri and Kansas, channeling aid through more than 900 partner pantries, shelters, and kitchens. Provides pantry locator service.',
    '8776539519',
    '(877) 653-9519',
    'https://www.harvesters.org',
    NULL, 'Kansas City', 'MO', NULL, 'Regional',
    '{"note": "Call for assistance and pantry locations"}',
    '["Food bank network", "Pantry locator", "Mobile distributions"]',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://www.harvesters.org'
);

-- Harvesters SNAP Helpline
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    services_provided,
    verified, verified_at, data_source
) VALUES (
    'Harvesters - SNAP Application Assistance',
    1, -- Food Assistance
    'SNAP helpline to assist with new SNAP applications.',
    '8776539522',
    '(877) 653-9522',
    'https://www.harvesters.org/get-food-assistance/snap-assistance',
    '["SNAP application help", "Benefit guidance"]',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md'
);

-- CAAGKC Food & Toiletry Pantries
INSERT INTO resources (
    name, category_id, description,
    website,
    city, state, county,
    services_provided,
    verified, verified_at, data_source, source_url
) VALUES (
    'Community Action Agency of Greater Kansas City (CAAGKC) - Food & Toiletry Pantries',
    1, -- Food Assistance
    'Network of 30 pantries concentrated in Jackson, Clay, and Platte counties in Missouri, providing food and hygiene items.',
    'https://caagkc.org/programs/food-toiletry-pantries/',
    'Kansas City', 'MO', 'Jackson, Clay, Platte',
    '["Food pantries", "Toiletry distribution"]',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://caagkc.org/programs/food-toiletry-pantries/'
);

-- Catholic Charities of NE Kansas
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    city, state, county,
    services_provided,
    verified, verified_at, data_source, source_url
) VALUES (
    'Catholic Charities of Northeast Kansas',
    1, -- Food Assistance
    '8 food pantries across 21-county service area. Served 74,000+ people last fiscal year. During crisis, offering additional visit to pantries (traditionally once every 30 days).',
    '9134332100',
    '(913) 433-2100',
    'https://catholiccharitiesks.org',
    'Kansas City', 'KS', 'Wyandotte',
    '["Food pantries", "SNAP assistance", "WIC assistance"]',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://catholiccharitiesks.org'
);

-- Johnson County Human Services
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    city, state, zip, county,
    hours_of_operation,
    eligibility_criteria,
    services_provided,
    verified, verified_at, data_source, source_url
) VALUES (
    'Johnson County Human Services - Food Pantries',
    1, -- Food Assistance
    '3 food pantries in Gardner, Lenexa, and Mission. By appointment only. Provides supplemental food and hygiene products.',
    '9137156653',
    '(913) 715-6653',
    'https://www.jocogov.org/department/aging-and-human-services/human-services/food-pantry',
    'Johnson County', 'KS', NULL, 'Johnson',
    '{"phone_hours": "Monday-Friday 8:30 AM-4:30 PM"}',
    'Johnson County resident, at or below 200% of federal poverty guidelines, provide income verification from previous 30 days, photo IDs for members 18+, Social Security numbers for all household members',
    '["Food pantries", "Hygiene products", "SNAP application assistance"]',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://www.jocogov.org/department/aging-and-human-services/human-services/food-pantry'
);

-- Metro Lutheran Ministry - Central Food Pantry
INSERT INTO resources (
    name, category_id, description,
    phone, website,
    address, city, state, zip, county,
    hours_of_operation,
    eligibility_criteria,
    restrictions,
    verified, verified_at, data_source, source_url
) VALUES (
    'Metro Lutheran Ministry - Central Food Pantry',
    1, -- Food Assistance
    'Emergency food assistance. Limited capacity: serves first 30 guests daily.',
    NULL,
    'https://mlmkc.org/program/food-pantry/',
    'Kansas City (Central)', 'Kansas City', 'MO', '64108-64114', 'Jackson',
    '{"monday": "8:30 AM-11:00 AM", "tuesday": "8:30 AM-11:00 AM", "wednesday": "8:30 AM-11:00 AM", "thursday": "8:30 AM-11:00 AM", "friday": "8:30 AM-11:00 AM"}',
    'Jackson County residents within ZIP codes 64108-64114',
    'First 30 guests served daily. One visit per month allowed.',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://mlmkc.org/program/food-pantry/'
);

-- Metro Lutheran Ministry - Wyandotte Food Pantry
INSERT INTO resources (
    name, category_id, description,
    website,
    city, state, county,
    hours_of_operation,
    eligibility_criteria,
    restrictions,
    verified, verified_at, data_source, source_url
) VALUES (
    'Metro Lutheran Ministry - Wyandotte Food Pantry',
    1, -- Food Assistance
    'Emergency food assistance. Limited capacity: serves first 30 guests daily.',
    'https://mlmkc.org/program/food-pantry/',
    'Kansas City', 'KS', 'Wyandotte',
    '{"monday": "8:30 AM-11:00 AM", "tuesday": "8:30 AM-11:00 AM", "wednesday": "8:30 AM-11:00 AM", "thursday": "8:30 AM-11:00 AM", "friday": "8:30 AM-11:00 AM"}',
    'Wyandotte County residents only',
    'First 30 guests served daily. One visit per month allowed.',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://mlmkc.org/program/food-pantry/'
);

-- Thelma's Kitchen
INSERT INTO resources (
    name, category_id, description,
    address, city, state, zip,
    hours_of_operation,
    services_provided,
    verified, verified_at, data_source
) VALUES (
    'Thelma''s Kitchen',
    1, -- Food Assistance
    'Pay-what-you-can community café. Meals range from $1-$15. Pay-it-forward program ensures no one is turned away.',
    '3101 Troost Ave', 'Kansas City', 'MO', '64109',
    '{"monday": "11:00 AM-2:00 PM", "tuesday": "11:00 AM-2:00 PM", "wednesday": "11:00 AM-2:00 PM", "thursday": "11:00 AM-2:00 PM", "friday": "11:00 AM-2:00 PM"}',
    '["Pay-what-you-can meals", "Community café"]',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md'
);

-- NourishKC
INSERT INTO resources (
    name, category_id, description,
    address, city, state, zip,
    hours_of_operation,
    services_provided,
    verified, verified_at, data_source
) VALUES (
    'NourishKC',
    1, -- Food Assistance
    'Free meals served every weekday. Serves unhoused population and anyone needing a meal.',
    '750 Paseo', 'Kansas City', 'MO', '64106',
    '{"monday": "11:00 AM-2:00 PM", "tuesday": "11:00 AM-2:00 PM", "wednesday": "11:00 AM-2:00 PM", "thursday": "11:00 AM-2:00 PM", "friday": "11:00 AM-2:00 PM"}',
    '["Free meals", "Homeless services"]',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md'
);

-- Kansas City Public Schools
INSERT INTO resources (
    name, category_id, description,
    website,
    city, state,
    services_provided,
    eligibility_criteria,
    verified, verified_at, data_source, source_url
) VALUES (
    'Kansas City Public Schools - Free Meals',
    1, -- Food Assistance
    'Free breakfast and lunch for all enrolled students. No application or income qualification needed due to community eligibility in National School Lunch Program.',
    'https://www.kcpublicschools.org/families/child-nutrition',
    'Kansas City', 'MO',
    '["Free school breakfast", "Free school lunch"]',
    'All enrolled KCPS students',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://www.kcpublicschools.org/families/child-nutrition'
);

-- Kansas City, Kansas Public Schools
INSERT INTO resources (
    name, category_id, description,
    website,
    city, state,
    services_provided,
    eligibility_criteria,
    verified, verified_at, data_source, source_url
) VALUES (
    'Kansas City, Kansas Public Schools - Free Meals',
    1, -- Food Assistance
    'Free breakfast and lunch for all enrolled students. No application required.',
    'https://www.kckschools.org/operations/nutritional-services',
    'Kansas City', 'KS',
    '["Free school breakfast", "Free school lunch"]',
    'All enrolled KCKPS students',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://www.kckschools.org/operations/nutritional-services'
);

-- ============================================
-- WIC Clinics
-- ============================================

-- Wyandotte County WIC
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    address, city, state, zip, county,
    hours_of_operation,
    services_provided,
    verified, verified_at, data_source, source_url
) VALUES (
    'Wyandotte County WIC',
    6, -- Healthcare
    'WIC clinic providing nutrition counseling, breastfeeding support, and vouchers for nutritious food.',
    '9135736720',
    '(913) 573-6720',
    'https://www.wycokck.org/Departments/Health/Health-Wellness-Services/Clinical-Services/WIC',
    '619 Ann Avenue', 'Kansas City', 'KS', '66101', 'Wyandotte',
    '{"monday": "8:30 AM-5:00 PM", "tuesday": "10:00 AM-5:00 PM", "wednesday": "8:30 AM-5:00 PM", "thursday": "8:30 AM-6:00 PM", "friday": "8:30 AM-5:00 PM"}',
    '["WIC benefits", "Nutrition counseling", "Breastfeeding support"]',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://www.wycokck.org/Departments/Health/Health-Wellness-Services/Clinical-Services/WIC'
);

-- ============================================
-- Utility Assistance Resources
-- ============================================

-- Community Assistance Council (CAC)
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted,
    city, state,
    hours_of_operation,
    eligibility_criteria,
    restrictions,
    services_provided,
    verified, verified_at, data_source
) VALUES (
    'Community Assistance Council (CAC)',
    2, -- Utility Assistance
    'Provides up to $500 per household for utility customers (Evergy, Spire, or KC Water) who possess a shut-off notice and meet income requirements.',
    '8167633277',
    '(816) 763-3277',
    'Kansas City', 'MO',
    '{"phone_hours": "Monday-Friday 8:00 AM-10:00 AM only"}',
    'Limited income, active shut-off notice required',
    'Very limited phone hours: Monday-Friday 8:00-10:00 AM only',
    '["Utility bill assistance", "Rent assistance", "Up to $500 per household"]',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md'
);

-- United Way Critical Medical Needs Program
INSERT INTO resources (
    name, category_id, description,
    city, state,
    eligibility_criteria,
    services_provided,
    verified, verified_at, data_source, source_url
) VALUES (
    'United Way Critical Medical Needs Program',
    2, -- Utility Assistance
    'Assists with utility bills from Evergy, Spire, Ameren, and Missouri American Water when a household member has a critical health condition. Uses healthcare provider verification.',
    'Kansas City', 'MO',
    'Missouri residents only. Must have critical medical need in household. Referral through healthcare providers.',
    '["Utility bill assistance for medical needs", "Evergy", "Spire", "Ameren", "Missouri American Water"]',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://unitedwaygkc.org/united-way-critical-medical-needs-program/'
);

-- KC Water Payment Assistance
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    city, state,
    services_provided,
    verified, verified_at, data_source, source_url
) VALUES (
    'KC Water Payment Assistance',
    2, -- Utility Assistance
    'Financial assistance resources for water bills. Call 311 or apply through United Way 211.',
    '311',
    '311 (in Kansas City)',
    'https://www.kcwater.us/customer-support/financial-assistance-resources/',
    'Kansas City', 'MO',
    '["Water bill assistance"]',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://www.kcwater.us/customer-support/financial-assistance-resources/'
);

-- Cross-Lines Community Outreach
INSERT INTO resources (
    name, category_id, description,
    city, state, county,
    eligibility_criteria,
    services_provided,
    verified, verified_at, data_source
) VALUES (
    'Cross-Lines Community Outreach',
    2, -- Utility Assistance (also housing)
    'Emergency rent and utility assistance exclusively for Wyandotte County, Kansas residents.',
    'Kansas City', 'KS', 'Wyandotte',
    'Wyandotte County residents only. Income below 150% of Federal Poverty Level. Documented hardship and ID required.',
    '["Emergency rent assistance", "Utility assistance"]',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md'
);

-- ============================================
-- Mental Health & Crisis Support
-- ============================================

-- 988 Suicide & Crisis Lifeline
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted,
    services_provided,
    availability_notes,
    verified, verified_at, data_source
) VALUES (
    '988 Suicide & Crisis Lifeline',
    4, -- Mental Health
    'Free, 24/7 mental health crisis counseling. Kansas City Health Department emphasizes residents experiencing anxiety and distress related to food and financial difficulties should call 988.',
    '988',
    '988',
    '["24/7 crisis counseling", "Mental health support", "Financial stress support"]',
    'Available 24 hours a day, 7 days a week',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md'
);

-- United Way 211
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    services_provided,
    availability_notes,
    verified, verified_at, data_source, source_url
) VALUES (
    'United Way 211',
    4, -- Mental Health (also general referral)
    'Centralized navigation for food, utility, housing, and mental health referrals. Trained counselors connect callers to appropriate resources.',
    '211',
    '211',
    'https://unitedwaygkc.org/211-2/',
    '["Resource referrals", "Food assistance", "Utility help", "Housing assistance", "Mental health resources"]',
    'Available 24/7',
    1, CURRENT_TIMESTAMP, 'KC SNAP REVISED.md', 'https://unitedwaygkc.org/211-2/'
);

-- ============================================
-- Current Crisis Update
-- ============================================
INSERT INTO crisis_updates (
    title, summary, impact, severity, active,
    start_date, content_html, source, source_url
) VALUES (
    'SNAP Benefit Alert: November 2025',
    'November 2025 benefits delayed due to federal shutdown.',
    '150,000 recipients in United Way of Greater Kansas City service area affected. Retroactive benefits expected once federal funding restored, though timelines and amounts may vary.',
    'critical',
    1,
    '2025-11-01',
    '<p>The Kansas City metropolitan area is facing a critical human service challenge following the federal government shutdown, which has resulted in the suspension of Supplemental Nutrition Assistance Program (SNAP) benefit issuance for November 2025.</p><p><strong>What You Need to Know:</strong></p><ul><li>November SNAP benefits suspended after November 1st</li><li>Retroactive benefits expected but timelines uncertain</li><li>Existing EBT balances remain safe and usable</li><li>TANF cash assistance and WIC continue normally</li></ul>',
    'KC SNAP REVISED.md',
    'https://ginahoangmoore.com'
);
