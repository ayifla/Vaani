import { SemanticScenario, ToneOption } from '../types';

export const SEMANTIC_SCENARIOS: SemanticScenario[] = [
  {
    id: 'school-health',
    title: 'School Absence Notice',
    contextTag: 'Classroom & Health',
    registerName: 'Polite Student Register',
    concepts: ["can't", "class", "today", "stomach ache"],
    literalOutput: "Can't class today stomach ache.",
    literalCritique: "Robotic and telegraphic; strips away natural conversational syntax, social courtesy, and causality.",
    reconstructedSentence: "I can't come to class today because I have a stomach ache.",
    linguisticHighlights: [
      "Restored implied first-person subject pronoun ('I')",
      "Synthesized causal relation ('because') from situational intent",
      "Structured temporal clause ('today') into fluid syntax"
    ],
    voiceTone: 'Warm Alto',
    audioDurationSec: 3.2
  },
  {
    id: 'casual-coffee',
    title: 'Meeting a Friend',
    contextTag: 'Social Invitation',
    registerName: 'Casual & Friendly',
    concepts: ['tomorrow', 'free', 'coffee', 'want'],
    literalOutput: 'Tomorrow free coffee want.',
    literalCritique: 'Lacks grammatical interrogative inversion and conversational warmth expected in an invitation.',
    reconstructedSentence: "Are you free tomorrow? Would you like to grab coffee?",
    linguisticHighlights: [
      "Inferred question inflection from raised eyebrow facial grammar",
      "Restored conversational idiomatic phrase ('grab coffee')",
      "Balanced two-part social rhythm: availability check + polite proposition"
    ],
    voiceTone: 'Friendly Mezzo',
    audioDurationSec: 2.8
  },
  {
    id: 'traffic-delay',
    title: 'Running Late',
    contextTag: 'Workplace & Courtesy',
    registerName: 'Courteous Update',
    concepts: ['traffic', 'heavy', 'stuck', '10 minute', 'sorry'],
    literalOutput: 'Traffic heavy stuck 10 minute sorry.',
    literalCritique: 'Sounds abrupt and strained instead of considerate and professional.',
    reconstructedSentence: "Sorry, I'm caught in heavy traffic and will be about 10 minutes late.",
    linguisticHighlights: [
      "Fronted apology marker ('Sorry,') for natural empathy",
      "Converted duration concept ('10 minute') into estimated arrival nuance ('about 10 minutes late')",
      "Conjoined compound state ('caught in heavy traffic and will be...')"
    ],
    voiceTone: 'Calm Baritone',
    audioDurationSec: 3.4
  },
  {
    id: 'gratitude-help',
    title: 'Expressing Appreciation',
    contextTag: 'Collaboration & Thanks',
    registerName: 'Warm Gratitude',
    concepts: ['help', 'project', 'thank', 'heart', 'much'],
    literalOutput: 'Help project thank heart much.',
    literalCritique: 'Loses the emotional depth and personal inflection carried by the two-handed heart-touch gesture.',
    reconstructedSentence: "Thank you so much for all your help with the project; it truly means a lot to me.",
    linguisticHighlights: [
      "Interpreted chest placement gesture as genuine personal sentiment ('truly means a lot')",
      "Synthesized respectful gratitude register",
      "Elevated mechanical keywords into heartfelt conversational English"
    ],
    voiceTone: 'Expressive Alto',
    audioDurationSec: 3.6
  }
];

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: 'warm-polite',
    name: 'Polite & Warm',
    description: 'Courteous register suitable for school, work, and formal conversations',
    speechPitch: 1.0,
    speechRate: 0.95
  },
  {
    id: 'casual-friendly',
    name: 'Casual & Expressive',
    description: 'Relaxed, conversational flow for friends, family, and peers',
    speechPitch: 1.05,
    speechRate: 1.02
  },
  {
    id: 'direct-concise',
    name: 'Direct & Clear',
    description: 'Focused and economical structure prioritizing quick clarity',
    speechPitch: 0.95,
    speechRate: 1.05
  }
];
