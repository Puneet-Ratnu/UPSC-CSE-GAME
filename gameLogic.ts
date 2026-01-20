import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  xpValue: number;
  category: string;
  type: 'GS' | 'Optional' | 'Essay' | 'Hobby';
};

export type ResourceType = 'Iron Ingot' | 'Fire' | 'Ancient Manuscript' | 'Stardust' | 'Dragon Scale';

export type ItemClass = 'Human' | 'Epic' | 'Legend' | 'Divine' | 'Transcendental';

export type CraftItem = {
  id: string;
  name: string;
  description: string;
  class: ItemClass;
  requirements: { resource: ResourceType; count: number }[];
  isForged: boolean;
};

export type Pet = {
  id: string;
  name: string;
  species: 'Phoenix' | 'Dragon' | 'Griffin' | 'Kitsune' | 'Pegasus';
  level: number;
  xp: number;
  gear: string[];
  decorations: string[];
};

export type UserStats = {
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentStreak: number;
  maxStreak: number;
  tasksCompleted: number;
  unlockedSkins: string[];
  currentSkin: string;
  dailyTaskCount: number;
  weeklyTaskCount: number;
  radarData: {
    GS: number;
    Optional: number;
    Essay: number;
    Mains: number;
    Hobbies: number;
  };
  inventory: Record<ResourceType, number>;
  craftedItems: CraftItem[];
  hiddenRewards: string[];
  pets: Pet[];
  activePetId: string | null;
  lastPetMonthlyReward: string | null; // Date string
};

export const LEVEL_XP_REQ = 100;
export const XP_PER_TASK = 10;
export const TOTAL_GOAL_TASKS = 700;

export const PET_SPECIES = ['Phoenix', 'Dragon', 'Griffin', 'Kitsune', 'Pegasus'] as const;

export const HIDDEN_REWARDS = [
  "Eye of the Storm",
  "Crown of Eternal Focus",
  "Shadow of the Topper",
  "Whisper of the Ancients",
  "Heart of the Phoenix",
  "Scroll of Infinite Knowledge",
  "Void Breaker",
  "Time Weaver's Lens",
  "Soul of the Library",
  "Ascendant's Mantle"
];

export const CRAFT_RECIPES: Omit<CraftItem, 'isForged'>[] = [
  {
    id: '1',
    name: 'Standard Issue Steel Sword',
    description: 'A basic but reliable blade.',
    class: 'Human',
    requirements: [
      { resource: 'Iron Ingot', count: 5 },
      { resource: 'Fire', count: 5 }
    ]
  },
  {
    id: '2',
    name: 'Scholar\'s Enchanted Brush',
    description: 'Moves with a mind of its own.',
    class: 'Epic',
    requirements: [
      { resource: 'Ancient Manuscript', count: 10 },
      { resource: 'Stardust', count: 5 }
    ]
  },
  {
    id: '3',
    name: 'Eternal Flame Grimoire',
    description: 'Contains the secrets of a thousand suns.',
    class: 'Legend',
    requirements: [
      { resource: 'Fire', count: 20 },
      { resource: 'Ancient Manuscript', count: 15 },
      { resource: 'Dragon Scale', count: 5 }
    ]
  },
  {
    id: '4',
    name: 'Aurelian Crown of Focus',
    description: 'Blocks out all worldly distractions.',
    class: 'Divine',
    requirements: [
      { resource: 'Stardust', count: 30 },
      { resource: 'Dragon Scale', count: 15 },
      { resource: 'Fire', count: 25 }
    ]
  },
  {
    id: '5',
    name: 'The Chronos Pendulum',
    description: 'Manipulates the very flow of time.',
    class: 'Transcendental',
    requirements: [
      { resource: 'Iron Ingot', count: 100 },
      { resource: 'Fire', count: 100 },
      { resource: 'Stardust', count: 50 },
      { resource: 'Dragon Scale', count: 50 }
    ]
  }
];

export const INITIAL_STATS: UserStats = {
  level: 1,
  xp: 0,
  xpToNextLevel: LEVEL_XP_REQ,
  currentStreak: 1,
  maxStreak: 1,
  tasksCompleted: 0,
  unlockedSkins: ["Novice Adventurer"],
  currentSkin: "Novice Adventurer",
  dailyTaskCount: 0,
  weeklyTaskCount: 0,
  radarData: {
    GS: 0,
    Optional: 0,
    Essay: 0,
    Mains: 0,
    Hobbies: 0
  },
  inventory: {
    'Iron Ingot': 0,
    'Fire': 0,
    'Ancient Manuscript': 0,
    'Stardust': 0,
    'Dragon Scale': 0
  },
  craftedItems: [],
  hiddenRewards: [],
  pets: [],
  activePetId: null,
  lastPetMonthlyReward: null
};

export const HOBBY_GROUPS = [
  "Learning Languages", "Painting", "Writing Poems", "Reading Manhwas"
];

export const LANGUAGES = ["Chinese", "Japanese", "Urdu", "Spanish"];

export const MILESTONE_REWARDS = [
  { 
    threshold: 150, 
    title: "The Silver Quill", 
    type: "Anecdote", 
    content: "Legend says the first topper wrote their notes with a quill made from a fallen star. Your consistency is starting to shine just as bright.",
    reward: "Cosmic Theme Unlocked"
  },
  { 
    threshold: 300, 
    title: "Guardian's Wisdom", 
    type: "Story", 
    content: "In the depths of the Library of Silence, you find a scroll that whisper-reads itself to you. It speaks of a hero who never missed a Wednesday essay.",
    reward: "Sage Avatar Skin"
  },
  { 
    threshold: 450, 
    title: "The Phoenix Aegis", 
    type: "Surprise", 
    content: "Your determination has summoned the Phoenix. From the ashes of your old habits, a new master of discipline is born.",
    reward: "Double XP Weekend Pass"
  },
  { 
    threshold: 600, 
    title: "Summit's Echo", 
    type: "Legacy", 
    content: "You can hear the cheers from the mountain top. The village below now tells stories of the one who conquered 600 trials.",
    reward: "Legendary Aura Skin"
  }
];

export const SPECIAL_TRIGGERS = [
  { 
    id: "daily_50", 
    threshold: 50, 
    period: "daily", 
    title: "Speed Demon", 
    content: "50 tasks in one day?! Your focus is legendary.", 
    reward: "Secret 'Flash' Badge" 
  },
  { 
    id: "weekly_200", 
    threshold: 200, 
    period: "weekly", 
    title: "Weekly Titan", 
    content: "200 tasks this week. You've outpaced everyone in the village.", 
    reward: "Golden Throne Theme" 
  }
];

export const GS_GROUPS = [
  "Economy", "Polity", "Governance", "IR", "Geography", 
  "Ecology", "Science", "Society", "Internal Security", 
  "Disaster Management", "Ethics"
];

export const OPTIONAL_GROUPS = [
  "Ancient", "Medieval", "Modern", "World", "Historiography"
];

export const STORY_SEGMENTS = [
  { level: 1, text: "Your journey begins in the village of Productivity.", title: "The Beginning" },
  { level: 10, text: "You've packed your bags and left the comfort of home.", title: "Setting Out" },
  { level: 50, text: "The Forest of Procrastination looms ahead.", title: "The Dark Woods" },
  { level: 100, text: "You've established a base camp at the foot of Mount Focus.", title: "Base Camp" },
  { level: 200, text: "The climb is steep, but the view is getting better.", title: " The Ascent" },
  { level: 300, text: "You've found the ancient temple of Flow State.", title: "Ancient Temple" },
  { level: 400, text: "The clouds part, revealing the Summit of Success.", title: "Near the Top" },
  { level: 500, text: "You have conquered the mountain and mastered yourself.", title: "Legendary" },
];

export const AVATAR_UNLOCKS = [
  { level: 1, name: "Novice Adventurer", description: "Ready to start!" },
  { level: 50, name: "Forest Ranger", description: "Master of the woods." },
  { level: 100, name: "Mountain Climber", description: "Scaled the first peak." },
  { level: 200, name: "Temple Guardian", description: "Protector of focus." },
  { level: 300, name: "Cloud Walker", description: "Above the distractions." },
  { level: 500, name: "Productivity Master", description: "The ultimate form." },
];

export function calculateLevelProgress(xp: number) {
  return (xp / LEVEL_XP_REQ) * 100;
}

export function triggerConfetti() {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#FF69B4', '#00FFFF', '#FFFF00', '#ADFF2F', '#FF4500']
  });
}

export function isBossBattleTime() {
  const now = new Date();
  const day = now.getDay();
  if (day !== 3) return false;
  
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const currentUtcMinutes = utcHours * 60 + utcMinutes;
  
  const startUtcMinutes = 6 * 60 + 30;
  const endUtcMinutes = 9 * 60 + 30;
  
  return currentUtcMinutes >= startUtcMinutes && currentUtcMinutes <= endUtcMinutes;
}
