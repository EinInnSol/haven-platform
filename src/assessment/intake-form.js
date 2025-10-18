/**
 * HUD-COMPLIANT INTAKE ASSESSMENT
 * Based on VI-SPDAT (Vulnerability Index - Service Prioritization Decision Assistance Tool)
 * and HUD Coordinated Entry requirements
 */

export const INTAKE_ASSESSMENT = {
  // SECTION 1: BASIC INFORMATION
  section1_basic: {
    title: "Basic Information",
    questions: [
      {
        id: "q1_first_name",
        text: "What is your first name?",
        type: "text",
        required: true,
        hud_field: "FirstName"
      },
      {
        id: "q2_last_name",
        text: "What is your last name?",
        type: "text",
        required: true,
        hud_field: "LastName"
      },
      {
        id: "q3_dob",
        text: "What is your date of birth?",
        type: "date",
        required: true,
        hud_field: "DOB"
      },
      {
        id: "q4_ssn",
        text: "Last 4 digits of your Social Security Number (optional, helps with services)",
        type: "text",
        maxLength: 4,
        required: false,
        hud_field: "SSN"
      },
      {
        id: "q5_phone",
        text: "Phone number (so we can reach you)",
        type: "tel",
        required: false,
        hud_field: "PhoneNumber"
      },
      {
        id: "q6_email",
        text: "Email address (optional)",
        type: "email",
        required: false,
        hud_field: "EmailAddress"
      }
    ]
  },

  // SECTION 2: DEMOGRAPHICS (HUD Required)
  section2_demographics: {
    title: "About You",
    questions: [
      {
        id: "q7_gender",
        text: "What is your gender?",
        type: "select",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "transgender_mtf", label: "Transgender (Male to Female)" },
          { value: "transgender_ftm", label: "Transgender (Female to Male)" },
          { value: "non_binary", label: "Non-Binary" },
          { value: "other", label: "Other" },
          { value: "prefer_not_to_say", label: "Prefer not to say" }
        ],
        required: true,
        hud_field: "Gender"
      },
      {
        id: "q8_race",
        text: "What is your race? (Check all that apply)",
        type: "multiselect",
        options: [
          { value: "american_indian", label: "American Indian or Alaska Native" },
          { value: "asian", label: "Asian" },
          { value: "black", label: "Black or African American" },
          { value: "native_hawaiian", label: "Native Hawaiian or Other Pacific Islander" },
          { value: "white", label: "White" }
        ],
        required: true,
        hud_field: "Race"
      },
      {
        id: "q9_ethnicity",
        text: "Are you Hispanic or Latino?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "prefer_not_to_say", label: "Prefer not to say" }
        ],
        required: true,
        hud_field: "Ethnicity"
      },
      {
        id: "q10_veteran",
        text: "Have you ever served in the U.S. Armed Forces?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ],
        required: true,
        hud_field: "VeteranStatus"
      }
    ]
  },

  // SECTION 3: HOUSING HISTORY
  section3_housing: {
    title: "Housing History",
    questions: [
      {
        id: "q11_current_situation",
        text: "Where did you sleep last night?",
        type: "select",
        options: [
          { value: "emergency_shelter", label: "Emergency shelter", points: 3 },
          { value: "place_not_meant_for_habitation", label: "Place not meant for people (street, car, abandoned building)", points: 5 },
          { value: "transitional_housing", label: "Transitional housing", points: 2 },
          { value: "staying_with_friends_family", label: "Staying with friends or family temporarily", points: 2 },
          { value: "hotel_motel", label: "Hotel or motel (without voucher)", points: 2 },
          { value: "jail_prison_hospital", label: "Jail, prison, or hospital", points: 1 },
          { value: "own_apartment_house", label: "My own apartment or house", points: 0 },
          { value: "other", label: "Other", points: 1 }
        ],
        required: true,
        hud_field: "LivingSituation",
        scoring: true
      },
      {
        id: "q12_homeless_start",
        text: "When did you first become homeless?",
        type: "date",
        required: true,
        hud_field: "DateHomelessStarted"
      },
      {
        id: "q13_times_homeless",
        text: "How many times have you been homeless in the past 3 years?",
        type: "select",
        options: [
          { value: "1", label: "This is my first time", points: 1 },
          { value: "2", label: "2 times", points: 2 },
          { value: "3", label: "3 times", points: 3 },
          { value: "4plus", label: "4 or more times", points: 5 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q14_total_months",
        text: "In total, how long have you been homeless in your lifetime?",
        type: "select",
        options: [
          { value: "less_than_month", label: "Less than a month", points: 0 },
          { value: "1_6_months", label: "1-6 months", points: 1 },
          { value: "7_12_months", label: "7-12 months", points: 2 },
          { value: "1_2_years", label: "1-2 years", points: 3 },
          { value: "more_than_2_years", label: "More than 2 years", points: 5 }
        ],
        required: true,
        scoring: true
      }
    ]
  },

  // SECTION 4: RISK & VULNERABILITY
  section4_risk: {
    title: "Health & Safety",
    questions: [
      {
        id: "q15_health_conditions",
        text: "Do you have any of these health conditions? (Check all that apply)",
        type: "multiselect",
        options: [
          { value: "hiv_aids", label: "HIV/AIDS", points: 3 },
          { value: "chronic_health", label: "Chronic health condition (diabetes, heart disease, etc.)", points: 2 },
          { value: "mental_health", label: "Mental health condition", points: 2 },
          { value: "substance_use", label: "Substance use disorder", points: 2 },
          { value: "physical_disability", label: "Physical disability", points: 2 },
          { value: "brain_injury", label: "Traumatic brain injury", points: 3 },
          { value: "none", label: "None of these", points: 0 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q16_hospitalized",
        text: "In the past 6 months, how many times have you been to the emergency room?",
        type: "select",
        options: [
          { value: "0", label: "0 times", points: 0 },
          { value: "1_2", label: "1-2 times", points: 1 },
          { value: "3_4", label: "3-4 times", points: 2 },
          { value: "5plus", label: "5 or more times", points: 4 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q17_ambulance",
        text: "In the past 6 months, how many times have you taken an ambulance to the hospital?",
        type: "select",
        options: [
          { value: "0", label: "0 times", points: 0 },
          { value: "1", label: "1 time", points: 2 },
          { value: "2plus", label: "2 or more times", points: 4 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q18_medications",
        text: "Do you take medications prescribed by a doctor?",
        type: "select",
        options: [
          { value: "yes_regularly", label: "Yes, I take them regularly", points: 0 },
          { value: "yes_sometimes", label: "Yes, but I sometimes miss doses", points: 2 },
          { value: "yes_rarely", label: "Yes, but I rarely take them", points: 3 },
          { value: "no", label: "No", points: 0 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q19_attacked",
        text: "Have you been attacked or beaten up since you became homeless?",
        type: "select",
        options: [
          { value: "yes", label: "Yes", points: 3 },
          { value: "no", label: "No", points: 0 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q20_threatened",
        text: "Have you threatened to or tried to harm yourself or anyone else in the past year?",
        type: "select",
        options: [
          { value: "yes", label: "Yes", points: 4 },
          { value: "no", label: "No", points: 0 }
        ],
        required: true,
        scoring: true
      }
    ]
  },

  // SECTION 5: SUBSTANCE USE
  section5_substance: {
    title: "Substance Use",
    questions: [
      {
        id: "q21_alcohol",
        text: "Do you drink alcohol?",
        type: "select",
        options: [
          { value: "no", label: "No", points: 0 },
          { value: "yes_occasionally", label: "Yes, occasionally", points: 0 },
          { value: "yes_regularly", label: "Yes, regularly", points: 1 },
          { value: "yes_daily", label: "Yes, every day", points: 3 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q22_drugs",
        text: "Do you use drugs?",
        type: "select",
        options: [
          { value: "no", label: "No", points: 0 },
          { value: "yes_occasionally", label: "Yes, occasionally", points: 1 },
          { value: "yes_regularly", label: "Yes, regularly", points: 2 },
          { value: "yes_daily", label: "Yes, every day", points: 4 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q23_treatment",
        text: "Have you ever received treatment for substance use?",
        type: "select",
        options: [
          { value: "yes_completed", label: "Yes, and I completed the program", points: 0 },
          { value: "yes_incomplete", label: "Yes, but I didn't complete it", points: 2 },
          { value: "no", label: "No", points: 0 }
        ],
        required: false,
        scoring: true
      }
    ]
  },

  // SECTION 6: INCOME & BENEFITS
  section6_income: {
    title: "Income & Benefits",
    questions: [
      {
        id: "q24_income",
        text: "Do you have any income?",
        type: "select",
        options: [
          { value: "employment", label: "Employment" },
          { value: "ssi_ssdi", label: "SSI or SSDI" },
          { value: "unemployment", label: "Unemployment benefits" },
          { value: "general_assistance", label: "General assistance" },
          { value: "other", label: "Other income" },
          { value: "none", label: "No income" }
        ],
        required: true,
        hud_field: "IncomeSource"
      },
      {
        id: "q25_monthly_income",
        text: "What is your approximate monthly income?",
        type: "select",
        options: [
          { value: "0", label: "$0", points: 3 },
          { value: "1_500", label: "$1 - $500", points: 2 },
          { value: "501_1000", label: "$501 - $1000", points: 1 },
          { value: "1001plus", label: "$1001 or more", points: 0 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q26_benefits",
        text: "Are you receiving any of these benefits? (Check all that apply)",
        type: "multiselect",
        options: [
          { value: "snap", label: "SNAP (food stamps)" },
          { value: "medicaid", label: "Medicaid" },
          { value: "medicare", label: "Medicare" },
          { value: "tanf", label: "TANF (cash assistance)" },
          { value: "none", label: "None" }
        ],
        required: true,
        hud_field: "BenefitsReceived"
      }
    ]
  },

  // SECTION 7: LEGAL HISTORY
  section7_legal: {
    title: "Legal History",
    questions: [
      {
        id: "q27_legal_issues",
        text: "Do you have any active legal issues?",
        type: "select",
        options: [
          { value: "outstanding_warrants", label: "Outstanding warrants", points: 2 },
          { value: "probation_parole", label: "On probation or parole", points: 1 },
          { value: "pending_charges", label: "Pending criminal charges", points: 1 },
          { value: "child_support", label: "Outstanding child support", points: 1 },
          { value: "none", label: "None", points: 0 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q28_incarceration",
        text: "Have you been in jail or prison in the past year?",
        type: "select",
        options: [
          { value: "yes_multiple", label: "Yes, more than once", points: 3 },
          { value: "yes_once", label: "Yes, once", points: 2 },
          { value: "no", label: "No", points: 0 }
        ],
        required: true,
        scoring: true
      }
    ]
  },

  // SECTION 8: DAILY FUNCTIONING
  section8_functioning: {
    title: "Daily Life",
    questions: [
      {
        id: "q29_daily_activities",
        text: "Can you manage your daily activities (bathing, eating, using the restroom)?",
        type: "select",
        options: [
          { value: "yes_independently", label: "Yes, independently", points: 0 },
          { value: "yes_with_help", label: "Yes, with some help", points: 2 },
          { value: "no_need_help", label: "No, I need help", points: 4 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q30_appointments",
        text: "How often do you miss important appointments or meetings?",
        type: "select",
        options: [
          { value: "never", label: "Never or rarely", points: 0 },
          { value: "sometimes", label: "Sometimes", points: 1 },
          { value: "often", label: "Often", points: 2 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q31_money_management",
        text: "Can you manage money on your own?",
        type: "select",
        options: [
          { value: "yes", label: "Yes", points: 0 },
          { value: "sometimes", label: "Sometimes struggle", points: 1 },
          { value: "no", label: "No, I need help", points: 2 }
        ],
        required: true,
        scoring: true
      }
    ]
  },

  // SECTION 9: SOCIAL SUPPORT
  section9_support: {
    title: "Support System",
    questions: [
      {
        id: "q32_social_support",
        text: "Do you have anyone who can help you with housing, money, or other needs?",
        type: "select",
        options: [
          { value: "yes_family", label: "Yes, family members", points: 0 },
          { value: "yes_friends", label: "Yes, friends", points: 0 },
          { value: "yes_both", label: "Yes, both family and friends", points: 0 },
          { value: "no", label: "No, I'm on my own", points: 3 }
        ],
        required: true,
        scoring: true
      },
      {
        id: "q33_caseworker",
        text: "Have you worked with a caseworker or service provider before?",
        type: "select",
        options: [
          { value: "yes_currently", label: "Yes, currently working with one" },
          { value: "yes_past", label: "Yes, in the past" },
          { value: "no", label: "No, this is my first time" }
        ],
        required: true
      }
    ]
  },

  // SECTION 10: HOUSING GOALS
  section10_goals: {
    title: "Your Housing Goals",
    questions: [
      {
        id: "q34_housing_preference",
        text: "What type of housing are you most interested in?",
        type: "select",
        options: [
          { value: "own_apartment", label: "My own apartment" },
          { value: "shared_housing", label: "Shared housing with roommates" },
          { value: "family_reunification", label: "Reuniting with family" },
          { value: "sober_living", label: "Sober living environment" },
          { value: "not_sure", label: "Not sure yet" }
        ],
        required: true
      },
      {
        id: "q35_barriers",
        text: "What do you think is your biggest barrier to getting housing? (Check all that apply)",
        type: "multiselect",
        options: [
          { value: "no_income", label: "No income or not enough money" },
          { value: "bad_credit", label: "Bad credit or rental history" },
          { value: "eviction_history", label: "Past eviction" },
          { value: "criminal_record", label: "Criminal record" },
          { value: "no_id", label: "No ID or documents" },
          { value: "health_issues", label: "Health or disability issues" },
          { value: "pets", label: "I have pets" },
          { value: "not_sure", label: "Not sure" }
        ],
        required: true
      },
      {
        id: "q36_timeline",
        text: "How urgent is your housing need?",
        type: "select",
        options: [
          { value: "emergency", label: "Emergency - I need shelter tonight" },
          { value: "urgent", label: "Urgent - within a few days" },
          { value: "soon", label: "Soon - within a few weeks" },
          { value: "flexible", label: "Flexible - I can wait if needed" }
        ],
        required: true
      }
    ]
  },

  // SECTION 11: SERVICES NEEDED
  section11_services: {
    title: "What Services Do You Need?",
    questions: [
      {
        id: "q37_immediate_needs",
        text: "What do you need help with right now? (Check all that apply)",
        type: "multiselect",
        options: [
          { value: "food", label: "Food" },
          { value: "clothing", label: "Clothing" },
          { value: "shower", label: "Shower facilities" },
          { value: "medical", label: "Medical care" },
          { value: "mental_health", label: "Mental health services" },
          { value: "substance_treatment", label: "Substance use treatment" },
          { value: "id_documents", label: "Help getting ID or documents" },
          { value: "transportation", label: "Transportation" },
          { value: "employment", label: "Job search help" },
          { value: "benefits", label: "Applying for benefits (SSI, SNAP, etc.)" }
        ],
        required: true
      }
    ]
  },

  // SECTION 12: FINAL QUESTIONS
  section12_final: {
    title: "Almost Done!",
    questions: [
      {
        id: "q38_contact_preference",
        text: "How would you like us to contact you?",
        type: "multiselect",
        options: [
          { value: "phone_call", label: "Phone call" },
          { value: "text_message", label: "Text message" },
          { value: "email", label: "Email" },
          { value: "in_person", label: "In person only" }
        ],
        required: true
      },
      {
        id: "q39_best_time",
        text: "What's the best time to reach you?",
        type: "select",
        options: [
          { value: "morning", label: "Morning (8am-12pm)" },
          { value: "afternoon", label: "Afternoon (12pm-5pm)" },
          { value: "evening", label: "Evening (5pm-8pm)" },
          { value: "anytime", label: "Anytime" }
        ],
        required: true
      },
      {
        id: "q40_additional_info",
        text: "Is there anything else you'd like us to know that would help us assist you better?",
        type: "textarea",
        required: false
      }
    ]
  }
};

// Scoring thresholds for housing prioritization
export const SCORING_THRESHOLDS = {
  HIGH_PRIORITY: 40, // PSH candidates
  MEDIUM_PRIORITY: 25, // RRH candidates
  LOW_PRIORITY: 0 // Emergency shelter, prevention
};

// Calculate vulnerability score from assessment responses
export function calculateVulnerabilityScore(responses) {
  let score = 0;
  
  for (const [sectionKey, section] of Object.entries(INTAKE_ASSESSMENT)) {
    for (const question of section.questions) {
      if (question.scoring && responses[question.id]) {
        const response = responses[question.id];
        
        if (question.type === 'multiselect') {
          // For multiselect, sum up points from all selected options
          const selectedOptions = question.options.filter(opt => 
            response.includes(opt.value)
          );
          score += selectedOptions.reduce((sum, opt) => sum + (opt.points || 0), 0);
        } else {
          // For single select, find the selected option's points
          const selectedOption = question.options.find(opt => opt.value === response);
          score += selectedOption?.points || 0;
        }
      }
    }
  }
  
  return score;
}

// Determine housing priority based on score
export function determineHousingPriority(score) {
  if (score >= SCORING_THRESHOLDS.HIGH_PRIORITY) {
    return {
      level: 'HIGH',
      recommendation: 'PSH', // Permanent Supportive Housing
      description: 'High acuity - requires intensive support services with housing'
    };
  } else if (score >= SCORING_THRESHOLDS.MEDIUM_PRIORITY) {
    return {
      level: 'MEDIUM',
      recommendation: 'RRH', // Rapid Re-Housing
      description: 'Moderate acuity - can stabilize with time-limited rental assistance'
    };
  } else {
    return {
      level: 'LOW',
      recommendation: 'EMERGENCY_PREVENTION',
      description: 'Lower acuity - emergency shelter or homelessness prevention'
    };
  }
}