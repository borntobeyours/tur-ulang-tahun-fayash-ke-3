
export interface HunterPersona {
  stageName: string;
  role: string; // e.g., Main Vocal Slayer, Lead Dancer Duelist
  weapon: string; // e.g., Microphone Scythe, Lightstick Katana
  fashionStyle: string;
  specialMove: string;
  squadPosition: 'Center' | 'Visual' | 'Leader' | 'Maknae';
  auraColor: string;
}

export interface RSVPFormData {
  name: string;
  attending: boolean;
  guests: number;
  message: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

export enum Section {
  HERO = 'hero',
  TOUR = 'tour',
  PERSONA = 'persona',
  GAME = 'game'
}
