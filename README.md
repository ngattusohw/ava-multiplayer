# 🎮 AVA Architect

A multiplayer puzzle game to help the Somethings team learn how AVA's AI tools work together.

## Game Modes

### 🧠 Data Matcher
Race against time to correctly match data sources to their corresponding AVA tools. Build streaks for bonus points!

- **Easy**: 4 pairs, 45 seconds
- **Medium**: 6 pairs, 60 seconds
- **Hard**: 8 pairs, 90 seconds

### 🏆 Chain Builder
Solve investigation scenarios by building the correct sequence of tool calls. Think like AVA!

- Read the scenario carefully
- Pick tools from the palette
- Arrange them in the right order
- Earn bonus points for perfect chains

## Getting Started

```bash
# Install dependencies
npm install

# Start frontend dev server only (single player)
npm run dev

# Start PartyKit server for multiplayer
npm run dev:party

# Start both at once (recommended)
npm run dev:all

# Build for production
npm run build

# Deploy PartyKit to production
npm run deploy:party
```

## Multiplayer Setup

The multiplayer mode uses **PartyKit** for real-time WebSocket communication.

### Local Development
Run `npm run dev:all` to start both the Vite frontend (port 5173) and PartyKit server (port 1999).

### Production Deployment
1. Deploy PartyKit: `npm run deploy:party`
2. Update the `PARTYKIT_HOST` in `src/hooks/useMultiplayer.ts` with your deployed URL
3. Deploy frontend to Vercel: `vercel`

## Tech Stack

- **React 19** + TypeScript
- **Vite** for blazing fast builds
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **@dnd-kit** for drag and drop

## Game Data

The game uses real AVA tool definitions and data types from the `somethings-api`:

### Tool Categories
- **User Tools**: search_users, get_user_profile, get_teen_memories
- **Mentorship Tools**: get_mentorships_by_teen, get_mentorship_details
- **Insights Tools**: get_teen_insights, get_insights_by_engagement_status
- **Message Tools**: get_recent_messages, find_similar_messages
- **Survey Tools**: get_user_survey_history, get_recent_survey_trends
- **Scoring Tools**: get_mentor_score, compare_mentors
- **Churn Tools**: get_churn_risk_teens

### Data Types
Teen profiles, mentor profiles, messages, memories, surveys, engagement metrics, behavioral patterns, risk signals, and more!

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Future Ideas

- [ ] Real-time multiplayer with PartyKit
- [ ] Leaderboards
- [ ] Custom scenario builder
- [ ] Team vs team mode
- [ ] Learning mode with explanations

---

Built with 💜 for the Somethings team
