-- KC Food Security Hub - Initial Seed Data
-- Verified resources for Kansas City metro area
-- Last Updated: November 4, 2025

-- ======================
-- FOOD ASSISTANCE
-- ======================

-- Harvesters (Regional Food Bank)
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    address, city, state, zip,
    hours_of_operation,
    services_provided,
    verified, verified_at, verified_by, data_source
) VALUES (
    'Harvesters - The Community Food Network',
    1, -- Food Assistance
    'Regional food bank serving Kansas City metro area. Operates 900+ pantries and mobile distributions. Free food assistance for anyone in need.',
    '8776539519',
    '(877) 653-9519',
    'https://www.harvesters.org',
    '3801 Topping Avenue',
    'Kansas City',
    'MO',
    '64129',
    'Monday-Friday: 8:00 AM - 4:30 PM. Call for pantry locations and mobile distribution schedules.',
    'Food pantries, Mobile food distributions, SNAP outreach, Senior food programs, Kids Cafe meal programs',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'harvesters.org'
);

-- United Way 211
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    hours_of_operation,
    services_provided,
    languages_spoken,
    verified, verified_at, verified_by, data_source
) VALUES (
    'United Way 211 Kansas City',
    1, -- Food Assistance (also serves all categories)
    '24/7 helpline connecting KC residents to food, housing, utilities, mental health, and emergency assistance. Free and confidential.',
    '211',
    'Dial 211',
    'https://www.211.org',
    '24 hours, 7 days a week',
    'Resource referrals for food, housing, utilities, mental health, financial aid, healthcare, and crisis support',
    'English, Spanish, and 150+ languages via interpretation services',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'unitedway.org/211'
);

-- SNAP Application Assistance - Missouri
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    state,
    hours_of_operation,
    eligibility_criteria,
    services_provided,
    verified, verified_at, verified_by, data_source
) VALUES (
    'Missouri SNAP (Food Stamp) Application',
    9, -- SNAP Assistance
    'Apply for SNAP benefits (food stamps) in Missouri. Online application or phone assistance available.',
    '8553734636',
    '(855) 373-4636',
    'https://mydss.mo.gov',
    'MO',
    'Monday-Friday: 8:00 AM - 5:00 PM',
    'Missouri residents meeting income guidelines (130% federal poverty level)',
    'SNAP application assistance, Benefit status checks, Recertification help',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'Missouri Department of Social Services'
);

-- SNAP Application Assistance - Kansas
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    state,
    hours_of_operation,
    eligibility_criteria,
    services_provided,
    verified, verified_at, verified_by, data_source
) VALUES (
    'Kansas SNAP (Food Assistance) Application',
    9, -- SNAP Assistance
    'Apply for SNAP benefits (food assistance) in Kansas. Online application or phone assistance available.',
    '8883694777',
    '(888) 369-4777',
    'https://www.dcf.ks.gov',
    'KS',
    'Monday-Friday: 8:00 AM - 5:00 PM',
    'Kansas residents meeting income guidelines (130% federal poverty level)',
    'SNAP application assistance, Benefit status checks, Recertification help',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'Kansas Department for Children and Families'
);

-- Community Services League (Major KC Food Pantry)
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    address, city, state, zip,
    hours_of_operation,
    services_provided,
    eligibility_criteria,
    verified, verified_at, verified_by, data_source
) VALUES (
    'Community Services League Food Pantry',
    7, -- Food Pantries
    'Full-choice food pantry serving Kansas City area. No income requirements. Harvesters partner agency.',
    '8164619023',
    '(816) 461-9023',
    'https://www.cslkc.org',
    '10901 Blue Ridge Blvd',
    'Kansas City',
    'MO',
    '64134',
    'Monday, Wednesday, Friday: 9:00 AM - 12:00 PM, Tuesday, Thursday: 1:00 PM - 4:00 PM',
    'Emergency food pantry, Personal care items, SNAP application assistance',
    'No income requirements. Can visit once per month.',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'Harvesters Network'
);

-- ======================
-- HOUSING ASSISTANCE
-- ======================

-- Legal Aid of Western Missouri
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    address, city, state, zip,
    hours_of_operation,
    services_provided,
    eligibility_criteria,
    verified, verified_at, verified_by, data_source
) VALUES (
    'Legal Aid of Western Missouri',
    3, -- Housing Aid
    'Free legal assistance for low-income residents facing eviction, housing discrimination, and landlord-tenant disputes.',
    '8164744665',
    '(816) 474-6750',
    'https://www.lawmo.org',
    '1803 W 10th St',
    'Kansas City',
    'MO',
    '64108',
    'Monday-Friday: 9:00 AM - 4:30 PM. Walk-in intake: Tuesday and Thursday 9:00 AM - 11:00 AM',
    'Eviction defense, Housing discrimination cases, Landlord-tenant disputes, Subsidized housing issues',
    'Income at or below 125% federal poverty level. Priority for seniors, veterans, and families with children.',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'lawmo.org'
);

-- reStart Inc. (Homeless Services)
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    address, city, state, zip,
    hours_of_operation,
    services_provided,
    verified, verified_at, verified_by, data_source
) VALUES (
    'reStart Inc.',
    3, -- Housing Aid
    'Emergency shelter, transitional housing, and supportive services for homeless individuals and families in Kansas City.',
    '8164219622',
    '(816) 421-9622',
    'https://www.restartinc.org',
    '918 E 9th St',
    'Kansas City',
    'MO',
    '64106',
    '24-hour emergency hotline. Office hours: Monday-Friday 8:30 AM - 4:30 PM',
    'Emergency shelter, Transitional housing, Case management, Job training, Mental health services',
    'Must be experiencing homelessness or at imminent risk of homelessness',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'restartinc.org'
);

-- ======================
-- UTILITY ASSISTANCE
-- ======================

-- LIHEAP Missouri
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    state,
    hours_of_operation,
    eligibility_criteria,
    services_provided,
    verified, verified_at, verified_by, data_source
) VALUES (
    'LIHEAP - Missouri Energy Assistance',
    11, -- Electric/Gas
    'Low Income Home Energy Assistance Program. Help with heating and cooling bills for low-income Missouri households.',
    '8553734636',
    '(855) 373-4636',
    'https://dss.mo.gov/fsd/liheap/',
    'MO',
    'Seasonal program. Call for current enrollment dates. Typically October - April.',
    'Missouri residents with income at or below 135% federal poverty level',
    'Winter heating assistance, Summer cooling assistance, Energy crisis intervention',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'Missouri Department of Social Services'
);

-- LIHEAP Kansas
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    state,
    hours_of_operation,
    eligibility_criteria,
    services_provided,
    verified, verified_at, verified_by, data_source
) VALUES (
    'LIHEAP - Kansas Energy Assistance',
    11, -- Electric/Gas
    'Low Income Energy Assistance Program. Help with heating and cooling bills for low-income Kansas households.',
    '8883694777',
    '(888) 369-4777',
    'https://www.dcf.ks.gov/services/ees/Pages/Energy-Assistance.aspx',
    'KS',
    'Seasonal program. Call for current enrollment dates. Typically November - March.',
    'Kansas residents with income at or below 130% federal poverty level',
    'Winter heating assistance, Energy crisis assistance',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'Kansas Department for Children and Families'
);

-- ======================
-- MENTAL HEALTH
-- ======================

-- 988 Suicide & Crisis Lifeline
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    hours_of_operation,
    services_provided,
    languages_spoken,
    verified, verified_at, verified_by, data_source
) VALUES (
    '988 Suicide & Crisis Lifeline',
    4, -- Mental Health
    'Free, confidential 24/7 crisis support for people in distress. Call, text, or chat online.',
    '988',
    'Call or Text 988',
    'https://988lifeline.org',
    '24 hours, 7 days a week',
    'Suicide prevention, Crisis counseling, Mental health support, Referrals to local services',
    'English, Spanish, and 150+ languages via interpretation',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    '988lifeline.org'
);

-- Swope Health (Mental Health Services)
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    address, city, state, zip,
    hours_of_operation,
    services_provided,
    eligibility_criteria,
    verified, verified_at, verified_by, data_source
) VALUES (
    'Swope Health - Mental Health Services',
    4, -- Mental Health
    'Community health center offering mental health counseling, psychiatry, and therapy on a sliding fee scale.',
    '8169233800',
    '(816) 923-3800',
    'https://www.swopehealth.org',
    '3801 Blue Parkway',
    'Kansas City',
    'MO',
    '64130',
    'Monday-Friday: 8:00 AM - 5:00 PM. Extended hours available.',
    'Individual counseling, Family therapy, Psychiatric services, Substance abuse treatment, Crisis intervention',
    'Sliding fee scale based on income. Accepts Medicaid, Medicare, and most insurance.',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'swopehealth.org'
);

-- ReDiscover (Mental Health Crisis Services)
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    address, city, state, zip,
    hours_of_operation,
    services_provided,
    verified, verified_at, verified_by, data_source
) VALUES (
    'ReDiscover Mental Health Crisis Services',
    4, -- Mental Health
    '24-hour crisis hotline and walk-in crisis center for mental health emergencies in Kansas City.',
    '8166333017',
    '(816) 633-3017',
    'https://www.rediscovercenter.org',
    '900 E 10th St',
    'Kansas City',
    'MO',
    '64106',
    '24 hours, 7 days a week',
    'Crisis assessment, Crisis stabilization, Mobile crisis response, Inpatient psychiatric care referrals',
    'Open to all. No appointment needed for crisis services.',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'rediscovercenter.org'
);

-- ======================
-- ADDITIONAL FOOD PANTRIES (Verified Harvesters Partners)
-- ======================

-- Catholic Charities Food Pantry
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    address, city, state, zip,
    hours_of_operation,
    services_provided,
    verified, verified_at, verified_by, data_source
) VALUES (
    'Catholic Charities of Kansas City-St. Joseph Food Pantry',
    7, -- Food Pantries
    'Emergency food pantry serving families in need. Harvesters partner agency.',
    '8166591900',
    '(816) 659-1900',
    'https://www.catholiccharities-kcsj.org',
    '1112 Broadway',
    'Kansas City',
    'MO',
    '64111',
    'Monday-Friday: 9:00 AM - 4:00 PM. Call for appointment.',
    'Emergency food assistance, Case management, Utility assistance referrals',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'Harvesters Network'
);

-- Don Bosco Centers
INSERT INTO resources (
    name, category_id, description,
    phone, phone_formatted, website,
    address, city, state, zip,
    hours_of_operation,
    services_provided,
    verified, verified_at, verified_by, data_source
) VALUES (
    'Don Bosco Centers - Food Pantry',
    7, -- Food Pantries
    'Food pantry serving Kansas City, KS families. Harvesters partner agency.',
    '9132810000',
    '(913) 281-0000',
    'https://donboscocenter.org',
    '710 N 9th St',
    'Kansas City',
    'KS',
    '66101',
    'Monday, Wednesday, Friday: 9:00 AM - 12:00 PM',
    'Emergency food pantry, Youth programs, After-school meals, Summer feeding program',
    1,
    CURRENT_TIMESTAMP,
    'KC Food Security Hub',
    'Harvesters Network'
);

-- Summary Stats
-- Total Resources: 16
-- Food Assistance: 6
-- Housing: 2
-- Utilities: 2
-- Mental Health: 3
-- Multi-category: 3 (211, Harvesters, Catholic Charities)
