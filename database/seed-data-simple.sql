-- KC Food Security Hub - Initial Seed Data (Simplified)
-- Verified resources for Kansas City metro area
-- Last Updated: November 4, 2025

-- Delete test data
DELETE FROM resources WHERE name = 'Test Resource';

-- United Way 211 (Most important resource)
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, hours_of_operation, services_provided, languages_spoken, verified, data_source)
VALUES ('United Way 211 Kansas City', 1, '24/7 helpline connecting KC residents to food, housing, utilities, mental health, and emergency assistance. Free and confidential.', '211', 'Dial 211', 'https://www.211.org', '24/7', 'Resource referrals for food, housing, utilities, mental health, financial aid, healthcare', 'English, Spanish, 150+ languages', 1, 'unitedway.org');

-- Harvesters
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Harvesters - The Community Food Network', 1, 'Regional food bank serving Kansas City metro area. Operates 900+ pantries and mobile distributions.', '8776539519', '(877) 653-9519', 'https://www.harvesters.org', '3801 Topping Avenue', 'Kansas City', 'MO', '64129', 'Monday-Friday: 8 AM - 4:30 PM', 'Food pantries, Mobile distributions, SNAP outreach, Senior food programs', 1, 'harvesters.org');

-- Missouri SNAP
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, state, hours_of_operation, eligibility_criteria, services_provided, verified, data_source)
VALUES ('Missouri SNAP Application', 9, 'Apply for SNAP benefits (food stamps) in Missouri online or by phone.', '8553734636', '(855) 373-4636', 'https://mydss.mo.gov', 'MO', 'Monday-Friday: 8 AM - 5 PM', 'Missouri residents, income at or below 130% federal poverty level', 'SNAP application, Benefit status, Recertification', 1, 'Missouri DSS');

-- Kansas SNAP
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, state, hours_of_operation, eligibility_criteria, services_provided, verified, data_source)
VALUES ('Kansas SNAP Application', 9, 'Apply for SNAP benefits (food assistance) in Kansas online or by phone.', '8883694777', '(888) 369-4777', 'https://www.dcf.ks.gov', 'KS', 'Monday-Friday: 8 AM - 5 PM', 'Kansas residents, income at or below 130% federal poverty level', 'SNAP application, Benefit status, Recertification', 1, 'Kansas DCF');

-- Community Services League Food Pantry
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, eligibility_criteria, verified, data_source)
VALUES ('Community Services League Food Pantry', 7, 'Full-choice food pantry. No income requirements. Harvesters partner agency.', '8164619023', '(816) 461-9023', 'https://www.cslkc.org', '10901 Blue Ridge Blvd', 'Kansas City', 'MO', '64134', 'Mon/Wed/Fri: 9 AM-12 PM, Tue/Thu: 1-4 PM', 'Emergency food, Personal care items, SNAP help', 'Can visit once per month', 1, 'Harvesters Network');

-- Legal Aid of Western Missouri
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, eligibility_criteria, verified, data_source)
VALUES ('Legal Aid of Western Missouri', 3, 'Free legal assistance for eviction, housing discrimination, and landlord-tenant disputes.', '8164744665', '(816) 474-6750', 'https://www.lawmo.org', '1803 W 10th St', 'Kansas City', 'MO', '64108', 'Mon-Fri: 9 AM-4:30 PM', 'Eviction defense, Housing discrimination, Landlord-tenant disputes', 'Income at or below 125% federal poverty level', 1, 'lawmo.org');

-- reStart Inc
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('reStart Inc.', 3, 'Emergency shelter, transitional housing, and supportive services for homeless individuals and families.', '8164219622', '(816) 421-9622', 'https://www.restartinc.org', '918 E 9th St', 'Kansas City', 'MO', '64106', '24-hour emergency hotline', 'Emergency shelter, Transitional housing, Case management, Job training', 1, 'restartinc.org');

-- LIHEAP Missouri
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, state, hours_of_operation, eligibility_criteria, services_provided, verified, data_source)
VALUES ('LIHEAP - Missouri Energy Assistance', 11, 'Help with heating and cooling bills for low-income Missouri households.', '8553734636', '(855) 373-4636', 'https://dss.mo.gov/fsd/liheap/', 'MO', 'Seasonal (Oct-Apr)', 'Income at or below 135% federal poverty level', 'Heating assistance, Cooling assistance, Energy crisis help', 1, 'Missouri DSS');

-- LIHEAP Kansas
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, state, hours_of_operation, eligibility_criteria, services_provided, verified, data_source)
VALUES ('LIHEAP - Kansas Energy Assistance', 11, 'Help with heating and cooling bills for low-income Kansas households.', '8883694777', '(888) 369-4777', 'https://www.dcf.ks.gov/services/ees/Pages/Energy-Assistance.aspx', 'KS', 'Seasonal (Nov-Mar)', 'Income at or below 130% federal poverty level', 'Heating assistance, Energy crisis help', 1, 'Kansas DCF');

-- 988 Crisis Lifeline
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, hours_of_operation, services_provided, languages_spoken, verified, data_source)
VALUES ('988 Suicide & Crisis Lifeline', 4, 'Free, confidential 24/7 crisis support. Call, text, or chat online.', '988', 'Call or Text 988', 'https://988lifeline.org', '24/7', 'Suicide prevention, Crisis counseling, Mental health support, Referrals', 'English, Spanish, 150+ languages', 1, '988lifeline.org');

-- Swope Health Mental Health
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, eligibility_criteria, verified, data_source)
VALUES ('Swope Health - Mental Health Services', 4, 'Mental health counseling, psychiatry, and therapy on a sliding fee scale.', '8169233800', '(816) 923-3800', 'https://www.swopehealth.org', '3801 Blue Parkway', 'Kansas City', 'MO', '64130', 'Mon-Fri: 8 AM-5 PM', 'Individual counseling, Family therapy, Psychiatry, Substance abuse treatment', 'Sliding fee scale. Accepts Medicaid, Medicare, most insurance.', 1, 'swopehealth.org');

-- ReDiscover
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('ReDiscover Mental Health Crisis Services', 4, '24-hour crisis hotline and walk-in crisis center for mental health emergencies.', '8166333017', '(816) 633-3017', 'https://www.rediscovercenter.org', '900 E 10th St', 'Kansas City', 'MO', '64106', '24/7', 'Crisis assessment, Crisis stabilization, Mobile crisis response, Inpatient referrals', 1, 'rediscovercenter.org');

-- Catholic Charities
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Catholic Charities Food Pantry', 7, 'Emergency food pantry. Harvesters partner agency.', '8166591900', '(816) 659-1900', 'https://www.catholiccharities-kcsj.org', '1112 Broadway', 'Kansas City', 'MO', '64111', 'Mon-Fri: 9 AM-4 PM (call for appointment)', 'Emergency food, Case management, Utility referrals', 1, 'Harvesters Network');

-- Don Bosco Centers
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Don Bosco Centers - Food Pantry', 7, 'Food pantry serving Kansas City, KS families. Harvesters partner agency.', '9132810000', '(913) 281-0000', 'https://donboscocenter.org', '710 N 9th St', 'Kansas City', 'KS', '66101', 'Mon/Wed/Fri: 9 AM-12 PM', 'Emergency food, Youth programs, After-school meals, Summer feeding', 1, 'Harvesters Network');
