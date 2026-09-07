export interface ConceptToken {
  id: string;
  word: string;
  tag: string;
  time: string;
  confidence?: number;
}

export interface ReconstructedSentence {
  text: string;
  certainty: string;
  syntacticBridge: string;
  tone: string;
  dialect: string;
  alternates: string[];
}

export interface ConversationExchange {
  id: string;
  time: string;
  tokens: string[];
  sentence: string;
  status: 'buffered' | 'spoken' | 'saved';
  confidence: string;
  category?: 'Campus' | 'Healthcare' | 'Social' | 'General';
}

export interface PracticeWord {
  id: string;
  signName: string;
  category: 'Everyday' | 'Campus' | 'Health' | 'Dining' | 'Social';
  gloss: string;
  handshape: string;
  movement: string;
  exampleSentence: string;
  masteryScore: number;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Female' | 'Male' | 'Neutral';
  tone: string;
  description: string;
}

export interface SimulationScenario {
  key: string;
  buttonLabel: string;
  tokens: ConceptToken[];
  sentence: string;
  certainty: string;
  tone: string;
  bridge: string;
  alternates: string[];
}

export type WebScreen = 'sign-workspace' | 'conversation-history' | 'practice-vocabulary' | 'settings';
export type MobileScreen = 'sign' | 'history' | 'practice' | 'settings';
export type AppMode = 'web' | 'mobile_mockup';
