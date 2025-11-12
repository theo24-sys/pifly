import { WORLD_SCENES } from './scenes';

export const generateWorldFromVoice = (prompt: string) => {
  const lower = prompt.toLowerCase().trim();

  for (const [key, scene] of Object.entries(WORLD_SCENES)) {
    if (lower.includes(key.replace(/ /g, ''))) return scene;
  }

  const keywords: Record<string, string> = {
    beach: 'sunset beach',
    paris: 'paris night',
    dinner: 'candle dinner',
    forest: 'rainforest',
    stars: 'northern lights',
    cherry: 'cherry blossom',
    mountain: 'mountain lake',
    balloon: 'hot air balloon',
    safari: 'safari sunset',
    underwater: 'underwater',
    space: 'space station',
    cabin: 'cozy cabin',
    library: 'library',
    picnic: 'picnic',
    campfire: 'campfire',
    'new year': 'new year',
    birthday: 'birthday',
    valentine: 'valentine',
    christmas: 'christmas',
  };

  for (const [word, sceneKey] of Object.entries(keywords)) {
    if (lower.includes(word)) return WORLD_SCENES[sceneKey];
  }

  return WORLD_SCENES['sunset beach'];
};