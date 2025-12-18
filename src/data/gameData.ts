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

