export const getSeasonHint = (): { emoji: string; text: string; zones: string[] } => {
  const m = new Date().getMonth(); // 0 = январь … 11 = декабрь
  if (m >= 2 && m <= 4)  return { emoji: '🌸', text: 'Весна — самое время для дел по дому', zones: ['kitchen', 'bedroom'] };
  if (m >= 5 && m <= 7)  return { emoji: '☀️', text: 'Лето — лёгкие активные дела', zones: ['hobby', 'health'] };
  if (m >= 8 && m <= 10) return { emoji: '🍂', text: 'Осень — уютные дела', zones: ['living_room', 'digital'] };
  return { emoji: '❄️', text: 'Зима — разбери цифровые завалы', zones: ['digital', 'finance'] };
};