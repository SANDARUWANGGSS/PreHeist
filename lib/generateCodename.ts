const ADJECTIVES: readonly string[] = [
  'Swift',
  'Silent',
  'Phantom',
  'Rogue',
  'Cunning',
  'Nimble',
  'Daring',
  'Elusive',
  'Brazen',
  'Covert',
  'Wily',
  'Slick',
  'Veiled',
  'Agile',
  'Sleek',
  'Shadowed',
  'Bold',
  'Stealthy',
]

const MODIFIERS: readonly string[] = [
  'Shadow',
  'Crimson',
  'Iron',
  'Midnight',
  'Cobalt',
  'Silver',
  'Onyx',
  'Scarlet',
  'Ember',
  'Chrome',
  'Obsidian',
  'Steel',
  'Copper',
  'Neon',
  'Azure',
  'Gilt',
  'Ashen',
  'Amber',
]

const ROLES: readonly string[] = [
  'Fox',
  'Cipher',
  'Ghost',
  'Raven',
  'Viper',
  'Specter',
  'Wolf',
  'Lynx',
  'Jackal',
  'Shade',
  'Falcon',
  'Wraith',
  'Drifter',
  'Broker',
  'Sentinel',
  'Nomad',
  'Courier',
  'Hawk',
]

function pick(list: readonly string[]): string {
  return list[Math.floor(Math.random() * list.length)]
}

export function generateCodename(): string {
  return pick(ADJECTIVES) + pick(MODIFIERS) + pick(ROLES)
}
