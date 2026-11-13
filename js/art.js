// Grumpa portrait, matured from his Lucia's-game avatar: white hair parted to the side,
// round dark-framed glasses, hook nose, fair skin, a squarer and blockier build.
// Outfits change with the era so his dress can teach.

const SKIN = '#f3d3bd';
const SKIN_SHADE = '#e2b79c';
const HAIR = '#f7f5f0';
const HAIR_LINE = '#cfcac0';
const FRAME = '#2b2a2e';

const OUTFITS = {
  study: (w) => `
    <path d="M20 236 L24 176 Q26 158 66 152 L100 166 L134 152 Q174 158 176 176 L180 236 Z" fill="#30476b"/>
    <path d="M78 156 L100 186 L122 156 L114 152 L100 170 L86 152 Z" fill="#eef0f2"/>
    <path d="M86 152 L100 170 L114 152" fill="none" stroke="#c9ced6" stroke-width="2"/>
    <path d="M52 200 Q58 218 56 236 M148 200 Q142 218 144 236" stroke="#253a59" stroke-width="3" fill="none"/>`,
  'samnite-elder': (w) => `
    <path d="M20 236 L24 178 Q26 158 66 152 L100 160 L134 152 Q174 158 176 178 L180 236 Z" fill="#ebe3d0"/>
    <path d="M84 156 Q100 170 116 156" fill="none" stroke="#c9bfa6" stroke-width="2.5"/>
    <path d="M30 236 L38 180 Q46 160 72 155 Q60 190 78 236 Z" fill="#8a3b26"/>
    <path d="M70 155 Q110 168 150 166 Q160 172 164 182 Q120 190 76 172 Z" fill="#8a3b26"/>
    <circle cx="150" cy="170" r="7" fill="#b98a3e" stroke="#7a5a22" stroke-width="2"/>
    <path d="M144 170 h12" stroke="#7a5a22" stroke-width="2"/>`,
  senator: (w) => `
    <path d="M20 236 L24 178 Q26 158 66 152 L100 160 L134 152 Q174 158 176 178 L180 236 Z" fill="#f4f1ea"/>
    <rect x="76" y="160" width="10" height="76" fill="#6b2142"/>
    <rect x="114" y="160" width="10" height="76" fill="#6b2142"/>
    <g transform="translate(200 0) scale(-1 1)">
      <path d="M30 236 L36 184 Q44 160 70 155 Q96 176 132 236 Z" fill="#fbf9f4" stroke="#ddd6c8" stroke-width="2"/>
      <path d="M52 196 Q80 206 104 232 M44 214 Q64 220 80 236" stroke="#ddd6c8" stroke-width="2" fill="none"/>
    </g>`
};

export function grumpa(outfit = 'study', { size = 200, label = 'Grumpa' } = {}) {
  const body = (OUTFITS[outfit] || OUTFITS.study)();
  return `<svg class="grumpa" viewBox="0 0 200 240" width="${size}" height="${size * 1.2}" role="img" aria-label="${label}">
  ${body}
  <rect x="86" y="128" width="28" height="30" fill="${SKIN_SHADE}"/>
  <rect x="58" y="34" width="84" height="104" rx="26" fill="${SKIN}"/>
  <path d="M58 100 Q60 132 92 138 L108 138 Q140 132 142 100 L142 112 Q138 140 100 142 Q62 140 58 112 Z" fill="${SKIN_SHADE}" opacity=".55"/>
  <rect x="50" y="78" width="12" height="26" rx="6" fill="${SKIN_SHADE}"/>
  <rect x="138" y="78" width="12" height="26" rx="6" fill="${SKIN_SHADE}"/>
  <path d="M56 80 Q52 38 82 28 Q106 20 128 28 Q148 38 146 74 Q140 54 124 48 Q108 44 92 46 Q70 50 64 64 Q60 70 56 80 Z" fill="${HAIR}" stroke="${HAIR_LINE}" stroke-width="1.5"/>
  <path d="M56 74 Q52 92 58 100 L62 98 Q58 88 62 76 Z M144 70 Q148 92 142 100 L138 98 Q142 86 138 72 Z" fill="${HAIR}" stroke="${HAIR_LINE}" stroke-width="1.2"/>
  <path d="M84 32 Q80 40 82 47" stroke="${HAIR_LINE}" stroke-width="2" fill="none"/>
  <path d="M92 46 Q116 34 146 62" stroke="${HAIR_LINE}" stroke-width="1.6" fill="none"/>
  <path d="M70 76 Q80 70 90 75" stroke="#b9b3a8" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M110 75 Q120 70 130 76" stroke="#b9b3a8" stroke-width="5" stroke-linecap="round" fill="none"/>
  <circle cx="81" cy="88" r="3.4" fill="#2a2420"/>
  <circle cx="119" cy="88" r="3.4" fill="#2a2420"/>
  <g fill="#ffffff33" stroke="${FRAME}" stroke-width="3.2">
    <circle cx="81" cy="88" r="12"/><circle cx="119" cy="88" r="12"/>
  </g>
  <path d="M93 87 Q100 83 107 87" stroke="${FRAME}" stroke-width="3" fill="none"/>
  <path d="M69 86 L58 82 M131 86 L142 82" stroke="${FRAME}" stroke-width="2.6"/>
  <path d="M98 86 Q102 92 106 100 Q111 109 107 114 Q103 117 98 114" fill="${SKIN_SHADE}" stroke="#c4917a" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M94 113 Q96 117 99 116" stroke="#c4917a" stroke-width="1.4" fill="none"/>
  <path d="M86 124 Q100 130 114 124" stroke="#8f4a3a" stroke-width="2.6" stroke-linecap="round" fill="none"/>
  <path d="M72 108 Q76 116 82 118 M128 108 Q124 116 118 118" stroke="#e0b59d" stroke-width="1.6" fill="none"/>
</svg>`;
}

// Small laurel mark for completed scenes.
export function laurel(size = 28) {
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true">
    <g fill="#6f7d3a">
      <path d="M20 34 Q8 30 7 16" stroke="#6f7d3a" stroke-width="2" fill="none"/>
      <path d="M20 34 Q32 30 33 16" stroke="#6f7d3a" stroke-width="2" fill="none"/>
      <ellipse cx="9" cy="20" rx="2.5" ry="5" transform="rotate(-25 9 20)"/>
      <ellipse cx="11" cy="26" rx="2.5" ry="5" transform="rotate(-50 11 26)"/>
      <ellipse cx="15" cy="31" rx="2.5" ry="5" transform="rotate(-70 15 31)"/>
      <ellipse cx="31" cy="20" rx="2.5" ry="5" transform="rotate(25 31 20)"/>
      <ellipse cx="29" cy="26" rx="2.5" ry="5" transform="rotate(50 29 26)"/>
      <ellipse cx="25" cy="31" rx="2.5" ry="5" transform="rotate(70 25 31)"/>
    </g></svg>`;
}
