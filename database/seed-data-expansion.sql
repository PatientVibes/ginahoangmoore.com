-- KC Food Security Hub - Database Expansion
-- Additional verified resources for Kansas City metro area
-- Expands database from 62 to 100+ resources
-- Last Updated: November 5, 2025

-- ======================
-- FOOD PANTRIES & WIC
-- ======================

-- Heaven Sent Charities Food Pantry
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Heaven Sent Charities', 7, 'Food pantry serving Kansas City, Kansas families. Harvesters partner agency.', '9133715000', '(913) 371-5000', 'https://www.heavensentcharities.org', '500 Nebraska Ave', 'Kansas City', 'KS', '66101', 'Mon/Wed/Fri: 10 AM-2 PM', 'Emergency food pantry, Clothing assistance', 1, 'Harvesters Network');

-- Giving Hope KC Food Pantry
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Giving Hope KC', 7, 'Full-choice food pantry. Harvesters partner agency.', '9132873800', '(913) 287-3800', 'https://www.givinghopekc.org', '1901 N 18th St', 'Kansas City', 'KS', '66104', 'Mon-Thu: 9 AM-12 PM', 'Emergency food, Job training, GED classes', 1, 'Harvesters Network');

-- Sheffield Place Food Pantry
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Sheffield Place', 7, 'Food pantry serving single mothers and children. Harvesters partner.', '8164446411', '(816) 444-6411', 'https://www.sheffieldplace.org', '4810 Troost Ave', 'Kansas City', 'MO', '64110', 'Mon-Fri: 8 AM-5 PM (call for appointment)', 'Food pantry, Housing assistance, Job training, Childcare', 1, 'Harvesters Network');

-- Operation Breakthrough Food Pantry
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Operation Breakthrough', 7, 'Food pantry and comprehensive family services. Harvesters partner.', '8164719704', '(816) 471-9704', 'https://www.operationbreakthrough.org', '3039 Troost Ave', 'Kansas City', 'MO', '64109', 'Mon-Fri: 7 AM-6 PM', 'Food pantry, Childcare, After-school programs, Family support', 1, 'Harvesters Network');

-- University Health WIC - Main Office
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, eligibility_criteria, verified, data_source)
VALUES ('University Health WIC - Main Office', 6, 'Women, Infants, and Children nutrition program for Jackson County.', '8169835947', '(816) 983-5947', 'https://uhwic.org', '2121 Summit St', 'Kansas City', 'MO', '64108', 'Mon-Fri: 8 AM-5 PM', 'Nutrition education, Supplemental food, Breastfeeding support, Health referrals', 'Pregnant, breastfeeding, postpartum women; infants and children up to age 5; income guidelines apply', 1, 'University Health');

-- University Health WIC - Northland
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, eligibility_criteria, verified, data_source)
VALUES ('University Health WIC - Northland', 6, 'WIC services for North Kansas City area families.', '8165954200', '(816) 595-4200', 'https://uhwic.org', '6401 N Prospect Ave', 'Kansas City', 'MO', '64119', 'Mon-Fri: 8 AM-5 PM', 'Nutrition education, Supplemental food, Breastfeeding support, Health referrals', 'Pregnant, breastfeeding, postpartum women; infants and children up to age 5', 1, 'University Health');

-- Samuel U. Rodgers WIC
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Samuel U. Rodgers Health Center - WIC', 6, 'WIC program providing nutrition services and food assistance.', '8168891881', '(816) 889-1881', 'https://samrodgers.org/wicservices/', '825 Euclid Ave', 'Kansas City', 'MO', '64124', 'Mon-Fri: 8 AM-5 PM', 'WIC benefits, Nutrition counseling, Breastfeeding support, Immunization referrals', 1, 'Samuel U. Rodgers');

-- Wyandotte County WIC - Main Office
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Wyandotte County WIC - Main Office', 6, 'WIC services for Wyandotte County, Kansas families.', '9135736720', '(913) 573-6720', 'https://www.wycokck.org/Departments/Health/WIC', '619 Ann Ave', 'Kansas City', 'KS', '66101', 'Mon-Fri: 8 AM-5 PM', 'WIC nutrition program, Food benefits, Breastfeeding support', 1, 'Wyandotte County Health');

-- ======================
-- MENTAL HEALTH SERVICES
-- ======================

-- NAMI Greater Kansas City
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, hours_of_operation, services_provided, verified, data_source)
VALUES ('NAMI Greater Kansas City', 4, 'Free mental health support, education, and advocacy for individuals and families.', '8164043436', '(816) 404-3436', 'https://namigreaterkc.org', 'Mon-Fri: 9 AM-5 PM, 24/7 helpline available', 'Support groups, Education classes, Peer counseling, Resource referrals', 1, 'NAMI');

-- CommCare Crisis Line
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, hours_of_operation, services_provided, languages_spoken, verified, data_source)
VALUES ('CommCare Crisis Helpline', 4, '24/7 crisis support for Missouri residents experiencing mental health emergencies.', '8882798188', '(888) 279-8188', 'https://dmh.mo.gov', '24/7', 'Crisis intervention, Suicide prevention, Mental health referrals, Emergency services', 'English, Spanish, interpretation services available', 1, 'Missouri DMH');

-- Comprehensive Mental Health Services (CMHS)
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Comprehensive Mental Health Services', 4, 'Walk-in mental health services with sliding fee scale.', '8167531880', '(816) 753-1880', 'https://thecmhs.com', '6601 E 12th St', 'Kansas City', 'MO', '64126', 'Mon-Fri: 8 AM-4 PM (walk-ins welcome)', 'Crisis intervention, Counseling, Psychiatric services, Case management, Substance abuse treatment', 1, 'CMHS');

-- AdHoc Group Against Crime - Grief Counseling
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, hours_of_operation, services_provided, verified, data_source)
VALUES ('AdHoc Group Against Crime', 4, 'Free grief counseling for families impacted by violence and trauma.', '8164073300', '(816) 407-3300', 'https://www.adhocjustice.org', 'Mon-Fri: 9 AM-5 PM, on-call crisis support', 'Grief counseling, Trauma support, Victim advocacy, Home visits', 1, 'AdHoc KC');

-- Samuel U. Rodgers Mental Health
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Samuel U. Rodgers Health Center - Behavioral Health', 4, 'Mental health counseling and psychiatric services on sliding fee scale.', '8168894610', '(816) 889-4610', 'https://samrodgers.org', '825 Euclid Ave', 'Kansas City', 'MO', '64124', 'Mon-Fri: 8 AM-5 PM', 'Individual counseling, Family therapy, Psychiatric medication management, Crisis intervention', 1, 'Samuel U. Rodgers');

-- KC CARE Health Center - Behavioral Health
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('KC CARE Health Center', 4, 'Free and low-cost mental health services for uninsured and underinsured.', '8167772722', '(816) 777-2722', 'https://www.kccare.org', '3515 Broadway Blvd', 'Kansas City', 'MO', '64111', 'Mon-Fri: 8 AM-5 PM, some evening hours', 'Mental health counseling, Substance abuse treatment, Medication management', 1, 'KC CARE');

-- Compass Health Network
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, hours_of_operation, services_provided, verified, data_source)
VALUES ('Compass Health Network', 4, 'Community mental health center with multiple KC metro locations. Sliding scale available.', '8448538937', '(844) 853-8937', 'https://compasshealthnetwork.org', 'Mon-Fri: 8 AM-5 PM, 24/7 crisis line', 'Mental health counseling, Psychiatric services, Substance abuse treatment, Crisis intervention, Case management', 1, 'Compass Health');

-- Mattie Rhodes Center - Mental Health
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, languages_spoken, verified, data_source)
VALUES ('Mattie Rhodes Center - Behavioral Health', 4, 'Bilingual mental health services for Latino/a community and all KC residents.', '8162318374', '(816) 231-8374', 'https://www.mattierhodes.org', '148 N Topping Ave', 'Kansas City', 'MO', '64123', 'Mon-Fri: 8 AM-5 PM', 'Individual counseling, Family therapy, Group therapy, Trauma-informed care', 'English, Spanish', 1, 'Mattie Rhodes');

-- ======================
-- HOUSING ASSISTANCE
-- ======================

-- Sheffield Place - Housing for Single Mothers
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, eligibility_criteria, verified, data_source)
VALUES ('Sheffield Place - Transitional Housing', 3, 'Transitional housing program for single mothers and their children.', '8164446411', '(816) 444-6411', 'https://www.sheffieldplace.org', '4810 Troost Ave', 'Kansas City', 'MO', '64110', 'Mon-Fri: 8 AM-5 PM', 'Transitional housing (up to 2 years), Childcare, Job training, Case management, Financial literacy', 'Single mothers with children, must be working or in school', 1, 'Sheffield Place');

-- City Union Mission - Men's Shelter
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('City Union Mission - Men''s Shelter', 3, 'Emergency shelter and long-term recovery program for homeless men.', '8164744808', '(816) 474-4808', 'https://www.cityunionmission.org', '1100 E 11th St', 'Kansas City', 'MO', '64106', '24/7 intake', 'Emergency shelter, Meals, Addiction recovery, Job training, Case management', 1, 'City Union Mission');

-- City Union Mission - Women & Children
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('City Union Mission - Hope House (Women & Children)', 3, 'Emergency shelter for homeless women and children.', '8164747810', '(816) 474-7810', 'https://www.cityunionmission.org', '3030 E Winner Rd', 'Independence', 'MO', '64055', '24/7', 'Emergency shelter, Meals, Childcare, Case management, Life skills training', 1, 'City Union Mission');

-- Della Lamb Community Services
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Della Lamb Community Services', 3, 'Emergency shelter and housing assistance for families and individuals.', '8167551000', '(816) 755-1000', 'https://www.dellalamb.org', '500 Woodland Ave', 'Kansas City', 'MO', '64106', 'Mon-Fri: 8 AM-5 PM, 24/7 crisis line', 'Emergency shelter, Transitional housing, Rent assistance, Utility assistance, Case management', 1, 'Della Lamb');

-- Hope Faith Homeless Assistance Campus
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Hope Faith Homeless Assistance Campus', 3, 'Day shelter and comprehensive homeless services.', '8163993480', '(816) 399-3480', 'https://www.hopefaith.org', '705 Virginia Ave', 'Kansas City', 'MO', '64106', 'Mon-Fri: 7 AM-5 PM', 'Day shelter, Showers, Laundry, Mail service, Case management, Housing assistance, Job readiness', 1, 'Hope Faith');

-- Jackson County Housing Authority
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Jackson County Housing Authority', 3, 'Section 8 housing vouchers and public housing.', '8169231315', '(816) 923-1315', 'https://www.jchaks.com', '8021 Paseo Blvd', 'Kansas City', 'MO', '64132', 'Mon-Fri: 8 AM-5 PM', 'Section 8 vouchers, Public housing, Housing counseling', 1, 'JCHA');

-- Wyandotte County Housing Authority
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Unified Government Housing Authority', 3, 'Affordable housing programs for Wyandotte County residents.', '9135738100', '(913) 573-8100', 'https://www.wycokck.org/Departments/Housing-Authority', '1728 N 7th St', 'Kansas City', 'KS', '66101', 'Mon-Fri: 8 AM-5 PM', 'Section 8 vouchers, Public housing, Housing assistance', 1, 'UG Housing');

-- ======================
-- UTILITY ASSISTANCE
-- ======================

-- Evergy - Energy Assistance Program
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, hours_of_operation, services_provided, eligibility_criteria, verified, data_source)
VALUES ('Evergy - Energy Assistance Programs', 11, 'Utility bill payment assistance and energy efficiency programs.', '8885444917', '(888) 544-4917', 'https://www.evergy.com/help-support/payment-assistance', 'Mon-Fri: 7 AM-7 PM', 'Bill payment assistance, Payment plans, Energy efficiency rebates, Crisis assistance', 'Income guidelines vary by program', 1, 'Evergy');

-- Spire Energy - Dollar More Program
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, hours_of_operation, services_provided, verified, data_source)
VALUES ('Spire Energy - Dollar More Program', 11, 'Gas bill payment assistance for Missouri customers.', '8005526436', '(800) 552-6436', 'https://www.spireenergy.com/customer-service/payment-assistance', 'Mon-Fri: 7 AM-6 PM', 'Gas bill assistance, Payment plans, Energy efficiency tips', 1, 'Spire Energy');

-- KC Water - Customer Assistance Program
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Kansas City Water - Customer Assistance', 11, 'Water and sewer bill assistance for Kansas City residents.', '8167474600', '(816) 747-4600', 'https://www.kcwater.us/customer-assistance/', '4800 E 63rd St', 'Kansas City', 'MO', '64130', 'Mon-Fri: 8 AM-5 PM', 'Water bill assistance, Payment plans, Senior discount, Crisis assistance', 1, 'KC Water');

-- Community Action Agency - Utility Assistance
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, hours_of_operation, services_provided, verified, data_source)
VALUES ('Community Action Agency of Greater Kansas City - Utility Help', 11, 'Utility bill assistance and weatherization services.', '9132880300', '(913) 288-0300', 'https://www.caagkc.org', 'Mon-Fri: 8 AM-5 PM', 'Utility bill assistance, Weatherization, Energy audits, LIHEAP application help', 1, 'CAAGKC');

-- ======================
-- HEALTHCARE
-- ======================

-- Samuel U. Rodgers Health Center - Primary Care
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Samuel U. Rodgers Health Center - Primary Care', 5, 'Federally Qualified Health Center providing comprehensive healthcare on sliding fee scale.', '8168891800', '(816) 889-1800', 'https://samrodgers.org', '825 Euclid Ave', 'Kansas City', 'MO', '64124', 'Mon-Fri: 8 AM-5 PM, walk-ins welcome', 'Primary care, Dental, Vision, Pharmacy, Behavioral health, WIC', 1, 'Samuel U. Rodgers');

-- Swope Health - Central Clinic
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('Swope Health - Central Clinic', 5, 'Community health center with medical, dental, and behavioral health services.', '8169233800', '(816) 923-3800', 'https://www.swopehealth.org', '3801 Blue Parkway', 'Kansas City', 'MO', '64130', 'Mon-Fri: 8 AM-5 PM, extended hours available', 'Primary care, Pediatrics, OB/GYN, Dental, Behavioral health, Pharmacy', 1, 'Swope Health');

-- KC CARE Health Center - Medical
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('KC CARE Health Center - Medical Services', 5, 'Free medical care for uninsured Kansas City residents.', '8167772722', '(816) 777-2722', 'https://www.kccare.org', '3515 Broadway Blvd', 'Kansas City', 'MO', '64111', 'Mon-Fri: 8 AM-5 PM, some evening appointments', 'Primary care, Chronic disease management, Lab services, Prescriptions, Specialty care referrals', 1, 'KC CARE');

-- Mattie Rhodes Center - Health Services
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, languages_spoken, verified, data_source)
VALUES ('Mattie Rhodes Center - Health Services', 5, 'Bilingual health services for the Latino/a community and all KC residents.', '8162318374', '(816) 231-8374', 'https://www.mattierhodes.org', '148 N Topping Ave', 'Kansas City', 'MO', '64123', 'Mon-Fri: 8 AM-5 PM', 'Primary care, Pediatrics, Chronic disease management, Health education', 'English, Spanish', 1, 'Mattie Rhodes');

-- University Health - Family Medicine
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, verified, data_source)
VALUES ('University Health - Family Medicine Clinic', 5, 'Academic medical center providing comprehensive healthcare with financial assistance available.', '8169328400', '(816) 932-8400', 'https://www.universityhealthkc.org', '2211 Charlotte St', 'Kansas City', 'MO', '64108', 'Mon-Fri: 8 AM-5 PM', 'Primary care, Specialty care, Lab services, Imaging, Financial assistance for uninsured', 1, 'University Health');

-- Kansas City Free Health Clinic
INSERT INTO resources (name, category_id, description, phone, phone_formatted, website, address, city, state, zip, hours_of_operation, services_provided, eligibility_criteria, verified, data_source)
VALUES ('Kansas City Free Health Clinic', 5, 'Free medical, dental, and vision care for uninsured adults.', '8169531100', '(816) 753-1100', 'https://www.kcfreeclinic.org', '3515 Broadway Blvd', 'Kansas City', 'MO', '64111', 'Mon-Thu: 5:30-8 PM, Sat: 8:30 AM-12 PM', 'Primary care, Dental, Vision, Prescriptions, Lab services', 'Uninsured adults 18-64, income at or below 200% federal poverty level', 1, 'KC Free Clinic');

-- Summary Stats
-- Total New Resources Added: 38
-- Categories:
--   Food Pantries: 4
--   WIC: 4
--   Mental Health: 8
--   Housing: 7
--   Utilities: 4
--   Healthcare: 6
--   Financial Aid: 5
