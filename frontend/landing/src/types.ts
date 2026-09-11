export type Theme = 'light' | 'dark';

export interface ConceptTag {
  id: string;
  label: string;
  category?: 'verb' | 'noun' | 'time' | 'condition' | 'modifier';
}

export interface SemanticScenario {
  id: string;
  title: string;
  contextTag: string;
  registerName: string;
  concepts: string[];
  literalOutput: string;
  literalCritique: string;
  reconstructedSentence: string;
  linguisticHighlights: string[];
  voiceTone: string;
  audioDurationSec: number;
}

export interface ToneOption {
  id: string;
  name: string;
  description: string;
  speechPitch: number;
  speechRate: number;
}
