// AVA Architect Game Data
// This maps the real AVA system tools and data types

export type ToolCategory =
  | 'user'
  | 'mentorship'
  | 'insights'
  | 'scoring'
  | 'messages'
  | 'surveys'
  | 'churn';

export type DataType =
  | 'teen_profile'
  | 'mentor_profile'
  | 'teen_messages'
  | 'mentor_messages'
  | 'teen_memories'
  | 'survey_responses'
  | 'mood_data'
  | 'mentorship_history'
  | 'engagement_metrics'
  | 'conversation_summary'
  | 'behavioral_patterns'
  | 'risk_signals'
  | 'mentor_scores'
  | 'retention_data';

export interface Tool {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: ToolCategory;
  color: string;
  acceptsData: DataType[];
  icon: string;
}

export interface DataSource {
  id: string;
  type: DataType;
  displayName: string;
  description: string;
  color: string;
  icon: string;
  matchesTools: string[]; // Tool IDs this data works with
}

export interface GameScenario {
  id: string;
  title: string;
  question: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  correctChain: string[]; // Tool IDs in order
  hints: string[];
  points: number;
}

// ============================================
// TOOLS - Based on actual AVA agent tools
// ============================================

export const TOOLS: Tool[] = [
  // User Tools
  {
    id: 'search_users',
    name: 'search_users',
    displayName: 'Search Users',
    description: 'Find users by name, email, or phone',
    category: 'user',
    color: '#00f5ff',
    acceptsData: ['teen_profile', 'mentor_profile'],
    icon: '🔍',
  },
  {
    id: 'get_user_profile',
    name: 'get_user_profile',
    displayName: 'Get User Profile',
    description: 'Get detailed user profile information',
    category: 'user',
    color: '#00f5ff',
    acceptsData: ['teen_profile', 'mentor_profile'],
    icon: '👤',
  },
  {
    id: 'get_teen_memories',
    name: 'get_teen_memories',
    displayName: 'Get Teen Memories',
    description: 'Get AI-stored memories about a teen',
    category: 'user',
    color: '#00f5ff',
    acceptsData: ['teen_memories', 'behavioral_patterns'],
    icon: '🧠',
  },
  {
    id: 'search_teen_memories',
    name: 'search_teen_memories',
    displayName: 'Search Memories',
    description: 'Semantic search through teen memories',
    category: 'user',
    color: '#00f5ff',
    acceptsData: ['teen_memories'],
    icon: '💭',
  },

  // Mentorship Tools
  {
    id: 'get_mentorships_by_teen',
    name: 'get_mentorships_by_teen',
    displayName: 'Teen Mentorships',
    description: 'Get current and past mentorships for a teen',
    category: 'mentorship',
    color: '#ff00ff',
    acceptsData: ['mentorship_history', 'teen_profile'],
    icon: '💜',
  },
  {
    id: 'get_mentorships_by_mentor',
    name: 'get_mentorships_by_mentor',
    displayName: 'Mentor Mentorships',
    description: 'Get all mentorships for a mentor',
    category: 'mentorship',
    color: '#ff00ff',
    acceptsData: ['mentorship_history', 'mentor_profile'],
    icon: '👥',
  },
  {
    id: 'get_mentorship_details',
    name: 'get_mentorship_details',
    displayName: 'Mentorship Details',
    description: 'Get detailed mentorship info with conversation',
    category: 'mentorship',
    color: '#ff00ff',
    acceptsData: ['mentorship_history', 'conversation_summary'],
    icon: '📋',
  },

  // Insights Tools
  {
    id: 'get_teen_insights',
    name: 'get_teen_insights',
    displayName: 'Teen Insights',
    description: 'AI-generated daily insights and engagement status',
    category: 'insights',
    color: '#00ff88',
    acceptsData: ['engagement_metrics', 'behavioral_patterns', 'risk_signals'],
    icon: '📊',
  },
  {
    id: 'get_insights_by_engagement',
    name: 'get_insights_by_engagement_status',
    displayName: 'Filter by Engagement',
    description: 'Find teens by engagement status',
    category: 'insights',
    color: '#00ff88',
    acceptsData: ['engagement_metrics'],
    icon: '🎯',
  },
  {
    id: 'get_insights_needing_followup',
    name: 'get_insights_needing_followup',
    displayName: 'Needs Follow-up',
    description: 'Get teens needing immediate attention',
    category: 'insights',
    color: '#00ff88',
    acceptsData: ['risk_signals', 'engagement_metrics'],
    icon: '⚠️',
  },
  {
    id: 'find_similar_insights',
    name: 'find_similar_insights',
    displayName: 'Similar Insights',
    description: 'Find similar patterns using vector search',
    category: 'insights',
    color: '#00ff88',
    acceptsData: ['behavioral_patterns'],
    icon: '🔗',
  },

  // Message Tools
  {
    id: 'get_recent_messages',
    name: 'get_recent_messages',
    displayName: 'Recent Messages',
    description: 'Get recent conversation messages',
    category: 'messages',
    color: '#a855f7',
    acceptsData: ['teen_messages', 'mentor_messages', 'conversation_summary'],
    icon: '💬',
  },
  {
    id: 'get_chat_history',
    name: 'get_chat_history',
    displayName: 'Chat History',
    description: 'Get full chat history with filtering',
    category: 'messages',
    color: '#a855f7',
    acceptsData: ['teen_messages', 'mentor_messages'],
    icon: '📜',
  },
  {
    id: 'find_similar_messages',
    name: 'find_similar_messages',
    displayName: 'Similar Messages',
    description: 'Semantic search for similar messages',
    category: 'messages',
    color: '#a855f7',
    acceptsData: ['teen_messages', 'mentor_messages'],
    icon: '🔎',
  },
  {
    id: 'get_conversation_summary',
    name: 'get_conversation_summary',
    displayName: 'Conversation Summary',
    description: 'AI-generated conversation summary',
    category: 'messages',
    color: '#a855f7',
    acceptsData: ['conversation_summary'],
    icon: '📝',
  },

  // Survey Tools
  {
    id: 'get_user_survey_history',
    name: 'get_user_survey_history',
    displayName: 'Survey History',
    description: 'Get paginated survey history',
    category: 'surveys',
    color: '#14b8a6',
    acceptsData: ['survey_responses', 'mood_data'],
    icon: '📋',
  },
  {
    id: 'get_survey_content',
    name: 'get_survey_content',
    displayName: 'Survey Content',
    description: 'Get detailed survey answers',
    category: 'surveys',
    color: '#14b8a6',
    acceptsData: ['survey_responses'],
    icon: '📄',
  },
  {
    id: 'get_recent_survey_trends',
    name: 'get_recent_survey_trends',
    displayName: 'Survey Trends',
    description: 'Analyze recent behavioral trends',
    category: 'surveys',
    color: '#14b8a6',
    acceptsData: ['mood_data', 'behavioral_patterns'],
    icon: '📈',
  },

  // Scoring Tools
  {
    id: 'get_mentor_score',
    name: 'get_mentor_score',
    displayName: 'Mentor Score',
    description: 'Get mentor performance scoring',
    category: 'scoring',
    color: '#eab308',
    acceptsData: ['mentor_scores', 'mentor_profile'],
    icon: '⭐',
  },
  {
    id: 'compare_mentors',
    name: 'compare_mentors',
    displayName: 'Compare Mentors',
    description: 'Compare multiple mentor scores',
    category: 'scoring',
    color: '#eab308',
    acceptsData: ['mentor_scores'],
    icon: '⚖️',
  },
  {
    id: 'get_top_mentors',
    name: 'get_top_mentors_by_score',
    displayName: 'Top Mentors',
    description: 'Get highest performing mentors',
    category: 'scoring',
    color: '#eab308',
    acceptsData: ['mentor_scores', 'retention_data'],
    icon: '🏆',
  },

  // Churn Tools
  {
    id: 'get_churn_risk',
    name: 'get_churn_risk_teens',
    displayName: 'Churn Risk',
    description: 'Identify teens at risk of churning',
    category: 'churn',
    color: '#ef4444',
    acceptsData: ['risk_signals', 'engagement_metrics', 'retention_data'],
    icon: '🚨',
  },
];

// ============================================
// DATA SOURCES
// ============================================

export const DATA_SOURCES: DataSource[] = [
  {
    id: 'teen_profile',
    type: 'teen_profile',
    displayName: 'Teen Profile',
    description: 'Basic teen user information',
    color: '#00f5ff',
    icon: '👦',
    matchesTools: ['search_users', 'get_user_profile', 'get_mentorships_by_teen'],
  },
  {
    id: 'mentor_profile',
    type: 'mentor_profile',
    displayName: 'Mentor Profile',
    description: 'Basic mentor user information',
    color: '#00f5ff',
    icon: '👩‍🏫',
    matchesTools: ['search_users', 'get_user_profile', 'get_mentorships_by_mentor', 'get_mentor_score'],
  },
  {
    id: 'teen_messages',
    type: 'teen_messages',
    displayName: 'Teen Messages',
    description: 'Messages sent by teens',
    color: '#a855f7',
    icon: '💬',
    matchesTools: ['get_recent_messages', 'get_chat_history', 'find_similar_messages'],
  },
  {
    id: 'mentor_messages',
    type: 'mentor_messages',
    displayName: 'Mentor Messages',
    description: 'Messages sent by mentors',
    color: '#a855f7',
    icon: '📨',
    matchesTools: ['get_recent_messages', 'get_chat_history', 'find_similar_messages'],
  },
  {
    id: 'teen_memories',
    type: 'teen_memories',
    displayName: 'Teen Memories',
    description: 'AI-stored teen context',
    color: '#00f5ff',
    icon: '🧠',
    matchesTools: ['get_teen_memories', 'search_teen_memories'],
  },
  {
    id: 'survey_responses',
    type: 'survey_responses',
    displayName: 'Survey Responses',
    description: 'Clinical survey answers',
    color: '#14b8a6',
    icon: '📝',
    matchesTools: ['get_user_survey_history', 'get_survey_content'],
  },
  {
    id: 'mood_data',
    type: 'mood_data',
    displayName: 'Mood Data',
    description: 'Mood survey results',
    color: '#14b8a6',
    icon: '😊',
    matchesTools: ['get_user_survey_history', 'get_recent_survey_trends'],
  },
  {
    id: 'mentorship_history',
    type: 'mentorship_history',
    displayName: 'Mentorship History',
    description: 'Past and current mentorships',
    color: '#ff00ff',
    icon: '📚',
    matchesTools: ['get_mentorships_by_teen', 'get_mentorships_by_mentor', 'get_mentorship_details'],
  },
  {
    id: 'engagement_metrics',
    type: 'engagement_metrics',
    displayName: 'Engagement Metrics',
    description: 'Daily engagement status',
    color: '#00ff88',
    icon: '📊',
    matchesTools: ['get_teen_insights', 'get_insights_by_engagement', 'get_insights_needing_followup', 'get_churn_risk'],
  },
  {
    id: 'conversation_summary',
    type: 'conversation_summary',
    displayName: 'Conversation Summary',
    description: 'AI summary of conversations',
    color: '#a855f7',
    icon: '📋',
    matchesTools: ['get_mentorship_details', 'get_recent_messages', 'get_conversation_summary'],
  },
  {
    id: 'behavioral_patterns',
    type: 'behavioral_patterns',
    displayName: 'Behavioral Patterns',
    description: 'Detected behavior trends',
    color: '#00ff88',
    icon: '🔄',
    matchesTools: ['get_teen_memories', 'get_teen_insights', 'find_similar_insights', 'get_recent_survey_trends'],
  },
  {
    id: 'risk_signals',
    type: 'risk_signals',
    displayName: 'Risk Signals',
    description: 'Warning indicators',
    color: '#ef4444',
    icon: '⚠️',
    matchesTools: ['get_teen_insights', 'get_insights_needing_followup', 'get_churn_risk'],
  },
  {
    id: 'mentor_scores',
    type: 'mentor_scores',
    displayName: 'Mentor Scores',
    description: 'Performance metrics',
    color: '#eab308',
    icon: '⭐',
    matchesTools: ['get_mentor_score', 'compare_mentors', 'get_top_mentors'],
  },
  {
    id: 'retention_data',
    type: 'retention_data',
    displayName: 'Retention Data',
    description: 'Teen retention statistics',
    color: '#eab308',
    icon: '📈',
    matchesTools: ['get_top_mentors', 'get_churn_risk'],
  },
];

// ============================================
// GAME SCENARIOS - Chain Building Mode
// ============================================

export const SCENARIOS: GameScenario[] = [
  // EASY SCENARIOS (3 tools)
  {
    id: 'scenario_1',
    title: 'At-Risk Teen Check',
    question: 'A teen named Alex seems disengaged. How do you investigate?',
    description: 'Build the tool chain to investigate a potentially at-risk teen',
    difficulty: 'easy',
    correctChain: ['search_users', 'get_teen_insights', 'get_recent_messages'],
    hints: [
      'First, find the teen in the system',
      'Check their engagement status',
      'Look at recent communication',
    ],
    points: 100,
  },
  {
    id: 'scenario_5',
    title: 'Quick Wellness Check',
    question: 'Check how a specific teen is doing emotionally this week',
    description: 'Simple wellness assessment for a known teen',
    difficulty: 'easy',
    correctChain: ['get_user_profile', 'get_user_survey_history', 'get_recent_survey_trends'],
    hints: [
      'Start with who they are',
      'Look at their survey history',
      'Check recent trends',
    ],
    points: 100,
  },
  {
    id: 'scenario_6',
    title: 'Mentor Lookup',
    question: 'Find out how many teens a specific mentor is currently helping',
    description: 'Basic mentor capacity check',
    difficulty: 'easy',
    correctChain: ['search_users', 'get_mentorships_by_mentor', 'get_mentorship_details'],
    hints: [
      'Find the mentor first',
      'Get their mentorship list',
      'Look at the details',
    ],
    points: 100,
  },
  {
    id: 'scenario_7',
    title: 'Message History',
    question: 'Review the recent conversation between a teen and their mentor',
    description: 'Simple conversation review',
    difficulty: 'easy',
    correctChain: ['get_mentorships_by_teen', 'get_recent_messages', 'get_conversation_summary'],
    hints: [
      'Find the mentorship first',
      'Get recent messages',
      'Summarize the conversation',
    ],
    points: 100,
  },
  {
    id: 'scenario_8',
    title: 'Engagement Status',
    question: 'Find all teens currently flagged as "concerning"',
    description: 'Quick engagement filter',
    difficulty: 'easy',
    correctChain: ['get_insights_by_engagement', 'get_teen_insights', 'get_recent_messages'],
    hints: [
      'Filter by engagement status',
      'Get details on those teens',
      'Check their communications',
    ],
    points: 100,
  },

  // MEDIUM SCENARIOS (4 tools)
  {
    id: 'scenario_2',
    title: 'Mentor Performance Review',
    question: 'Compare our top mentors and understand what makes them successful',
    description: 'Build a chain to analyze mentor performance',
    difficulty: 'medium',
    correctChain: ['get_top_mentors', 'get_mentor_score', 'get_mentorships_by_mentor', 'get_recent_messages'],
    hints: [
      'Start with who performs best',
      'Dig into their specific metrics',
      'Look at their relationships',
      'Analyze their communication style',
    ],
    points: 200,
  },
  {
    id: 'scenario_4',
    title: 'New Mentor Matching',
    question: 'A teen needs a new mentor. How do you find the best match?',
    description: 'Find the optimal mentor for a specific teen',
    difficulty: 'medium',
    correctChain: ['get_user_profile', 'get_teen_memories', 'get_top_mentors', 'get_mentorships_by_mentor'],
    hints: [
      'Understand the teen first',
      'What do we know about them?',
      'Who are our best mentors?',
      'Check mentor capacity',
    ],
    points: 200,
  },
  {
    id: 'scenario_9',
    title: 'Behavioral Change Detection',
    question: 'A parent reports their teen seems different lately. Investigate.',
    description: 'Track behavioral changes over time',
    difficulty: 'medium',
    correctChain: ['search_users', 'get_user_survey_history', 'get_recent_survey_trends', 'get_teen_insights'],
    hints: [
      'Find the teen',
      'Look at their survey history',
      'Check for recent changes',
      'Get current engagement insights',
    ],
    points: 200,
  },
  {
    id: 'scenario_10',
    title: 'Mentorship Health Check',
    question: 'Evaluate if a specific mentorship relationship is working well',
    description: 'Comprehensive mentorship assessment',
    difficulty: 'medium',
    correctChain: ['get_mentorship_details', 'get_recent_messages', 'get_teen_insights', 'get_mentor_score'],
    hints: [
      'Get the mentorship details',
      'Review their communication',
      'Check teen engagement',
      'Evaluate mentor performance',
    ],
    points: 200,
  },
  {
    id: 'scenario_11',
    title: 'Weekly Team Report',
    question: 'Prepare a summary of teens needing attention this week',
    description: 'Generate a weekly priority list',
    difficulty: 'medium',
    correctChain: ['get_insights_needing_followup', 'get_insights_by_engagement', 'get_teen_insights', 'get_churn_risk'],
    hints: [
      'Who needs follow-up?',
      'Filter by engagement level',
      'Get individual details',
      'Assess churn risk',
    ],
    points: 200,
  },
  {
    id: 'scenario_12',
    title: 'Communication Pattern Analysis',
    question: 'Find teens whose messaging patterns have changed significantly',
    description: 'Detect communication anomalies',
    difficulty: 'medium',
    correctChain: ['get_insights_by_engagement', 'get_mentorships_by_teen', 'get_recent_messages', 'find_similar_messages'],
    hints: [
      'Start with engagement data',
      'Find their mentorship',
      'Check recent messages',
      'Look for patterns',
    ],
    points: 200,
  },
  {
    id: 'scenario_13',
    title: 'Survey Deep Dive',
    question: 'A teen scored low on their latest mood survey. Investigate further.',
    description: 'Detailed survey analysis and context',
    difficulty: 'medium',
    correctChain: ['get_user_profile', 'get_survey_content', 'get_teen_memories', 'get_recent_messages'],
    hints: [
      'Who is this teen?',
      'What did the survey say?',
      'What context do we have?',
      'How are they communicating?',
    ],
    points: 200,
  },

  // HARD SCENARIOS (5+ tools)
  {
    id: 'scenario_3',
    title: 'Crisis Investigation',
    question: 'Multiple teens seem to be struggling. Find patterns and prioritize.',
    description: 'Complex investigation across multiple data sources',
    difficulty: 'hard',
    correctChain: ['get_insights_needing_followup', 'find_similar_insights', 'get_teen_insights', 'get_recent_survey_trends', 'get_churn_risk'],
    hints: [
      'Who needs immediate attention?',
      'Are there common patterns?',
      'Deep dive on individuals',
      'Check behavioral trajectory',
      'Assess overall risk',
    ],
    points: 300,
  },
  {
    id: 'scenario_14',
    title: 'Mentor Burnout Detection',
    question: 'Identify mentors who might be overwhelmed and need support',
    description: 'Proactive mentor wellness check',
    difficulty: 'hard',
    correctChain: ['get_top_mentors', 'get_mentorships_by_mentor', 'get_recent_messages', 'get_mentor_score', 'compare_mentors'],
    hints: [
      'Look at all active mentors',
      'Check their caseload',
      'Review message patterns',
      'Check performance trends',
      'Compare across mentors',
    ],
    points: 300,
  },
  {
    id: 'scenario_15',
    title: 'Retention Risk Analysis',
    question: 'Build a complete picture of our highest churn-risk teens',
    description: 'Comprehensive retention investigation',
    difficulty: 'hard',
    correctChain: ['get_churn_risk', 'get_teen_insights', 'get_mentorships_by_teen', 'get_recent_messages', 'get_recent_survey_trends'],
    hints: [
      'Who is at risk of leaving?',
      'What are their insights?',
      'How is their mentorship?',
      'Review communication',
      'Check behavioral trends',
    ],
    points: 300,
  },
  {
    id: 'scenario_16',
    title: 'Mentorship Transition',
    question: 'A mentor is leaving. Plan the transition for all their mentees.',
    description: 'Complex multi-teen transition planning',
    difficulty: 'hard',
    correctChain: ['get_mentorships_by_mentor', 'get_teen_insights', 'get_teen_memories', 'get_top_mentors', 'get_mentorships_by_mentor'],
    hints: [
      'Find all affected teens',
      'Assess each teen\'s status',
      'Understand their needs',
      'Find available mentors',
      'Check capacity',
    ],
    points: 300,
  },
  {
    id: 'scenario_17',
    title: 'Success Story Research',
    question: 'Find examples of teens who improved dramatically and understand why',
    description: 'Research successful outcomes',
    difficulty: 'hard',
    correctChain: ['get_insights_by_engagement', 'get_user_survey_history', 'get_mentorship_details', 'get_recent_messages', 'get_mentor_score'],
    hints: [
      'Find highly engaged teens',
      'Check their survey progress',
      'Look at their mentorship',
      'Review communication quality',
      'Evaluate mentor impact',
    ],
    points: 300,
  },
  {
    id: 'scenario_18',
    title: 'Pattern Recognition',
    question: 'Find common themes in messages from teens who later disengaged',
    description: 'Historical pattern analysis for prevention',
    difficulty: 'hard',
    correctChain: ['get_churn_risk', 'get_mentorships_by_teen', 'get_chat_history', 'find_similar_messages', 'find_similar_insights'],
    hints: [
      'Identify at-risk teens',
      'Find their mentorships',
      'Get message history',
      'Search for patterns',
      'Look for insight patterns',
    ],
    points: 300,
  },
  {
    id: 'scenario_19',
    title: 'Onboarding Success',
    question: 'Evaluate how well new teens are integrating in their first month',
    description: 'New teen cohort analysis',
    difficulty: 'hard',
    correctChain: ['search_users', 'get_mentorships_by_teen', 'get_recent_messages', 'get_teen_insights', 'get_user_survey_history'],
    hints: [
      'Find new teens',
      'Check their match',
      'Review early communication',
      'Check engagement level',
      'Look at initial surveys',
    ],
    points: 300,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find(t => t.id === id);
}

export function getDataSourceById(id: string): DataSource | undefined {
  return DATA_SOURCES.find(d => d.id === id);
}

export function checkMatch(dataSourceId: string, toolId: string): boolean {
  const dataSource = getDataSourceById(dataSourceId);
  return dataSource?.matchesTools.includes(toolId) ?? false;
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter(t => t.category === category);
}

export function getRandomDataSources(count: number): DataSource[] {
  const shuffled = [...DATA_SOURCES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomTools(count: number): Tool[] {
  const shuffled = [...TOOLS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateMatchRound(difficulty: 'easy' | 'medium' | 'hard'): {
  dataSources: DataSource[];
  tools: Tool[];
  correctMatches: Map<string, string>;
} {
  const pairCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;

  // Pick random data sources
  const dataSources = getRandomDataSources(pairCount);

  // For each data source, pick one of its matching tools
  const usedToolIds = new Set<string>();
  const tools: Tool[] = [];
  const correctMatches = new Map<string, string>();

  for (const ds of dataSources) {
    // Find a tool that matches this data source and hasn't been used
    const availableToolIds = ds.matchesTools.filter(id => !usedToolIds.has(id));
    if (availableToolIds.length > 0) {
      const toolId = availableToolIds[Math.floor(Math.random() * availableToolIds.length)];
      usedToolIds.add(toolId);
      const tool = getToolById(toolId);
      if (tool) {
        tools.push(tool);
        correctMatches.set(ds.id, toolId);
      }
    }
  }

  // Shuffle tools so they're not in order
  const shuffledTools = [...tools].sort(() => Math.random() - 0.5);

  return { dataSources, tools: shuffledTools, correctMatches };
}

