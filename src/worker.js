/**
 * HAVEN PLATFORM - CLOUDFLARE WORKER
 * Main API entry point
 */

import { Router } from 'itty-router';
import { createCors } from 'itty-cors';
import { processIntake, generateDailyBriefing, generateDocument, getCostSummary } from './ai/ai-engine';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
});

const router = Router();

// Apply CORS to all routes
router.all('*', preflight);

/**
 * INTAKE ENDPOINTS
 */

// Generate QR code for intake
router.post('/api/qr/generate', async (request, env) => {
  try {
    const { location, campaign_name, caseworker_id } = await request.json();
    
    const qrId = crypto.randomUUID();
    const code = `HAVEN-${qrId.substring(0, 8).toUpperCase()}`;
    
    await env.DB.prepare(`
      INSERT INTO qr_codes (id, created_at, code, location, campaign_name, created_by_caseworker_id, active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).bind(
      qrId,
      Date.now(),
      code,
      location,
      campaign_name || null,
      caseworker_id || null
    ).run();
    
    return new Response(JSON.stringify({
      success: true,
      qr_id: qrId,
      qr_code: code,
      intake_url: `${new URL(request.url).origin}/intake/${qrId}`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Start intake session
router.get('/api/intake/:qrId/start', async (request, env) => {
  try {
    const { qrId } = request.params;
    
    // Verify QR code exists and is active
    const qrCode = await env.DB.prepare(`
      SELECT * FROM qr_codes WHERE id = ? AND active = 1
    `).bind(qrId).first();
    
    if (!qrCode) {
      return new Response(JSON.stringify({ error: 'Invalid or expired QR code' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update scan count
    await env.DB.prepare(`
      UPDATE qr_codes SET scans_count = scans_count + 1 WHERE id = ?
    `).bind(qrId).run();
    
    // Create intake session
    const sessionId = crypto.randomUUID();
    await env.DB.prepare(`
      INSERT INTO intake_sessions (id, created_at, updated_at, qr_code_id, current_step, total_steps, expires_at)
      VALUES (?, ?, ?, ?, 0, 40, ?)
    `).bind(
      sessionId,
      Date.now(),
      Date.now(),
      qrId,
      Date.now() + (24 * 60 * 60 * 1000) // 24 hour expiration
    ).run();
    
    return new Response(JSON.stringify({
      success: true,
      session_id: sessionId,
      location: qrCode.location
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Submit intake assessment
router.post('/api/intake/submit', async (request, env) => {
  try {
    const { session_id, assessment_data } = await request.json();
    
    // Get session
    const session = await env.DB.prepare(`
      SELECT * FROM intake_sessions WHERE id = ?
    `).bind(session_id).first();
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Calculate vulnerability score
    const { calculateVulnerabilityScore, determineHousingPriority } = await import('./assessment/intake-form.js');
    const score = calculateVulnerabilityScore(assessment_data);
    const priority = determineHousingPriority(score);
    
    // Process with AI
    const aiAnalysis = await processIntake(assessment_data);
    
    // Create client record
    const clientId = crypto.randomUUID();
    await env.DB.prepare(`
      INSERT INTO clients (
        id, created_at, updated_at,
        first_name, last_name, dob, phone, email,
        gender, race, ethnicity, veteran_status,
        current_living_situation, homeless_start_date,
        times_homeless_past_3years, total_months_homeless,
        risk_level, vulnerability_score, housing_priority,
        assessment_data, status, intake_source, intake_location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      clientId,
      Date.now(),
      Date.now(),
      assessment_data.q1_first_name,
      assessment_data.q2_last_name,
      assessment_data.q3_dob || null,
      assessment_data.q5_phone || null,
      assessment_data.q6_email || null,
      assessment_data.q7_gender || null,
      JSON.stringify(assessment_data.q8_race || []),
      assessment_data.q9_ethnicity || null,
      assessment_data.q10_veteran || null,
      assessment_data.q11_current_situation,
      assessment_data.q12_homeless_start,
      assessment_data.q13_times_homeless,
      assessment_data.q14_total_months,
      priority.level,
      score,
      priority.recommendation,
      JSON.stringify(assessment_data),
      'active',
      'qr_code',
      session.location || 'unknown'
    ).run();
    
    // Find available caseworker (simple round-robin for now)
    const caseworker = await env.DB.prepare(`
      SELECT * FROM caseworkers 
      WHERE status = 'active' AND available = 1 
      AND current_caseload < max_caseload
      ORDER BY current_caseload ASC
      LIMIT 1
    `).first();
    
    if (!caseworker) {
      return new Response(JSON.stringify({ 
        error: 'No available caseworkers. Please try again later.' 
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create assignment
    const assignmentId = crypto.randomUUID();
    await env.DB.prepare(`
      INSERT INTO assignments (
        id, created_at, updated_at,
        client_id, caseworker_id,
        assigned_date, status, priority,
        housing_goal, case_plan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      assignmentId,
      Date.now(),
      Date.now(),
      clientId,
      caseworker.id,
      Date.now(),
      'active',
      priority.level.toLowerCase(),
      assessment_data.q34_housing_preference || 'not_specified',
      JSON.stringify({
        aiRecommendations: aiAnalysis.content,
        barriers: assessment_data.q35_barriers || [],
        urgency: assessment_data.q36_timeline || 'flexible'
      })
    ).run();
    
    // Update caseworker caseload
    await env.DB.prepare(`
      UPDATE caseworkers SET current_caseload = current_caseload + 1 WHERE id = ?
    `).bind(caseworker.id).run();
    
    // Update client assignment
    await env.DB.prepare(`
      UPDATE clients SET assigned_caseworker_id = ? WHERE id = ?
    `).bind(caseworker.id, clientId).run();
    
    // Mark session as complete
    await env.DB.prepare(`
      UPDATE intake_sessions SET completed = 1, client_id = ?, updated_at = ? WHERE id = ?
    `).bind(clientId, Date.now(), session_id).run();
    
    // Update QR code success count
    await env.DB.prepare(`
      UPDATE qr_codes SET successful_intakes = successful_intakes + 1 WHERE id = ?
    `).bind(session.qr_code_id).run();
    
    return new Response(JSON.stringify({
      success: true,
      client_id: clientId,
      caseworker: {
        name: caseworker.name,
        phone: caseworker.phone,
        email: caseworker.email
      },
      vulnerability_score: score,
      housing_priority: priority,
      expected_contact: 'within 24 hours',
      message: `Thank you! You've been assigned to ${caseworker.name}. They will contact you within 24 hours to begin helping you find housing.`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Intake submission error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

/**
 * CASEWORKER ENDPOINTS
 */

// Get caseworker dashboard data
router.get('/api/caseworker/:id/dashboard', async (request, env) => {
  try {
    const { id } = request.params;
    
    // Get caseworker info
    const caseworker = await env.DB.prepare(`
      SELECT * FROM caseworkers WHERE id = ?
    `).bind(id).first();
    
    if (!caseworker) {
      return new Response(JSON.stringify({ error: 'Caseworker not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get active assignments
    const assignments = await env.DB.prepare(`
      SELECT 
        a.*,
        c.first_name, c.last_name, c.phone, c.email,
        c.risk_level, c.vulnerability_score, c.housing_priority,
        c.current_living_situation
      FROM assignments a
      JOIN clients c ON a.client_id = c.id
      WHERE a.caseworker_id = ? AND a.status = 'active'
      ORDER BY a.priority DESC, a.created_at ASC
    `).bind(id).all();
    
    return new Response(JSON.stringify({
      success: true,
      caseworker: {
        name: caseworker.name,
        email: caseworker.email,
        current_caseload: caseworker.current_caseload,
        max_caseload: caseworker.max_caseload,
        specializations: JSON.parse(caseworker.specializations || '[]')
      },
      assignments: assignments.results || []
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Generate daily briefing for caseworker
router.get('/api/caseworker/:id/briefing', async (request, env) => {
  try {
    const { id } = request.params;
    
    // Get caseworker data
    const caseworker = await env.DB.prepare(`
      SELECT * FROM caseworkers WHERE id = ?
    `).bind(id).first();
    
    // Get today's priority clients
    const priorityClients = await env.DB.prepare(`
      SELECT c.*, a.priority
      FROM clients c
      JOIN assignments a ON c.id = a.client_id
      WHERE a.caseworker_id = ? AND a.status = 'active'
      AND (c.risk_level = 'HIGH' OR a.priority = 'urgent')
      LIMIT 5
    `).bind(id).all();
    
    const briefingData = {
      name: caseworker.name,
      activeClients: caseworker.current_caseload,
      todaySchedule: [], // Would pull from calendar integration
      priorityClients: (priorityClients.results || []).map(c => ({
        name: `${c.first_name} ${c.last_name}`,
        urgentNeed: c.housing_priority
      })),
      pendingTasks: [] // Would pull from tasks system
    };
    
    const briefing = await generateDailyBriefing(briefingData);
    
    return new Response(JSON.stringify({
      success: true,
      briefing: briefing.content,
      ai_cost: briefing.cost
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

/**
 * AI DOCUMENT GENERATION
 */
router.post('/api/document/generate', async (request, env) => {
  try {
    const { doc_type, data } = await request.json();
    
    const document = await generateDocument(doc_type, data);
    
    return new Response(JSON.stringify({
      success: true,
      document: document.content,
      model: document.model,
      cost: document.cost
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

/**
 * SYSTEM ENDPOINTS
 */
router.get('/api/health', () => {
  return new Response(JSON.stringify({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

router.get('/api/cost-summary', async () => {
  const summary = getCostSummary();
  return new Response(JSON.stringify(summary), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
});

export default {
  fetch: (request, env, ctx) => router.handle(request, env, ctx).then(corsify)
};