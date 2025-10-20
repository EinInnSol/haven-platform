-- Seed data for HAVEN Platform demo

-- Create demo caseworkers
INSERT INTO caseworkers (
    id, created_at, updated_at, name, email, phone,
    status, available, current_caseload, max_caseload,
    specializations, territory
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    unixepoch() * 1000,
    unixepoch() * 1000,
    'Demo Caseworker',
    'demo@haven.ai',
    '(555) 123-4567',
    'active',
    1,
    0,
    25,
    '["families", "veterans", "mental_health"]',
    'Long Beach Downtown'
);

-- Create demo QR codes
INSERT INTO qr_codes (
    id, created_at, code, location, campaign_name,
    created_by_caseworker_id, active, scans_count, successful_intakes
) VALUES 
(
    'demo',
    unixepoch() * 1000,
    'HAVEN-DEMO',
    'Demo Location - Long Beach City Hall',
    'Demo Campaign',
    '550e8400-e29b-41d4-a716-446655440001',
    1,
    0,
    0
);

-- Note: Client data will be added through intake submissions
-- This keeps the database clean for demo purposes
