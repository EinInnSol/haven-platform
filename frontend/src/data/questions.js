export const INTAKE_QUESTIONS = [
  {
    id: 'q1_first_name',
    question: 'What is your first name?',
    type: 'text',
    required: true,
    placeholder: 'Enter your first name'
  },
  {
    id: 'q2_last_name',
    question: 'What is your last name?',
    type: 'text',
    required: true,
    placeholder: 'Enter your last name'
  },
  {
    id: 'q3_dob',
    question: 'What is your date of birth?',
    type: 'date',
    required: true
  },
  {
    id: 'q4_ssn_last4',
    question: 'Last 4 digits of Social Security Number',
    description: 'Optional - helps us prevent duplicate entries',
    type: 'text',
    required: false,
    placeholder: '1234'
  },
  {
    id: 'q5_phone',
    question: 'Phone number',
    description: 'So your caseworker can reach you',
    type: 'text',
    required: true,
    placeholder: '(555) 123-4567'
  },
  {
    id: 'q6_email',
    question: 'Email address',
    description: 'Optional - for updates and resources',
    type: 'text',
    required: false,
    placeholder: 'your@email.com'
  },
  {
    id: 'q7_gender',
    question: 'What is your gender?',
    type: 'select',
    required: true,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'transgender', label: 'Transgender' },
      { value: 'non_binary', label: 'Non-Binary' },
      { value: 'other', label: 'Other' },
      { value: 'decline', label: 'Prefer not to answer' }
    ]
  },
  {
    id: 'q8_race',
    question: 'Race (select all that apply)',
    type: 'multiselect',
    required: true,
    options: [
      { value: 'white', label: 'White' },
      { value: 'black', label: 'Black or African American' },
      { value: 'asian', label: 'Asian' },
      { value: 'native_american', label: 'American Indian or Alaska Native' },
      { value: 'pacific_islander', label: 'Native Hawaiian or Other Pacific Islander' },
      { value: 'other', label: 'Other' },
      { value: 'decline', label: 'Prefer not to answer' }
    ]
  },
  {
    id: 'q9_ethnicity',
    question: 'Are you Hispanic or Latino?',
    type: 'select',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'decline', label: 'Prefer not to answer' }
    ]
  },
  {
    id: 'q10_veteran',
    question: 'Have you ever served in the U.S. Armed Forces?',
    type: 'select',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'decline', label: 'Prefer not to answer' }
    ]
  },
  {
    id: 'q11_current_situation',
    question: 'Where are you staying tonight?',
    type: 'select',
    required: true,
    options: [
      { value: 'street', label: 'On the street, in a car, or outdoors' },
      { value: 'shelter', label: 'Emergency shelter' },
      { value: 'transitional', label: 'Transitional housing' },
      { value: 'friends_family', label: 'Temporarily staying with friends or family' },
      { value: 'motel', label: 'Motel paid by agency or voucher' },
      { value: 'hospital', label: 'Hospital or institution' },
      { value: 'other', label: 'Other temporary situation' }
    ]
  },
  {
    id: 'q12_homeless_start',
    question: 'When did you become homeless?',
    description: 'Approximate date is fine',
    type: 'date',
    required: true
  },
  {
    id: 'q13_times_homeless',
    question: 'How many times have you been homeless in the past 3 years?',
    type: 'select',
    required: true,
    options: [
      { value: '1', label: 'This is my first time' },
      { value: '2', label: '2 times' },
      { value: '3', label: '3 times' },
      { value: '4+', label: '4 or more times' }
    ]
  },
  {
    id: 'q14_total_months',
    question: 'Total months homeless in past 3 years',
    type: 'number',
    required: true,
    min: 0,
    max: 36,
    placeholder: 'Enter number of months'
  },
  {
    id: 'q15_disabilities',
    question: 'Do you have any of these conditions? (select all that apply)',
    type: 'multiselect',
    required: true,
    options: [
      { value: 'physical', label: 'Physical disability' },
      { value: 'mental', label: 'Mental health condition' },
      { value: 'substance', label: 'Substance use disorder' },
      { value: 'developmental', label: 'Developmental disability' },
      { value: 'chronic_health', label: 'Chronic health condition' },
      { value: 'hiv', label: 'HIV/AIDS' },
      { value: 'none', label: 'None of the above' }
    ]
  },
  {
    id: 'q16_income',
    question: 'Do you have any income?',
    type: 'select',
    required: true,
    options: [
      { value: 'no', label: 'No income' },
      { value: 'employment', label: 'Employment income' },
      { value: 'ssi', label: 'SSI' },
      { value: 'ssdi', label: 'SSDI' },
      { value: 'benefits', label: 'Other benefits' },
      { value: 'other', label: 'Other income source' }
    ]
  },
  {
    id: 'q17_monthly_income',
    question: 'Approximate monthly income',
    description: 'Enter 0 if no income',
    type: 'number',
    required: true,
    min: 0,
    placeholder: 'Dollar amount'
  },
  {
    id: 'q18_id_documents',
    question: 'Do you have any of these documents?',
    type: 'multiselect',
    required: true,
    options: [
      { value: 'state_id', label: 'State ID or Driver\'s License' },
      { value: 'birth_cert', label: 'Birth Certificate' },
      { value: 'ssn_card', label: 'Social Security Card' },
      { value: 'none', label: 'None of these' }
    ]
  },
  {
    id: 'q19_pregnant',
    question: 'Are you currently pregnant?',
    type: 'select',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'na', label: 'Not applicable' }
    ]
  },
  {
    id: 'q20_children',
    question: 'Do you have children under 18 with you?',
    type: 'select',
    required: true,
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes_1', label: 'Yes, 1 child' },
      { value: 'yes_2', label: 'Yes, 2 children' },
      { value: 'yes_3plus', label: 'Yes, 3 or more children' }
    ]
  },
  {
    id: 'q21_fleeing_dv',
    question: 'Are you fleeing domestic violence?',
    description: 'Your safety is our priority',
    type: 'select',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'decline', label: 'Prefer not to answer' }
    ]
  },
  {
    id: 'q22_criminal_history',
    question: 'Have you been convicted of a felony?',
    description: 'Some housing programs have restrictions, but many options are available',
    type: 'select',
    required: true,
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes_past', label: 'Yes, more than 5 years ago' },
      { value: 'yes_recent', label: 'Yes, within the last 5 years' },
      { value: 'decline', label: 'Prefer not to answer' }
    ]
  },
  {
    id: 'q23_eviction_history',
    question: 'Have you been evicted in the past 7 years?',
    type: 'select',
    required: true,
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
      { value: 'unsure', label: 'Not sure' }
    ]
  },
  {
    id: 'q24_credit_history',
    question: 'How would you describe your credit history?',
    type: 'select',
    required: true,
    options: [
      { value: 'good', label: 'Good' },
      { value: 'fair', label: 'Fair' },
      { value: 'poor', label: 'Poor' },
      { value: 'none', label: 'No credit history' },
      { value: 'unsure', label: 'Not sure' }
    ]
  },
  {
    id: 'q25_medical_needs',
    question: 'Do you have urgent medical needs?',
    type: 'select',
    required: true,
    options: [
      { value: 'yes_urgent', label: 'Yes, urgent care needed' },
      { value: 'yes_ongoing', label: 'Yes, ongoing treatment needed' },
      { value: 'no', label: 'No urgent medical needs' }
    ]
  },
  {
    id: 'q26_medications',
    question: 'Do you take any prescription medications?',
    type: 'select',
    required: true,
    options: [
      { value: 'yes_have', label: 'Yes, and I have them' },
      { value: 'yes_need', label: 'Yes, but I need to refill' },
      { value: 'no', label: 'No medications' }
    ]
  },
  {
    id: 'q27_transportation',
    question: 'Do you have reliable transportation?',
    type: 'select',
    required: true,
    options: [
      { value: 'car', label: 'Yes, I have a car' },
      { value: 'public', label: 'I use public transit' },
      { value: 'bike', label: 'I have a bicycle' },
      { value: 'none', label: 'No reliable transportation' }
    ]
  },
  {
    id: 'q28_employment',
    question: 'Are you currently employed?',
    type: 'select',
    required: true,
    options: [
      { value: 'full_time', label: 'Yes, full-time' },
      { value: 'part_time', label: 'Yes, part-time' },
      { value: 'looking', label: 'No, but actively looking' },
      { value: 'not_looking', label: 'No, not currently looking' },
      { value: 'unable', label: 'Unable to work due to disability' }
    ]
  },
  {
    id: 'q29_education',
    question: 'What is your highest level of education?',
    type: 'select',
    required: true,
    options: [
      { value: 'less_than_hs', label: 'Less than high school' },
      { value: 'hs', label: 'High school or GED' },
      { value: 'some_college', label: 'Some college' },
      { value: 'associates', label: 'Associate degree' },
      { value: 'bachelors', label: 'Bachelor\'s degree' },
      { value: 'graduate', label: 'Graduate degree' }
    ]
  },
  {
    id: 'q30_skills',
    question: 'Do you have any job skills or certifications?',
    description: 'Optional',
    type: 'textarea',
    required: false,
    placeholder: 'e.g., Forklift certified, retail experience, etc.'
  },
  {
    id: 'q31_pets',
    question: 'Do you have any pets?',
    type: 'select',
    required: true,
    options: [
      { value: 'no', label: 'No pets' },
      { value: 'service', label: 'Yes, service animal' },
      { value: 'esa', label: 'Yes, emotional support animal' },
      { value: 'pet', label: 'Yes, pet' }
    ]
  },
  {
    id: 'q32_smoking',
    question: 'Do you smoke or vape?',
    description: 'Some housing units are smoke-free',
    type: 'select',
    required: true,
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
      { value: 'trying_quit', label: 'Trying to quit' }
    ]
  },
  {
    id: 'q33_accessibility',
    question: 'Do you need wheelchair accessible housing?',
    type: 'select',
    required: true,
    options: [
      { value: 'yes', label: 'Yes, required' },
      { value: 'preferred', label: 'Preferred but not required' },
      { value: 'no', label: 'No' }
    ]
  },
  {
    id: 'q34_housing_preference',
    question: 'What type of housing are you seeking?',
    type: 'select',
    required: true,
    options: [
      { value: 'permanent', label: 'Permanent housing (apartment/house)' },
      { value: 'transitional', label: 'Transitional housing (6-24 months)' },
      { value: 'shelter', label: 'Emergency shelter (immediate)' },
      { value: 'any', label: 'Any available option' }
    ]
  },
  {
    id: 'q35_barriers',
    question: 'What are your biggest barriers to housing? (select all)',
    type: 'multiselect',
    required: true,
    options: [
      { value: 'income', label: 'No income or insufficient income' },
      { value: 'credit', label: 'Bad credit history' },
      { value: 'criminal', label: 'Criminal background' },
      { value: 'eviction', label: 'Previous eviction' },
      { value: 'id', label: 'Lack of identification documents' },
      { value: 'deposit', label: 'Cannot afford deposit/first month' },
      { value: 'discrimination', label: 'Experience discrimination' },
      { value: 'pets', label: 'Have pets' },
      { value: 'other', label: 'Other barriers' }
    ]
  },
  {
    id: 'q36_timeline',
    question: 'How urgent is your need for housing?',
    type: 'select',
    required: true,
    options: [
      { value: 'immediate', label: 'Immediate - unsafe situation' },
      { value: 'urgent', label: 'Urgent - within 1 week' },
      { value: 'soon', label: 'Soon - within 1 month' },
      { value: 'flexible', label: 'Flexible - can wait for right fit' }
    ]
  },
  {
    id: 'q37_neighborhood',
    question: 'Do you need to stay in a specific area?',
    description: 'e.g., near job, family, medical care',
    type: 'textarea',
    required: false,
    placeholder: 'Optional - describe any location requirements'
  },
  {
    id: 'q38_support_system',
    question: 'Do you have family or friends who can help?',
    type: 'select',
    required: true,
    options: [
      { value: 'yes_local', label: 'Yes, in the local area' },
      { value: 'yes_elsewhere', label: 'Yes, but not locally' },
      { value: 'limited', label: 'Limited support' },
      { value: 'none', label: 'No support system' }
    ]
  },
  {
    id: 'q39_goals',
    question: 'What are your goals for the next 6 months?',
    description: 'This helps us create a plan that works for you',
    type: 'textarea',
    required: false,
    placeholder: 'e.g., Find stable housing, get a job, address health issues, etc.'
  },
  {
    id: 'q40_additional',
    question: 'Is there anything else we should know?',
    description: 'Any additional information that would help us assist you',
    type: 'textarea',
    required: false,
    placeholder: 'Optional - share anything else that might be helpful'
  }
]