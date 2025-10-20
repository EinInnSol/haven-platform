-- Seed demo data for HAVEN platform

-- Demo Caseworkers
INSERT INTO caseworkers (id, created_at, updated_at, name, email, phone, status, role, specializations, current_caseload, max_caseload, available)
VALUES 
(
  'demo-caseworker-1',
  strftime('%s', 'now') * 1000,
  strftime('%s', 'now') * 1000,
  'Sarah Johnson',
  'sarah.johnson@haven.demo',
  '(555) 123-4567',
  'active',
  'lead_caseworker',
  '["veterans", "families", "chronic_homelessness"]',
  0,
  25,
  1
),
(
  'demo-caseworker-2',
  strftime('%s', 'now') * 1000,
  strftime('%s', 'now') * 1000,
  'Michael Chen',
  'michael.chen@haven.demo',
  '(555) 234-5678',
  'active',
  'caseworker',
  '["youth", "mental_health"]',
  0,
  20,
  1
);

-- Demo QR Codes
INSERT INTO qr_codes (id, created_at, code, location, campaign_name, created_by_caseworker_id, active, scans_count, successful_intakes)
VALUES
(
  'demo-qr-1',
  strftime('%s', 'now') * 1000,
  'HAVEN-DEMO001',
  'Downtown Shelter',
  'November Demo',
  'demo-caseworker-1',
  1,
  0,
  0
),
(
  'demo-qr-2',
  strftime('%s', 'now') * 1000,
  'HAVEN-DEMO002',
  'City Library Outreach',
  'November Demo',
  'demo-caseworker-1',
  1,
  0,
  0
);

SELECT 'Seed data inserted successfully. Use QR codes HAVEN-DEMO001 or HAVEN-DEMO002 for testing.' as message;