/**
 * HAVEN AI ENGINE
 * Multi-model AI orchestration with cost optimization
 * 
 * Models:
 * - Claude Sonnet 4: Complex reasoning, case analysis, strategic planning
 * - Claude Haiku: Triage, classification, quick decisions
 * - GPT-4o Mini: Document generation, templates, summaries
 * 
 * Features:
 * - Smart routing based on task complexity
 * - Aggressive caching (5-minute TTL for repeated queries)
 * - Token usage tracking and cost monitoring
 * - Prompt engineering best practices
 */

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 min cache

// Cost tracking
const costs = {
  sonnet: 0,
  haiku: 0,
  gpt4omini: 0,
  totalRequests: 0,
  cacheHits: 0
};

// Pricing (per 1M tokens)
const PRICING = {
  SONNET_INPUT: 3.00,
  SONNET_OUTPUT: 15.00,
  HAIKU_INPUT: 0.80,
  HAIKU_OUTPUT: 4.00,
  GPT4O_MINI_INPUT: 0.15,
  GPT4O_MINI_OUTPUT: 0.60
};

/**
 * Calculate cost for API call
 */
function calculateCost(model, inputTokens, outputTokens) {
  const prices = {
    'claude-sonnet-4-20250514': [PRICING.SONNET_INPUT, PRICING.SONNET_OUTPUT],
    'claude-3-haiku-20240307': [PRICING.HAIKU_INPUT, PRICING.HAIKU_OUTPUT],
    'gpt-4o-mini': [PRICING.GPT4O_MINI_INPUT, PRICING.GPT4O_MINI_OUTPUT]
  };
  
  const [inputPrice, outputPrice] = prices[model] || [0, 0];
  return (inputTokens / 1000000 * inputPrice) + (outputTokens / 1000000 * outputPrice);
}

/**
 * SMART ROUTING - Decides which model to use based on task type
 */
function selectModel(taskType, complexityHint = null) {
  const routingLogic = {
    'TRIAGE': 'claude-3-haiku-20240307',
    'CLASSIFICATION': 'claude-3-haiku-20240307',
    'QUICK_ANSWER': 'claude-3-haiku-20240307',
    'CASE_ANALYSIS': 'claude-sonnet-4-20250514',
    'STRATEGIC_PLANNING': 'claude-sonnet-4-20250514',
    'COMPLEX_RECOMMENDATION': 'claude-sonnet-4-20250514',
    'INTAKE_ANALYSIS': 'claude-sonnet-4-20250514',
    'DOCUMENT': 'gpt-4o-mini',
    'SUMMARY': 'gpt-4o-mini',
    'TEMPLATE': 'gpt-4o-mini'
  };
  
  let model = routingLogic[taskType] || 'claude-3-haiku-20240307';
  
  if (complexityHint === 'HIGH' && model.includes('haiku')) {
    model = 'claude-sonnet-4-20250514';
  }
  
  return model;
}

/**
 * CORE AI CALL FUNCTION
 */
async function makeAICall(model, prompt, options = {}) {
  costs.totalRequests++;
  
  const cacheKey = `${model}:${prompt.substring(0, 100)}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    costs.cacheHits++;
    return { ...cached, fromCache: true };
  }
  
  const {
    systemPrompt = '',
    temperature = 0.7,
    maxTokens = 1000
  } = options;
  
  try {
    let result;
    
    if (model.startsWith('claude')) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      
      const data = await response.json();
      const cost = calculateCost(model, data.usage.input_tokens, data.usage.output_tokens);
      
      if (model.includes('sonnet')) costs.sonnet += cost;
      else if (model.includes('haiku')) costs.haiku += cost;
      
      result = {
        content: data.content[0].text,
        model,
        cost,
        tokens: { input: data.usage.input_tokens, output: data.usage.output_tokens },
        fromCache: false
      };
      
    } else {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        })
      });
      
      const data = await response.json();
      const cost = calculateCost(model, data.usage.prompt_tokens, data.usage.completion_tokens);
      costs.gpt4omini += cost;
      
      result = {
        content: data.choices[0].message.content,
        model,
        cost,
        tokens: { input: data.usage.prompt_tokens, output: data.usage.completion_tokens },
        fromCache: false
      };
    }
    
    cache.set(cacheKey, result);
    return result;
    
  } catch (error) {
    console.error('AI call failed:', error);
    throw error;
  }
}

// HIGH-LEVEL FUNCTIONS

async function processIntake(intakeData) {
  const prompt = `Analyze this homeless services intake assessment:

${JSON.stringify(intakeData, null, 2)}

Provide:
1. Risk assessment (high/medium/low for housing instability)
2. Immediate needs (top 3 priorities)
3. Recommended housing interventions (PSH, RRH, emergency shelter, etc.)
4. Potential barriers to housing
5. Suggested next steps for caseworker

Be specific, actionable, and consider HUD best practices.`;

  return makeAICall('claude-sonnet-4-20250514', prompt, {
    systemPrompt: 'You are an expert homeless services case manager with 15+ years experience. Provide practical, HUD-compliant recommendations.',
    maxTokens: 2000
  });
}

async function generateDailyBriefing(caseworkerData) {
  const prompt = `Generate a morning briefing for caseworker ${caseworkerData.name}:

Active Caseload: ${caseworkerData.activeClients} clients

Today's Scheduled:
${caseworkerData.todaySchedule.map(s => `- ${s.time}: ${s.activity}`).join('\n')}

Priority Clients:
${caseworkerData.priorityClients.map(c => `- ${c.name}: ${c.urgentNeed}`).join('\n')}

Provide:
1. Top 3 priorities for today
2. Suggested time blocks
3. Quick wins (easy completions)
4. Potential issues to watch
5. Motivational insight

Keep it conversational, actionable, realistic.`;

  return makeAICall('claude-sonnet-4-20250514', prompt, {
    systemPrompt: 'You are a supportive case management supervisor who helps caseworkers prioritize effectively and avoid burnout.',
    maxTokens: 1500
  });
}

async function generateDocument(docType, data) {
  const templates = {
    PROGRESS_NOTE: `Write a professional case management progress note based on this interaction:\n\n${JSON.stringify(data, null, 2)}`,
    HOUSING_APPLICATION: `Generate a housing application letter for:\n\n${JSON.stringify(data, null, 2)}\n\nHighlight strengths, address concerns proactively.`,
    CASE_SUMMARY: `Create a comprehensive case summary for:\n\n${JSON.stringify(data, null, 2)}\n\nInclude background, barriers, interventions, current status, next steps.`
  };

  return makeAICall('gpt-4o-mini', templates[docType], {
    systemPrompt: 'You are writing professional homeless services documentation. Be clear, factual, and maintain client dignity.',
    maxTokens: 2000
  });
}

function getCostSummary() {
  return {
    ...costs,
    totalCost: costs.sonnet + costs.haiku + costs.gpt4omini,
    averageCostPerRequest: costs.totalRequests > 0 
      ? (costs.sonnet + costs.haiku + costs.gpt4omini) / costs.totalRequests 
      : 0,
    cacheHitRate: costs.totalRequests > 0 
      ? (costs.cacheHits / costs.totalRequests * 100).toFixed(1) + '%'
      : '0%'
  };
}

module.exports = {
  processIntake,
  generateDailyBriefing,
  generateDocument,
  getCostSummary
};