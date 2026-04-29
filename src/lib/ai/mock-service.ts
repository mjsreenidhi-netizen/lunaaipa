import type {
  AIInsight,
  AIServiceInterface,
  AICycleAnalysis,
  CyclePhase,
} from "@/types/ai";
import type { Realm } from "@/types/realm";
import {
  calculateCyclePhase,
  getDayOfCycle,
  getDaysUntilNextPeriod,
} from "@/lib/utils/date";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(): Promise<void> {
  return delay(500 + Math.random() * 1000);
}

const PHASE_DESCRIPTIONS: Record<CyclePhase, string> = {
  menstrual:
    "Your body is releasing the uterine lining. Rest, gentle movement, and warmth support you now.",
  follicular:
    "Rising estrogen brings increasing energy and clarity. A great time for new projects and social connection.",
  ovulatory:
    "Peak energy and communication skills. Your most magnetic and expressive phase.",
  luteal:
    "Progesterone rises, bringing introspective energy. Great for detail work and completing projects.",
};

const ENERGY_LEVELS: Record<CyclePhase, AICycleAnalysis["energyLevel"]> = {
  menstrual: "low",
  follicular: "moderate",
  ovulatory: "very-high",
  luteal: "high",
};

const PRODUCTIVITY_TIPS: Record<CyclePhase, string[]> = {
  menstrual: [
    "Schedule low-stakes administrative tasks today",
    "Review and reflect on completed projects",
    "Plan your upcoming month with gentle intention",
    "Avoid high-pressure meetings if possible",
    "Use this time for research and reading",
  ],
  follicular: [
    "Pitch new ideas — your creativity is building",
    "Schedule brainstorming sessions this week",
    "Start that project you've been putting off",
    "Network and reconnect with colleagues",
    "Learn a new skill or take on a challenge",
  ],
  ovulatory: [
    "This is your peak time for presentations and public speaking",
    "Schedule important meetings and negotiations",
    "Lead collaborative discussions and team initiatives",
    "Take on high-visibility projects",
    "Your persuasion skills are at their strongest",
  ],
  luteal: [
    "Focus on deep, detail-oriented work",
    "Edit, refine, and polish existing projects",
    "Handle tasks requiring concentration and analysis",
    "Set clear boundaries and communicate needs",
    "Wrap up loose ends before your next cycle",
  ],
};

const WELLNESS_TIPS: Record<CyclePhase, string[]> = {
  menstrual: [
    "Prioritize rest and sleep — your body is working hard",
    "Try gentle yoga or stretching instead of intense workouts",
    "Nourish yourself with iron-rich foods like lentils and leafy greens",
    "Apply warmth to cramps with a heating pad",
    "Honor your need for solitude and introspection",
  ],
  follicular: [
    "Try higher intensity workouts as energy builds",
    "Experiment with new recipes and foods",
    "Spend time in nature to boost your naturally rising mood",
    "Start a new wellness practice or habit",
    "Your skin is clearing — a great time for a natural glow routine",
  ],
  ovulatory: [
    "Channel your high energy into HIIT or dance",
    "Socialize and connect — you're naturally magnetic now",
    "Focus on foods rich in antioxidants and fiber",
    "Practice gratitude — your emotional highs are real",
    "Try something adventurous that excites you",
  ],
  luteal: [
    "Shift to moderate exercise like swimming or cycling",
    "Reduce caffeine and alcohol to minimize PMS symptoms",
    "Increase magnesium-rich foods like dark chocolate and nuts",
    "Practice extra self-compassion as emotions intensify",
    "Prepare your space for your upcoming menstrual phase",
  ],
};

const WORK_INSIGHTS: AIInsight[] = [
  {
    id: "work-1",
    content:
      "Your cycle phase influences your cognitive strengths. Align your tasks with your natural rhythm for peak performance.",
    type: "insight",
    realm: "work",
  },
  {
    id: "work-2",
    content:
      "Tracking your energy patterns helps you schedule your most demanding work when you're naturally at your best.",
    type: "tip",
    realm: "work",
  },
  {
    id: "work-3",
    content:
      "Communication skills vary throughout your cycle. Plan important conversations strategically.",
    type: "insight",
    realm: "work",
  },
];

const PERSONAL_INSIGHTS: AIInsight[] = [
  {
    id: "personal-1",
    content:
      "Understanding your cycle is a powerful form of self-knowledge. Each phase offers unique gifts.",
    type: "encouragement",
    realm: "personal",
  },
  {
    id: "personal-2",
    content:
      "Your body communicates through symptoms. Tracking them reveals patterns that guide your wellbeing.",
    type: "insight",
    realm: "personal",
  },
  {
    id: "personal-3",
    content:
      "Rest is not laziness — it's a vital part of your cycle that enables the creativity and energy to come.",
    type: "encouragement",
    realm: "personal",
  },
];

class MockAIService implements AIServiceInterface {
  async analyzeCycleData(userData: {
    cycleLength: number;
    periodDuration: number;
    lastPeriodDate?: string;
  }): Promise<AICycleAnalysis> {
    await randomDelay();

    const lastPeriod = userData.lastPeriodDate
      ? new Date(userData.lastPeriodDate)
      : new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const dayOfCycle = getDayOfCycle(lastPeriod, userData.cycleLength);
    const currentPhase = calculateCyclePhase(
      dayOfCycle,
      userData.cycleLength,
      userData.periodDuration
    );
    const daysUntilNextPeriod = getDaysUntilNextPeriod(
      dayOfCycle,
      userData.cycleLength
    );

    return {
      currentPhase,
      dayOfCycle,
      daysUntilNextPeriod,
      phaseDescription: PHASE_DESCRIPTIONS[currentPhase],
      energyLevel: ENERGY_LEVELS[currentPhase],
      recommendations: WELLNESS_TIPS[currentPhase].slice(0, 3),
    };
  }

  async getDailyInsights(userId: string, realm: Realm): Promise<AIInsight[]> {
    await randomDelay();
    void userId;

    const insights = realm === "work" ? WORK_INSIGHTS : PERSONAL_INSIGHTS;
    return insights.slice(0, 2);
  }

  async generateProductivityTips(phase: CyclePhase): Promise<string[]> {
    await randomDelay();
    return PRODUCTIVITY_TIPS[phase];
  }

  async generateWellnessTips(phase: CyclePhase): Promise<string[]> {
    await randomDelay();
    return WELLNESS_TIPS[phase];
  }

  async getChatResponse(messages: { role: "user" | "ai"; content: string }[]): Promise<string> {
    await randomDelay();
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) return "I am here for you.";
    
    const text = lastUserMessage.content.toLowerCase();
    if (text.includes("tired") || text.includes("exhausted")) {
        return "It is completely natural to feel drained right now. The moon herself waxes and wanes. Give yourself permission to wane. What is one small way you can rest today?";
    }
    if (text.includes("pain") || text.includes("cramps")) {
        return "I'm so sorry you're experiencing discomfort. Focus on warmth, gentle breathing, and rest. I recommend brewing some ginger or chamomile tea.";
    }
    return "I hear you. The phases you move through are powerful. What else is on your mind, Daughter of the Moon?";
  }
}

export const mockAIService = new MockAIService();
export { PHASE_DESCRIPTIONS, ENERGY_LEVELS };
