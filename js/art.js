/* ──────────────────────────────────────────────────────────────────────────
   Storybook artwork, drawn entirely in SVG.
   - The couple (bride + groom "bommalu") with movable body and throwing arm
   - Painted landscapes: big cumulus skies, river, hills, palms, temple, mandapam
   - Small ornaments: toranam leaves, marigolds, diyas, footprints, muggu
   ────────────────────────────────────────────────────────────────────────── */
window.ART = (function () {
  'use strict';

  const f = n => Math.round(n * 10) / 10;
  function rng(seed) {
    let s = (seed * 2654435761) >>> 0 || 1;
    return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }
  const stops = a => a.map((c, i) => `<stop offset="${(i / (a.length - 1)).toFixed(3)}" stop-color="${c}"/>`).join('');
  let uid = 0;

  /* shared gradients and filters, injected once into the page */
  const defs = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<linearGradient id="gSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dba57e"/><stop offset="1" stop-color="#c3875f"/></linearGradient>
<linearGradient id="gSaree" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8233f"/><stop offset="1" stop-color="#8c0b22"/></linearGradient>
<linearGradient id="gZari" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b98a2e"/><stop offset=".5" stop-color="#f1cf72"/><stop offset="1" stop-color="#b98a2e"/></linearGradient>
<linearGradient id="gKurta" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff8e8"/><stop offset="1" stop-color="#ead6ab"/></linearGradient>
<linearGradient id="gPanche" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffdf6"/><stop offset="1" stop-color="#ece2c8"/></linearGradient>
<linearGradient id="gHair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2721"/><stop offset="1" stop-color="#1c1210"/></linearGradient>
<linearGradient id="gBrass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3cf73"/><stop offset=".5" stop-color="#d39a32"/><stop offset="1" stop-color="#9c6418"/></linearGradient>
<linearGradient id="gLeaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fa04c"/><stop offset=".55" stop-color="#3f8a3c"/><stop offset="1" stop-color="#2c6a2f"/></linearGradient>
<radialGradient id="gGlow"><stop offset="0" stop-color="#fff6d0" stop-opacity=".95"/><stop offset=".35" stop-color="#ffd27a" stop-opacity=".5"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
<radialGradient id="gMoon"><stop offset="0" stop-color="#fffbe8" stop-opacity=".9"/><stop offset=".3" stop-color="#e8ecff" stop-opacity=".35"/><stop offset="1" stop-color="#c8d2ff" stop-opacity="0"/></radialGradient>
<filter id="fSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="fPaint" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="6"/></filter>
</defs></svg>`;

  /* ── the couple ─────────────────────────────────────────────────────────── */
  const SK = 'url(#gSkin)', HAIR = 'url(#gHair)', GOLD = '#e9b53c';

  function face(brows) {
    return `<ellipse cx="50" cy="50" rx="16.5" ry="18" fill="${SK}"/>
<path d="${brows}" stroke="#2a1712" stroke-width="1.15" fill="none" stroke-linecap="round"/>
<g class="eyes"><ellipse cx="42" cy="53.5" rx="2.4" ry="3.2" fill="#2a1712"/><ellipse cx="58" cy="53.5" rx="2.4" ry="3.2" fill="#2a1712"/>
<circle cx="42.9" cy="52.3" r=".95" fill="#fff"/><circle cx="58.9" cy="52.3" r=".95" fill="#fff"/></g>
<ellipse cx="38.4" cy="59.4" rx="3.3" ry="1.8" fill="#ee7a6c" opacity=".42"/><ellipse cx="61.6" cy="59.4" rx="3.3" ry="1.8" fill="#ee7a6c" opacity=".42"/>
<path d="M50.2 55.6q1 2.4-.9 2.8" stroke="#9a5f3c" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
  }

  /* jasmine garland with rose clusters, hanging to depth y */
  function garland(y) {
    const d = `M39 80 Q36 ${y - 8} 50 ${y} Q64 ${y - 8} 61 80`;
    return `<path d="${d}" stroke="#fffdf2" stroke-width="5" fill="none" stroke-dasharray=".1 3.6" stroke-linecap="round"/>
<path d="${d}" stroke="#e9e1c8" stroke-width="5.6" fill="none" opacity=".35"/>
<path d="${d}" stroke="#fffef8" stroke-width="4.4" fill="none" stroke-dasharray=".1 3.6" stroke-linecap="round"/>
<path d="${d}" stroke="#e0546d" stroke-width="4" fill="none" stroke-dasharray=".1 13" stroke-dashoffset="-3" stroke-linecap="round"/>
<path d="${d}" stroke="#3f8a3c" stroke-width="2.4" fill="none" stroke-dasharray=".1 13" stroke-dashoffset="-6.5" stroke-linecap="round"/>
<circle cx="50" cy="${y + 2}" r="3" fill="#e0546d"/><circle cx="50" cy="${y + 6}" r="2.2" fill="#f6cf62"/>`;
  }

  function brideInner() {
    let jasmine = '';
    for (let i = 0; i < 7; i++) {
      jasmine += `<circle cx="${f(31.6 - Math.sin(i * .45) * 1.4)}" cy="${f(40 + i * 5)}" r="1.9" fill="#fffdf2" stroke="#e2d8bd" stroke-width=".4"/>`;
      jasmine += `<circle cx="${f(68.4 + Math.sin(i * .45) * 1.4)}" cy="${f(40 + i * 5)}" r="1.9" fill="#fffdf2" stroke="#e2d8bd" stroke-width=".4"/>`;
    }
    return `<g class="bob"><ellipse cx="50" cy="196" rx="25" ry="3.6" fill="#000" opacity=".16"/><g class="tanu">
<path d="M32 46 Q27 80 34 98 L66 98 Q73 80 68 46 Z" fill="${HAIR}"/>
<ellipse cx="43" cy="194" rx="4.6" ry="2.1" fill="#b8784f"/><ellipse cx="57" cy="194" rx="4.6" ry="2.1" fill="#b8784f"/>
<path d="M33 102 Q27 150 20 192 Q50 198 80 192 Q73 150 67 102 Z" fill="url(#gSaree)"/>
<path d="M20.5 188 Q50 194 79.5 188 L80 192 Q50 198 20 192 Z" fill="${GOLD}"/>
<path d="M23 181 Q50 187 77 181" stroke="${GOLD}" stroke-width="1.2" fill="none" stroke-dasharray="2 2"/>
<path d="M51 108 L48 189 M56 108 L57 189 M61 108 L65 188" stroke="#6f0818" stroke-width=".9" opacity=".45" fill="none"/>
<path d="M34 84 Q25 102 28 124" stroke="${SK}" stroke-width="7" stroke-linecap="round" fill="none"/>
<path d="M24.8 113.5l6.6 .8M24.9 117.2l6.6 .8" stroke="${GOLD}" stroke-width="1.6"/>
<circle cx="28" cy="126" r="4" fill="${SK}"/>
<path d="M35 79 Q50 73 65 79 L67 104 Q50 108 33 104 Z" fill="#1d7a4a"/>
<path d="M61 77 Q71 81 69 93 L44 152 Q37 149 34 142 Z" fill="#c4122f"/>
<path d="M69 93 L44 152" stroke="${GOLD}" stroke-width="3.2" fill="none"/>
<path d="M65.5 86 L40.5 145" stroke="${GOLD}" stroke-width=".8" stroke-dasharray="1.5 2" fill="none"/>
<rect x="45" y="64" width="10" height="14" rx="4" fill="#bd7f58"/>
<path d="M41 78 Q50 90 59 78" stroke="${GOLD}" stroke-width="2.4" fill="none"/>
<circle cx="50" cy="86.5" r="2.6" fill="${GOLD}" stroke="#b3122e" stroke-width=".8"/>
<circle cx="33.6" cy="56" r="3" fill="${SK}"/><circle cx="66.4" cy="56" r="3" fill="${SK}"/>
<path d="M31.6 59.5h4l-2 5.2z M64.4 59.5h4l-2 5.2z" fill="${GOLD}"/>
${face('M38.6 48.6q3-1.6 6-.2 M55.4 48.4q3-1.4 6 .2')}
<path d="M46.9 62q3.1 2.3 6.2 0" stroke="#8a2b1b" stroke-width="1.2" fill="none" stroke-linecap="round"/>
<path d="M33 52 Q31 31 50 30 Q69 31 67 52 Q66 40 53 37.5 L50 41 L47 37.5 Q34 40 33 52Z" fill="${HAIR}"/>
${jasmine}
<path d="M50 37.6 V42" stroke="${GOLD}" stroke-width="1"/><circle cx="50" cy="43.3" r="1.5" fill="${GOLD}"/>
<circle cx="50" cy="47.4" r="1.15" fill="#b3122e"/>
<g class="hasta">
<path d="M66 84 Q75 102 72 124" stroke="${SK}" stroke-width="7" stroke-linecap="round" fill="none"/>
<path d="M68.6 113.6l6.6-.9M68.6 117.3l6.6-.9" stroke="${GOLD}" stroke-width="1.6"/>
<circle data-hand cx="72" cy="126" r="4" fill="${SK}"/>
<circle cx="70.8" cy="123.6" r="1.2" fill="#f6cf62"/><circle cx="73.3" cy="124.4" r="1.1" fill="#f6cf62"/>
</g></g></g>`;
  }

  function groomInner() {
    return `<g class="bob"><ellipse cx="50" cy="196" rx="23" ry="3.6" fill="#000" opacity=".16"/><g class="tanu">
<path d="M37 148 L35 190 Q50 194 65 190 L63 148 Z" fill="url(#gPanche)"/>
<path d="M35.3 185 Q50 189 64.7 185 L65 190 Q50 194 35 190Z" fill="${GOLD}"/>
<path d="M50 150 L52 190" stroke="#d6c9aa" stroke-width="1"/>
<ellipse cx="43" cy="193.6" rx="5" ry="2.3" fill="#a8693f"/><ellipse cx="57" cy="193.6" rx="5" ry="2.3" fill="#a8693f"/>
<g class="near"><path d="M34 84 Q24 102 27 126" stroke="#f3e5c4" stroke-width="8.5" stroke-linecap="round" fill="none"/>
<circle cx="27" cy="128.5" r="4.1" fill="${SK}"/></g>
<path d="M34 78 Q50 72 66 78 L70 152 Q50 157 30 152 Z" fill="url(#gKurta)"/>
<path d="M30.6 148.5 Q50 154 69.4 148.5" stroke="${GOLD}" stroke-width="2" fill="none"/>
<path d="M50 76 V114" stroke="#b9821a" stroke-width="1.2"/>
<circle cx="50" cy="86" r="1.1" fill="${GOLD}"/><circle cx="50" cy="94" r="1.1" fill="${GOLD}"/><circle cx="50" cy="102" r="1.1" fill="${GOLD}"/>
<path d="M37 77 Q30 80 33 92 L57 150 Q63 148 65 142 L44 80 Z" fill="#f6e9c6"/>
<path d="M33 92 L57 150" stroke="${GOLD}" stroke-width="2.6" fill="none"/>
<path d="M39 80 Q37 113 50 121 Q63 113 61 80" stroke="#fffdf0" stroke-width="4.6" fill="none" stroke-dasharray=".1 4.8" stroke-linecap="round"/>
<path d="M39 80 Q37 113 50 121 Q63 113 61 80" stroke="#d2283f" stroke-width="3.4" fill="none" stroke-dasharray=".1 14.6" stroke-dashoffset="-2.4" stroke-linecap="round"/>
<rect x="45" y="64" width="10" height="14" rx="4" fill="#bd7f58"/>
<circle cx="33.6" cy="56" r="3" fill="${SK}"/><circle cx="66.4" cy="56" r="3" fill="${SK}"/>
${face('M38.2 48.2q3.2-2 6.4-.4 M55.4 47.8q3.2-1.6 6.4.4')}
<path d="M46.4 59.4q3.6-1.6 7.2 0" stroke="#2a1712" stroke-width="1.3" fill="none" stroke-linecap="round"/>
<path d="M47.4 62.4q2.6 1.8 5.2 0" stroke="#8a2b1b" stroke-width="1.1" fill="none" stroke-linecap="round"/>
<path d="M33.5 52 Q31 30 50 29 Q70 30 66.5 52 Q66 42 60 38.5 Q52 43.5 40.5 40 Q35.5 43 33.5 52Z" fill="${HAIR}"/>
<path d="M50 41.8 V47.4" stroke="#b3122e" stroke-width="1.7" stroke-linecap="round"/>
<circle cx="50" cy="44" r=".8" fill="#f6cf62"/>
<g class="hasta">
<path d="M66 84 Q76 102 73 126" stroke="#f3e5c4" stroke-width="8.5" stroke-linecap="round" fill="none"/>
<circle data-hand cx="73" cy="128.5" r="4.1" fill="${SK}"/>
<circle cx="71.8" cy="126" r="1.2" fill="#f6cf62"/><circle cx="74.4" cy="126.8" r="1.1" fill="#f6cf62"/>
</g></g></g>`;
  }

  const bride = () => `<svg class="bomma" viewBox="0 0 100 200" overflow="visible" aria-hidden="true">${brideInner()}</svg>`;
  const groom = () => `<svg class="bomma" viewBox="0 0 100 200" overflow="visible" aria-hidden="true">${groomInner()}</svg>`;

  /* the couple placed inside a painted scene */
  function couple(c) {
    const w = c.h / 2;
    return `<g class="scene-couple"><ellipse cx="${c.x}" cy="${c.y - 2}" rx="${f(w * .9)}" ry="${f(c.h * .03)}" fill="#000" opacity=".12"/>
<svg class="bomma" x="${f(c.x - w + w * .08)}" y="${f(c.y - c.h)}" width="${f(w)}" height="${c.h}" viewBox="0 0 100 200" overflow="visible">${brideInner()}</svg>
<g class="groom"><svg class="bomma" x="${f(c.x - w * .08)}" y="${f(c.y - c.h)}" width="${f(w)}" height="${c.h}" viewBox="0 0 100 200" overflow="visible">${groomInner()}</svg></g></g>`;
  }

  /* ── ornaments ──────────────────────────────────────────────────────────── */
  function mango(i) {
    const c = ['#2e6b34', '#3f8a3f', '#2a5e30', '#4a9444'][i % 4], L = 56 + (i * 7 % 12);
    return `<svg viewBox="0 0 26 76" aria-hidden="true"><path d="M13 0V10" stroke="#7a5a2a" stroke-width="1.2"/><path d="M13 9C3 ${f(9 + L * .25)} 4 ${f(9 + L * .62)} 13 ${9 + L}C22 ${f(9 + L * .62)} 23 ${f(9 + L * .25)} 13 9Z" fill="${c}"/><path d="M13 13V${L + 4}" stroke="rgba(255,255,255,.35)" stroke-width=".8"/></svg>`;
  }
  function marigold() {
    const bloom = (cy, r, a, b) => {
      let p = `<circle cx="13" cy="${cy}" r="${r}" fill="${a}"/>`;
      for (let i = 0; i < 10; i++) { const t = i / 10 * Math.PI * 2; p += `<circle cx="${f(13 + Math.cos(t) * r * .62)}" cy="${f(cy + Math.sin(t) * r * .62)}" r="${f(r * .34)}" fill="${b}"/>`; }
      return p + `<circle cx="13" cy="${cy}" r="${f(r * .3)}" fill="#c0560f"/>`;
    };
    return `<svg viewBox="0 0 26 76" aria-hidden="true"><path d="M13 0V48" stroke="#7a5a2a" stroke-width="1"/>${bloom(20, 8, '#f39c12', '#f7b733')}${bloom(38, 7, '#f6b93b', '#ffcf5c')}<circle cx="13" cy="50" r="2.4" fill="#b3122e"/></svg>`;
  }
  function diya() {
    return `<svg class="diya" viewBox="0 0 80 92" aria-hidden="true"><circle class="glow" cx="40" cy="36" r="36" fill="url(#gGlow)"/>
<g class="flame"><path d="M40 12C47 27 48 38 40 47C32 38 33 27 40 12Z" fill="#ffae2b"/><path d="M40 25C44 32 44 39 40 45C36 39 36 32 40 25Z" fill="#fff4c2"/></g>
<path d="M8 52Q40 49 72 52Q66 77 40 79Q14 77 8 52Z" fill="url(#gBrass)"/><path d="M8 52Q40 58 72 52" stroke="#f8dd8c" stroke-width="2.4" fill="none"/>
<path d="M28 79h24l-4 9h-16z" fill="#a56a1f"/></svg>`;
  }
  function lampBoat() {
    return `<svg viewBox="0 0 64 44" aria-hidden="true"><circle cx="32" cy="18" r="18" fill="url(#gGlow)"/>
<path class="flame" d="M32 6C35 13 36 18 32 22C28 18 29 13 32 6Z" fill="#ffc24a"/>
<path d="M22 24Q32 21 42 24Q40 30 32 30Q24 30 22 24Z" fill="#c9862a"/>
<path d="M4 30Q32 26 60 30Q52 40 32 40Q12 40 4 30Z" fill="#3f8a3c"/><path d="M8 31Q32 29 56 31" stroke="#9cc77a" stroke-width="1.2" fill="none"/></svg>`;
  }
  function foot(left) {
    return `<svg viewBox="0 0 24 44" aria-hidden="true"><g${left ? ' transform="translate(24 0) scale(-1 1)"' : ''}>
<path d="M12 14c5 0 8 5 8 12s-2.4 16-8.2 16S5 36 5 30s2-16 7-16z" fill="#e8a317"/>
<circle cx="7.4" cy="8.2" r="3" fill="#e8a317"/><circle cx="12" cy="5.6" r="2.6" fill="#e8a317"/><circle cx="16" cy="6.6" r="2.3" fill="#e8a317"/><circle cx="19" cy="9.6" r="2" fill="#e8a317"/><circle cx="20.8" cy="13.2" r="1.7" fill="#e8a317"/>
<circle cx="12.4" cy="30" r="2.4" fill="#b3122e"/></g></svg>`;
  }

  /* the big lotus muggu on the welcome screen: lines draw, dots pop, colours soak in */
  function lotus() {
    let ln = '', dye = '', pt = '', k = 0;
    const L = (d, extra) => `<path class="ln" pathLength="1" style="transition-delay:${(k++ * .07).toFixed(2)}s" d="${d}"${extra || ''}/>`;
    for (let i = 0; i < 8; i++) {
      const d = 'M200 200C165 150 170 95 200 52C230 95 235 150 200 200Z', t = ` transform="rotate(${i * 45} 200 200)"`;
      dye += `<path d="${d}"${t} fill="${i % 2 ? '#e8a317' : '#d23a4f'}" opacity=".82"/>`; ln += L(d, t);
    }
    for (let i = 0; i < 8; i++) {
      const d = 'M200 200C182 168 184 136 200 112C216 136 218 168 200 200Z', t = ` transform="rotate(${i * 45 + 22.5} 200 200)"`;
      dye += `<path d="${d}"${t} fill="${i % 2 ? '#2e7d4a' : '#f08a2c'}" opacity=".88"/>`; ln += L(d, t);
    }
    for (let i = 0; i < 16; i++) {
      const t = ` transform="rotate(${i * 22.5} 200 200)"`;
      ln += L('M200 32C190 22 194 10 200 6C206 10 210 22 200 32Z', t);
      dye += `<path d="M200 32C190 22 194 10 200 6C206 10 210 22 200 32Z"${t} fill="${i % 2 ? '#b3122e' : '#f6cf62'}" opacity=".8"/>`;
    }
    ln += `<circle class="ln" pathLength="1" style="transition-delay:${(k++ * .07).toFixed(2)}s" cx="200" cy="200" r="30"/>`;
    ln += `<circle class="ln" pathLength="1" style="transition-delay:${(k++ * .07).toFixed(2)}s" cx="200" cy="200" r="158"/>`;
    ln += `<circle class="ln" pathLength="1" style="transition-delay:${(k++ * .07).toFixed(2)}s" cx="200" cy="200" r="168"/>`;
    dye += `<circle cx="200" cy="200" r="30" fill="#f6cf62"/><circle cx="200" cy="200" r="12" fill="#b3122e"/>`;
    for (let i = 0; i < 32; i++) {
      const a = i / 32 * Math.PI * 2;
      pt += `<circle class="pt" style="transition-delay:${(1.1 + i * .03).toFixed(2)}s" cx="${f(200 + Math.cos(a) * 182)}" cy="${f(200 + Math.sin(a) * 182)}" r="3.4"/>`;
    }
    for (let i = 0; i < 8; i++) {
      const a = (i + .5) / 8 * Math.PI * 2;
      pt += `<circle class="pt" style="transition-delay:${(1.6 + i * .05).toFixed(2)}s" cx="${f(200 + Math.cos(a) * 46)}" cy="${f(200 + Math.sin(a) * 46)}" r="3"/>`;
    }
    return `<svg class="muggu-big" viewBox="0 0 400 400" aria-hidden="true"><g class="dye">${dye}</g><g>${ln}</g><g>${pt}</g></svg>`;
  }

  /* a small muggu that draws itself between sections */
  function divider() {
    const side = 'M8 30C34 30 46 14 66 21C81 27 78 42 67 40C57 38 61 25 76 25C86 25 90 30 98 30';
    return `<svg class="muggu" viewBox="0 0 220 60" aria-hidden="true">
<path class="line" pathLength="1" d="${side}"/><path class="line" pathLength="1" d="${side}" transform="translate(220 0) scale(-1 1)"/>
<path class="line" pathLength="1" d="M110 12C118 20 118 40 110 48C102 40 102 20 110 12Z"/>
<path class="line" pathLength="1" d="M92 30C100 22 120 22 128 30C120 38 100 38 92 30Z"/>
<circle class="d" cx="110" cy="30" r="3"/><circle class="d" cx="110" cy="5" r="2"/><circle class="d" cx="110" cy="55" r="2"/><circle class="d" cx="86" cy="30" r="2"/><circle class="d" cx="134" cy="30" r="2"/></svg>`;
  }

  /* banana leaf with the feast; each serving appears in turn */
  function leaf(dishes, still) {
    const spots = [[150, 112, 26, 15], [215, 96, 18, 11], [270, 92, 16, 10], [325, 94, 17, 10], [385, 100, 20, 12], [445, 110, 22, 13],
      [300, 165, 62, 34], [180, 182, 34, 20], [420, 178, 34, 20], [500, 160, 24, 15], [110, 160, 22, 14], [235, 225, 30, 16]];
    let veins = '';
    for (let x = 70; x < 560; x += 16) veins += `<path d="M${x} ${f(130 - Math.sin((x - 40) / 548 * Math.PI) * 44)} L${x + 26} 262" stroke="rgba(255,255,255,.16)" stroke-width="1.2"/>`;
    let food = '';
    dishes.forEach((d, i) => {
      const s = spots[i % spots.length];
      food += `<g${still ? '' : ` class="food" style="transition-delay:${(.25 + i * .12).toFixed(2)}s"`}><ellipse cx="${s[0]}" cy="${s[1]}" rx="${s[2]}" ry="${s[3]}" fill="${d.color}"/><ellipse cx="${s[0] - s[2] * .25}" cy="${s[1] - s[3] * .35}" rx="${f(s[2] * .35)}" ry="${f(s[3] * .25)}" fill="#fff" opacity=".35"/></g>`;
    });
    return `<svg viewBox="0 0 600 300" role="img" aria-label="A banana leaf with the wedding feast">
<path d="M30 150Q50 40 300 30Q560 26 588 120L592 182Q560 274 300 274Q56 266 30 150Z" fill="url(#gLeaf)"/>
${veins}
<path d="M38 140Q300 64 590 122" stroke="#cfe3a8" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M30 150Q50 40 300 30Q560 26 588 120" stroke="#2b5f2c" stroke-width="2" fill="none"/>
<circle cx="300" cy="150" r="7" fill="#fffbe8"/>
${food}</svg>`;
  }

  /* ── landscape painting kit ─────────────────────────────────────────────── */
  const wave = (x, seed, w) => Math.sin(x / w + seed) * .62 + Math.sin(x / (w * .41) + seed * 1.9) * .28 + Math.sin(x / (w * .13) + seed * 3.1) * .1;
  const ridgeY = (y, amp, seed, w, x) => y - amp * wave(x, seed, w);
  function ridge(y, amp, seed, fill, w) {
    w = w || 140;
    let d = `M-20 520L-20 ${f(ridgeY(y, amp, seed, w, -20))}`;
    for (let x = -6; x <= 820; x += 14) d += `L${x} ${f(ridgeY(y, amp, seed, w, x))}`;
    return `<path d="${d}L820 520Z" fill="${fill}"/>`;
  }
  function cloud(x, y, s, lit, shade, hi) {
    const P = [[0, 0, 1], [-1, .25, .72], [1.05, .2, .8], [-.5, -.5, .8], [.45, -.62, .9], [1.8, .45, .55], [-1.75, .5, .5], [.2, .38, .9]];
    let a = '', b = '', c = '';
    P.forEach(([dx, dy, r]) => {
      const cx = x + dx * s, cy = y + dy * s, R = r * s;
      a += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}"/>`;
      b += `<circle cx="${f(cx - R * .12)}" cy="${f(cy - R * .2)}" r="${f(R * .84)}"/>`;
      if (dy < .3) c += `<circle cx="${f(cx - R * .25)}" cy="${f(cy - R * .38)}" r="${f(R * .5)}"/>`;
    });
    return `<g><g fill="${shade}">${a}</g><g fill="${lit}">${b}</g><g fill="${hi || lit}" opacity=".85">${c}</g></g>`;
  }
  const tower = (x, y, s, l, sh, hi) => cloud(x - s * .2, y - s * 1.9, s * .58, l, sh, hi) + cloud(x + s * .3, y - s * 1.05, s * .8, l, sh, hi) + cloud(x, y, s, l, sh, hi);

  function river(y, h, cols, glint, r, sunX) {
    const id = 'rv' + (uid++);
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops(cols)}</linearGradient></defs>
<path d="M-20 ${y}Q200 ${y - 5} 400 ${y + 2}T820 ${y - 2}V${y + h}H-20Z" fill="url(#${id})"/>`;
    for (let i = 0; i < 46; i++) {
      const gy = y + 6 + r() * (h - 8), gx = r() * 800, gw = 8 + r() * 34 * (gy - y) / h + 6;
      s += `<path d="M${f(gx)} ${f(gy)}h${f(gw)}" stroke="${glint}" stroke-width="${f(1 + (gy - y) / h)}" stroke-linecap="round" opacity="${f(.25 + r() * .45)}"/>`;
    }
    if (sunX != null) for (let i = 0; i < 9; i++) {
      const gy = y + 5 + i * (h - 10) / 9, gw = 26 + r() * 30 - i * 1.5;
      s += `<path d="M${f(sunX - gw / 2 + (r() - .5) * 10)} ${f(gy)}h${f(gw)}" stroke="${glint}" stroke-width="2.4" stroke-linecap="round" opacity="${f(.65 - i * .05)}"/>`;
    }
    return s;
  }
  function bridge(y, c) {
    let t = `M-10 ${y}`;
    for (let x = -10; x < 820; x += 22) t += `L${x + 11} ${y - 9}L${x + 22} ${y}`;
    let s = `<rect x="-10" y="${y}" width="830" height="4" fill="${c}"/><path d="${t}" stroke="${c}" stroke-width="1.5" fill="none"/><path d="M-10 ${y - 9}H820" stroke="${c}" stroke-width="1.3"/>`;
    for (let x = 10; x < 820; x += 66) s += `<rect x="${x}" y="${y + 3}" width="5" height="13" fill="${c}"/>`;
    return s;
  }
  function palm(x, y, h, c, trunk) {
    const tx = x + h * .16, ty = y - h, L = h * .5;
    let s = `<path d="M${f(x)} ${f(y)}Q${f(x + h * .02)} ${f(y - h * .55)} ${f(tx)} ${f(ty)}" stroke="${trunk || '#5a4334'}" stroke-width="${f(h * .05)}" fill="none" stroke-linecap="round"/>`;
    [[-1, .45], [-.8, .08], [-.35, -.26], [.3, -.3], [.85, .06], [1, .48], [-.55, .62], [.55, .64]].forEach(([dx, dy]) => {
      const ex = tx + dx * L, ey = ty + dy * L, mx = (tx + ex) / 2, my = (ty + ey) / 2;
      s += `<path d="M${f(tx)} ${f(ty)}Q${f(mx)} ${f(my - L * .38)} ${f(ex)} ${f(ey)}Q${f(mx)} ${f(my - L * .2)} ${f(tx)} ${f(ty)}Z" fill="${c}"/>`;
    });
    return s;
  }
  function tree(x, y, s, r, P) {
    P = P || ['#2b5530', '#3f7a3e', '#78b45a'];
    let t = `<path d="M${x - s * .1} ${y}Q${x - s * .06} ${y - s * .9} ${x - s * .3} ${y - s * 1.4}M${x + s * .1} ${y}Q${x + s * .08} ${y - s * .9} ${x + s * .34} ${y - s * 1.35}M${x} ${y}V${y - s * 1.3}" stroke="#5b4030" stroke-width="${f(s * .12)}" fill="none" stroke-linecap="round"/>`;
    const layer = (n, col, k, dy) => {
      let g = `<g fill="${col}">`;
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2, d = Math.sqrt(r()) * s * k;
        g += `<circle cx="${f(x + Math.cos(a) * d * 1.45 - dy * .4)}" cy="${f(y - s * 1.75 + Math.sin(a) * d * .62 - dy)}" r="${f(s * (.3 + r() * .26) * (k + .2))}"/>`;
      }
      return g + '</g>';
    };
    return t + layer(16, P[0], 1, 0) + layer(12, P[1], .8, s * .12) + layer(8, P[2], .5, s * .3);
  }
  function grass(r, y0, y1, n, c) {
    let d = '';
    for (let i = 0; i < n; i++) {
      const x = r() * 800, y = y0 + r() * (y1 - y0), h = 4 + r() * 9 * (y - y0 + 20) / (y1 - y0 + 20), b = (r() - .5) * 5;
      d += `M${f(x)} ${f(y)}q1 ${f(-h / 2)} ${f(b)} ${f(-h)}M${f(x + 2)} ${f(y)}q.4 ${f(-h / 2.4)} ${f(b + 3)} ${f(-h * .8)}`;
    }
    return `<path d="${d}" stroke="${c}" stroke-width="1.5" stroke-linecap="round" fill="none"/>`;
  }
  function flowers(r, y0, y1, n, cols) {
    let s = '';
    for (let i = 0; i < n; i++) s += `<circle cx="${f(r() * 800)}" cy="${f(y0 + r() * (y1 - y0))}" r="${f(1.4 + r() * 2)}" fill="${cols[i % cols.length]}"/>`;
    return s;
  }
  function stars(r, n) {
    let s = '';
    for (let i = 0; i < n; i++) s += `<circle class="${i % 5 ? '' : 'tw'}" style="animation-delay:${f(-r() * 4)}s" cx="${f(r() * 800)}" cy="${f(r() * 280)}" r="${f(.4 + r() * 1.2)}" fill="#fff" opacity="${f(.3 + r() * .7)}"/>`;
    return s;
  }
  function gopuram(x, y, s, c, c2) {
    let g = `<rect x="${f(x - s * .62)}" y="${f(y - s * .14)}" width="${f(s * 1.24)}" height="${f(s * .14 + 2)}" fill="${c}"/>`;
    let w = s, yy = y - s * .14;
    for (let i = 0; i < 5; i++) {
      const h = s * .25, w2 = w * .86;
      g += `<path d="M${f(x - w / 2)} ${f(yy)}L${f(x - w2 / 2)} ${f(yy - h)}H${f(x + w2 / 2)}L${f(x + w / 2)} ${f(yy)}Z" fill="${c}"/><path d="M${f(x - w2 / 2 + 2)} ${f(yy - h + 3)}H${f(x + w2 / 2 - 2)}" stroke="${c2}" stroke-width="1.6"/>`;
      for (let j = 1; j < 4; j++) g += `<rect x="${f(x - w2 / 2 + w2 * j / 4 - 2)}" y="${f(yy - h * .7)}" width="4" height="${f(h * .45)}" fill="${c2}" opacity=".6"/>`;
      yy -= h; w = w2 * .92;
    }
    g += `<path d="M${f(x - w * .7)} ${f(yy)}Q${f(x)} ${f(yy - s * .36)} ${f(x + w * .7)} ${f(yy)}Z" fill="${c}"/>`;
    for (let j = -1; j <= 1; j++) g += `<path d="M${f(x + j * w * .35)} ${f(yy - s * .12)}v${f(-s * .12)}" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`;
    g += `<path d="M${f(x - s * .09)} ${f(y)}v${f(-s * .2)}a${f(s * .09)} ${f(s * .09)} 0 0 1 ${f(s * .18)} 0v${f(s * .2)}Z" fill="${c2}" opacity=".7"/>`;
    return g;
  }
  function banana(x, y, s, flip) {
    const k = flip ? -1 : 1;
    let g = `<path d="M${x} ${y}V${f(y - s * 1.1)}" stroke="#8fae5a" stroke-width="${f(s * .1)}" stroke-linecap="round"/>`;
    [[-.9, -1.5, -38], [.9, -1.55, 38], [-.6, -1.85, -18], [.55, -1.9, 22], [.05, -2, 0]].forEach(([dx, dy, rot], i) => {
      const cx = x + dx * s * .55 * k, cy = y + dy * s * .62;
      g += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(s * .17)}" ry="${f(s * .62)}" transform="rotate(${rot * k} ${f(cx)} ${f(cy)})" fill="${i % 2 ? '#4a9444' : '#3d8a3a'}"/>`;
      g += `<path d="M${f(cx)} ${f(cy - s * .55)}V${f(cy + s * .55)}" transform="rotate(${rot * k} ${f(cx)} ${f(cy)})" stroke="#a7d07a" stroke-width="1.2"/>`;
    });
    return g;
  }
  function mandapam(x, y, s) {
    const top = y - s * 1.02;
    let g = `<rect x="${f(x - s * 1.1)}" y="${f(y - s * .1)}" width="${f(s * 2.2)}" height="${f(s * .12)}" fill="#c98f5a"/><rect x="${f(x - s * 1.16)}" y="${f(y)}" width="${f(s * 2.32)}" height="${f(s * .06)}" fill="#a8703f"/>`;
    [-.92, -.34, .34, .92].forEach((p, i) => {
      const px = x + p * s;
      g += `<rect x="${f(px - s * .045)}" y="${f(top)}" width="${f(s * .09)}" height="${f(y - s * .1 - top)}" fill="${i === 1 || i === 2 ? '#e8cf9b' : '#f1dcae'}"/>`;
      for (let j = 1; j < 5; j++) g += `<rect x="${f(px - s * .045)}" y="${f(top + j * s * .18)}" width="${f(s * .09)}" height="${f(s * .025)}" fill="#c4122f" opacity=".75"/>`;
    });
    g += `<path d="M${f(x - s * 1.12)} ${f(top)}L${x} ${f(top - s * .48)}L${f(x + s * 1.12)} ${f(top)}Z" fill="#b3122e"/>`;
    g += `<path d="M${f(x - s * .9)} ${f(top - s * .02)}L${x} ${f(top - s * .38)}L${f(x + s * .9)} ${f(top - s * .02)}" stroke="#f6cf62" stroke-width="2" fill="none"/>`;
    g += `<rect x="${f(x - s * 1.14)}" y="${f(top - s * .02)}" width="${f(s * 2.28)}" height="${f(s * .08)}" fill="#e9b53c"/>`;
    g += `<circle cx="${x}" cy="${f(top - s * .52)}" r="${f(s * .06)}" fill="#e9b53c"/>`;
    [[-.92, -.34], [-.34, .34], [.34, .92]].forEach(([a, b]) => {
      g += `<path d="M${f(x + a * s)} ${f(top + s * .08)}Q${f(x + (a + b) / 2 * s)} ${f(top + s * .32)} ${f(x + b * s)} ${f(top + s * .08)}" stroke="#f39c12" stroke-width="${f(s * .05)}" stroke-dasharray=".1 ${f(s * .06)}" stroke-linecap="round" fill="none"/>`;
    });
    for (let j = -5; j <= 5; j++) g += `<path d="M${f(x + j * s * .2)} ${f(top + s * .06)}v${f(s * (.16 + (j % 2 ? .06 : 0)))}" stroke="${j % 2 ? '#f6b93b' : '#fffdf0'}" stroke-width="${f(s * .035)}" stroke-dasharray=".1 ${f(s * .045)}" stroke-linecap="round"/>`;
    return g + banana(x - s * 1.28, y, s * .7) + banana(x + s * 1.28, y, s * .7, true);
  }
  function kalasam(x, y, s) {
    let g = '';
    [-50, -25, 0, 25, 50].forEach(a => g += `<ellipse cx="${x}" cy="${f(y - s * 1.05)}" rx="${f(s * .1)}" ry="${f(s * .36)}" transform="rotate(${a} ${x} ${f(y - s * .78)})" fill="#3f8a3f"/>`);
    g += `<circle cx="${x}" cy="${f(y - s * .95)}" r="${f(s * .2)}" fill="#8a5a2e"/><path d="M${x} ${f(y - s * 1.15)}v${f(-s * .12)}" stroke="#6f4a24" stroke-width="2"/>`;
    g += `<path d="M${f(x - s * .5)} ${f(y - s * .55)}Q${f(x - s * .72)} ${y} ${f(x - s * .28)} ${y}H${f(x + s * .28)}Q${f(x + s * .72)} ${y} ${f(x + s * .5)} ${f(y - s * .55)}Q${x} ${f(y - s * .74)} ${f(x - s * .5)} ${f(y - s * .55)}Z" fill="url(#gBrass)"/>`;
    g += `<rect x="${f(x - s * .2)}" y="${f(y - s * .78)}" width="${f(s * .4)}" height="${f(s * .18)}" rx="3" fill="#d39a32"/>`;
    g += `<path d="M${f(x - s * .42)} ${f(y - s * .32)}Q${x} ${f(y - s * .22)} ${f(x + s * .42)} ${f(y - s * .32)}" stroke="#b3122e" stroke-width="3" fill="none"/>`;
    return g;
  }
  function boat(x, y, s, c, sail) {
    return `<path d="M${f(x - s)} ${y}Q${x} ${f(y + s * .36)} ${f(x + s)} ${y}L${f(x + s * .8)} ${f(y - s * .1)}H${f(x - s * .8)}Z" fill="${c}"/>
<path d="M${x} ${f(y - s * .1)}V${f(y - s * 1.1)}" stroke="${c}" stroke-width="2"/>
<path d="M${f(x + 2)} ${f(y - s * 1.05)}Q${f(x + s * .75)} ${f(y - s * .6)} ${f(x + s * .6)} ${f(y - s * .18)}H${f(x + 2)}Z" fill="${sail}"/>`;
  }
  function lights(x1, y1, x2, y2, sag, n, r) {
    const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + sag * 2;
    let s = `<path d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}" stroke="#2a2030" stroke-width="1.2" fill="none" opacity=".6"/>`;
    for (let i = 1; i < n; i++) {
      const t = i / n, x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
      s += `<g class="bulb" style="animation-delay:${f(-r() * 3)}s"><circle cx="${f(x)}" cy="${f(y + 3)}" r="9" fill="url(#gGlow)"/><circle cx="${f(x)}" cy="${f(y + 3)}" r="2.2" fill="#ffe7a0"/></g>`;
    }
    return s;
  }
  function lanterns(r, n, y0, y1, x0, x1) {
    let s = '';
    x0 = x0 == null ? 0 : x0; x1 = x1 == null ? 800 : x1;
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), k = .5 + (y1 - y) / (y1 - y0) * .1 + r() * .6;
      s += `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})"><g class="lan" style="animation-delay:${f(-r() * 6)}s"><circle r="18" fill="url(#gGlow)" opacity=".8"/><path d="M-6 -8Q0 -11 6 -8L5 7H-5Z" fill="#ffb347"/><path d="M-3 -6Q0 -7.5 3 -6L2.4 5H-2.4Z" fill="#ffe2a0"/></g></g>`;
    }
    return s;
  }
  function floatLamps(r, n, y0, y1) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = r() * 800, y = y0 + r() * (y1 - y0), k = .4 + (y - y0) / (y1 - y0) * .6;
      s += `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})"><g class="lan" style="animation-delay:${f(-r() * 6)}s"><ellipse cy="10" rx="16" ry="4" fill="#ffc35a" opacity=".3"/><circle cy="-4" r="14" fill="url(#gGlow)"/><path d="M-10 2Q0 -1 10 2Q8 7 0 7Q-8 7 -10 2Z" fill="#3f8a3c"/><path d="M0 -10C3 -5 3 -2 0 1C-3 -2 -3 -5 0 -10Z" fill="#ffc24a"/></g></g>`;
    }
    return s;
  }
  function fireflies(r, n, y0, y1) {
    let s = '';
    for (let i = 0; i < n; i++) s += `<circle class="ff" style="animation-delay:${f(-r() * 3)}s" cx="${f(r() * 800)}" cy="${f(y0 + r() * (y1 - y0))}" r="${f(1.4 + r() * 1.4)}" fill="#fff3a8"/>`;
    return s;
  }
  function riceFall(r, n, x0, x1, y0, y1) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0);
      s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="1.3" ry="3.2" transform="rotate(${f(r() * 180)} ${f(x)} ${f(y)})" fill="${i % 9 ? (i % 2 ? '#f6cf62' : '#e8a317') : '#fffbe8'}"/>`;
    }
    return s;
  }
  const sun = (x, y, rad, c) => `<circle cx="${x}" cy="${y}" r="${rad * 4.2}" fill="url(#gGlow)"/><circle cx="${x}" cy="${y}" r="${rad}" fill="${c}"/>`;
  const moon = (x, y, rad) => `<circle cx="${x}" cy="${y}" r="${rad * 4}" fill="url(#gMoon)"/><circle cx="${x}" cy="${y}" r="${rad}" fill="#fdf8e4"/><circle cx="${x - rad * .3}" cy="${y - rad * .2}" r="${rad * .2}" fill="#e9e2c8" opacity=".6"/><circle cx="${x + rad * .35}" cy="${y + rad * .3}" r="${rad * .14}" fill="#e9e2c8" opacity=".6"/>`;

  function compose(o) {
    const id = 'sk' + (uid++), r = rng(o.seed || 7);
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops(o.sky)}</linearGradient></defs><rect width="800" height="500" fill="url(#${id})"/>`;
    if (o.stars) s += stars(r, o.stars);
    if (o.sun) s += sun.apply(null, o.sun);
    if (o.moon) s += moon.apply(null, o.moon);
    (o.clouds || []).forEach(c => { s += (c[3] ? tower : cloud)(c[0], c[1], c[2], o.cloud[0], o.cloud[1], o.cloud[2]); });
    s += `<g filter="url(#fPaint)">${o.land(r)}</g>`;
    if (o.fx) s += o.fx(r);
    if (o.couple) s += couple(o.couple);
    if (o.over) s += o.over(r);
    return `<svg class="scene" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${o.label || 'Painted scene'}">${s}</svg>`;
  }

  /* ── the scenes ─────────────────────────────────────────────────────────── */
  const DAY = ['#3a86d4', '#7dbbee', '#bfe2f5', '#e6f4f4'];
  const DAWN = ['#8fa8dc', '#f2b8b0', '#fbd7b0', '#fff0d4'];
  const GOLD_SKY = ['#ee8f58', '#f5b677', '#fbd9a6', '#fdeccd'];
  const DUSK = ['#27367a', '#5d4f9c', '#b56a95', '#ef9a7f', '#f9cf98'];
  const NIGHT = ['#07102a', '#13204a', '#28386c', '#46508a'];
  const C_DAY = ['#ffffff', '#bcd0e8', '#ffffff'], C_DUSK = ['#ffd9c4', '#a982b3', '#fff0e2'], C_GOLD = ['#fff3df', '#e7a98a', '#fffaf0'], C_NIGHT = ['#3a4a80', '#273463', '#4a5a92'], C_DAWN = ['#fff3ea', '#d9a9b8', '#ffffff'];

  const S = {
    hero: () => compose({
      seed: 11, label: 'A painted evening over the river', sky: DUSK, sun: [560, 290, 30, '#fff2cf'], cloud: C_DUSK,
      clouds: [[140, 190, 62, 1], [660, 176, 72, 1], [390, 84, 34], [60, 66, 26], [770, 270, 30], [300, 256, 24]],
      land: r => ridge(296, 24, 1.2, '#8a71a8', 170) + ridge(312, 14, 2.7, '#6a5f96', 80) + bridge(305, '#4e4a80') +
        river(316, 80, ['#f6c08e', '#c995a8', '#7f6ea8'], '#fff3d6', r, 560) +
        ridge(398, 14, 4.1, '#40625a', 110) + palm(70, ridgeY(398, 14, 4.1, 110, 70) + 6, 90, '#2f4f45') + palm(130, ridgeY(398, 14, 4.1, 110, 130) + 6, 64, '#2f4f45') + palm(735, ridgeY(398, 14, 4.1, 110, 735) + 6, 96, '#2f4f45') +
        ridge(446, 22, 5.3, '#2c4c3c', 150) + grass(r, 440, 500, 170, '#4f7d52') + flowers(r, 452, 500, 46, ['#f6cf62', '#fff4e0', '#f08a8a']),
      fx: r => fireflies(r, 16, 330, 480)
    }),
    band: () => compose({
      seed: 21, label: 'The river at golden hour', sky: GOLD_SKY, sun: [400, 268, 44, '#fff6dc'], cloud: C_GOLD,
      clouds: [[120, 150, 54, 1], [690, 140, 66, 1], [420, 70, 30], [260, 210, 24], [560, 220, 22]],
      land: r => ridge(282, 18, 3.3, '#d29a84', 150) + gopuram(615, 292, 92, '#b77a66', '#d9a48d') + ridge(300, 8, .7, '#b98a74', 60) +
        river(298, 140, ['#f8cf98', '#e8a78a', '#9b7a9a'], '#fff7e2', r, 400) +
        boat(250, 352, 26, '#5a4636', '#f2e2c4') + boat(540, 380, 20, '#5a4636', '#f6d6b0') +
        ridge(452, 18, 6.1, '#4d6b45', 120) + palm(40, 460, 150, '#3b5a36') + palm(110, 468, 108, '#3b5a36') + palm(765, 462, 140, '#3b5a36') +
        grass(r, 448, 500, 120, '#7aa45f')
    }),
    rsvp: () => compose({
      seed: 31, label: 'Lanterns over the river at night', sky: NIGHT, stars: 150, moon: [640, 104, 24], cloud: C_NIGHT,
      clouds: [[160, 120, 30], [460, 200, 22]],
      land: r => ridge(318, 24, 2.2, '#1d2750', 160) + gopuram(240, 322, 70, '#18203f', '#2a3560') + ridge(334, 10, 3.9, '#151d3c', 70) +
        river(332, 110, ['#2f3f78', '#1d2a58', '#111a3a'], '#c9b47a', r, 640) +
        ridge(452, 18, 1.4, '#0f1830', 130) + palm(700, 462, 110, '#0b1226', '#0b1226') + palm(60, 466, 90, '#0b1226', '#0b1226'),
      fx: r => floatLamps(r, 14, 350, 432) + lanterns(r, 20, 60, 300)
    }),
    neem: () => compose({
      seed: 41, label: 'The couple beneath a great tree', sky: DAY, sun: [130, 90, 24, '#fffbe6'], cloud: C_DAY,
      clouds: [[600, 160, 60, 1], [240, 120, 40], [760, 70, 26], [420, 240, 28]],
      land: r => ridge(290, 30, 1.7, '#8fb6cc', 180) + ridge(332, 26, 2.9, '#6fa067', 120) + ridge(392, 18, 4.4, '#579550', 160) +
        tree(470, 398, 110, r) + grass(r, 386, 500, 200, '#8cc46c') + flowers(r, 400, 500, 50, ['#fff', '#f6cf62', '#f2a0b4']),
      couple: { x: 430, y: 468, h: 140 }
    }),
    temple: () => compose({
      seed: 51, label: 'At the temple gopuram', sky: GOLD_SKY, sun: [640, 210, 30, '#fff6dc'], cloud: C_GOLD,
      clouds: [[160, 170, 50, 1], [720, 110, 34], [430, 70, 26]],
      land: r => ridge(330, 16, 2.1, '#d6a28a', 140) + gopuram(520, 420, 210, '#c98a66', '#f0c49a') +
        ridge(424, 10, 3.3, '#d9b07c', 90) + `<rect x="-10" y="430" width="820" height="80" fill="#e6c08a"/>` + palm(90, 440, 170, '#4a6a3e') + palm(740, 446, 120, '#4a6a3e') +
        flowers(r, 440, 500, 30, ['#f39c12', '#b3122e', '#fffbe8']),
      couple: { x: 280, y: 476, h: 150 }
    }),
    jasmine: () => compose({
      seed: 61, label: 'A morning field of jasmine', sky: DAWN, sun: [620, 250, 34, '#fffaf0'], cloud: C_DAWN,
      clouds: [[150, 150, 50, 1], [520, 110, 36], [740, 200, 30]],
      land: r => ridge(300, 20, 1.1, '#b9b4d8', 170) + ridge(340, 22, 2.6, '#8fb990', 130) + ridge(384, 16, 3.8, '#6aa463', 150) +
        grass(r, 380, 500, 180, '#93cb76') + flowers(r, 380, 500, 260, ['#fffef6', '#fffef6', '#fff7d6', '#f6cf62']),
      fx: r => fireflies(r, 8, 300, 420),
      couple: { x: 400, y: 470, h: 150 }
    }),
    river: () => compose({
      seed: 71, label: 'The couple on the river bank at dusk', sky: DUSK, sun: [220, 300, 26, '#fff2cf'], cloud: C_DUSK,
      clouds: [[600, 170, 60, 1], [140, 120, 34], [380, 230, 24]],
      land: r => ridge(304, 16, 2.4, '#7a6aa4', 130) + bridge(312, '#4e4a80') + river(318, 100, ['#f4b994', '#b98aa8', '#6e64a0'], '#fff0d6', r, 220) +
        boat(470, 360, 22, '#3a3256', '#f2d4c0') + ridge(430, 24, 5.1, '#2e4c40', 140) + palm(720, 440, 150, '#22382f') + grass(r, 424, 500, 130, '#4f7d52'),
      fx: r => fireflies(r, 10, 340, 470),
      couple: { x: 360, y: 482, h: 140 }
    }),
    lanterns: () => compose({
      seed: 81, label: 'Sky lanterns rising at night', sky: NIGHT, stars: 120, moon: [150, 96, 22], cloud: C_NIGHT,
      clouds: [[560, 150, 28]],
      land: r => ridge(330, 26, 1.9, '#1d2750', 150) + river(340, 80, ['#2f3f78', '#162252'], '#c9b47a', r) +
        ridge(440, 30, 3.4, '#121a36', 160) + grass(r, 430, 500, 120, '#24345a'),
      fx: r => lanterns(r, 26, 40, 320) + floatLamps(r, 8, 352, 410),
      couple: { x: 440, y: 470, h: 140 }
    }),
    mandapam: () => compose({
      seed: 91, label: 'The couple in the wedding mandapam', sky: DAY, sun: [690, 80, 22, '#fffbe6'], cloud: C_DAY,
      clouds: [[150, 150, 54, 1], [640, 200, 40], [400, 70, 26]],
      land: r => ridge(330, 24, 1.3, '#93bcd0', 160) + ridge(372, 16, 2.8, '#76a86c', 120) + `<rect x="-10" y="430" width="820" height="80" fill="#e9d2a6"/>` +
        mandapam(400, 436, 150) + flowers(r, 444, 500, 60, ['#f39c12', '#f6cf62', '#b3122e', '#fffbe8']),
      couple: { x: 400, y: 424, h: 118 }
    }),
    haldi: () => compose({
      seed: 101, label: 'Turmeric morning with brass kalasams', sky: DAWN, sun: [140, 220, 30, '#fffaf0'], cloud: C_DAWN,
      clouds: [[600, 140, 52, 1], [330, 90, 30]],
      land: r => ridge(320, 20, 2.2, '#a9c49a', 150) + ridge(380, 16, 3.1, '#7fb26a', 120) + flowers(r, 360, 450, 160, ['#f6b93b', '#f39c12', '#ffd75e']) +
        `<rect x="-10" y="440" width="820" height="70" fill="#f2d48a"/>` + kalasam(250, 470, 80) + kalasam(400, 476, 96) + kalasam(550, 470, 80) +
        flowers(r, 448, 500, 40, ['#f39c12', '#b3122e'])
    }),
    mehendi: () => compose({
      seed: 111, label: 'Garden lights for the mehendi and sangeet', sky: DUSK, cloud: C_DUSK,
      clouds: [[160, 150, 46, 1], [640, 120, 40, 1]],
      land: r => ridge(330, 22, 1.6, '#4d4a86', 150) + ridge(392, 20, 2.9, '#2f5045', 120) + tree(110, 420, 70, r, ['#20402f', '#2c5638', '#4b7b4e']) + tree(700, 424, 80, r, ['#20402f', '#2c5638', '#4b7b4e']) +
        grass(r, 400, 500, 150, '#4f7d52'),
      fx: r => lights(-10, 140, 400, 170, 40, 14, r) + lights(400, 170, 810, 130, 40, 14, r) + lights(-10, 230, 810, 220, 50, 26, r) + fireflies(r, 14, 380, 490)
    }),
    muhurtham: () => compose({
      seed: 121, label: 'The mandapam at the auspicious hour', sky: ['#5a9fe0', '#a4d0f2', '#f4e6c4'], sun: [400, 150, 26, '#fffbe6'], cloud: C_DAY,
      clouds: [[130, 140, 44, 1], [680, 150, 50, 1]],
      land: r => ridge(340, 18, 2.1, '#9cc0d2', 140) + `<rect x="-10" y="430" width="820" height="80" fill="#e9d2a6"/>` + mandapam(400, 436, 156) +
        flowers(r, 444, 500, 60, ['#f39c12', '#f6cf62', '#b3122e', '#fffbe8']),
      couple: { x: 400, y: 424, h: 120 }
    }),
    talambralu: () => compose({
      seed: 131, label: 'Turmeric rice showered over the couple', sky: ['#f7d18a', '#fbe3b0', '#fff3d8'], sun: [400, 120, 40, '#fffaf0'], cloud: C_GOLD,
      clouds: [[120, 150, 40], [700, 140, 44]],
      land: r => `<rect x="-10" y="430" width="820" height="80" fill="#e9c88f"/>` + mandapam(400, 436, 156),
      couple: { x: 400, y: 424, h: 120 },
      over: r => riceFall(r, 160, 250, 550, 220, 420)
    }),
    vindu: () => compose({
      seed: 141, label: 'A banana-leaf feast in the garden', sky: DAY, cloud: C_DAY,
      clouds: [[200, 120, 50, 1], [640, 110, 40]],
      land: r => ridge(320, 18, 1.5, '#8fbf7a', 140) + banana(80, 400, 120) + banana(720, 400, 120, true) + banana(200, 380, 80) + banana(610, 380, 80, true) +
        `<rect x="-10" y="330" width="820" height="180" fill="#d9b98a"/><rect x="-10" y="330" width="820" height="10" fill="#b98f5e"/>` +
        `<g transform="translate(190 268) scale(.7)">${leaf(['#f6cf62', '#2e6b34', '#b3122e', '#e07a1f', '#f2e4b0', '#6b3a5a', '#fffbe8', '#d98c1f', '#7a9a3a', '#c86b2a', '#f6cf62', '#fff3c4'].map(color => ({ color })), true)}</g>`
    }),
    engagement: () => compose({
      seed: 161, label: 'The couple in a garden under evening lights', sky: ['#3b3a78', '#8a5a9a', '#e08a8a', '#f8c48e'], sun: [640, 330, 26, '#fff2cf'], cloud: C_DUSK,
      clouds: [[150, 150, 50, 1], [560, 110, 34], [740, 210, 26]],
      land: r => ridge(330, 20, 1.9, '#6a5f96', 150) + ridge(392, 18, 3.4, '#3a5a46', 120) +
        tree(110, 430, 90, r, ['#22402f', '#2f5a3a', '#4f7f4f']) + tree(700, 436, 84, r, ['#22402f', '#2f5a3a', '#4f7f4f']) +
        grass(r, 420, 500, 170, '#5a8a56') + flowers(r, 430, 500, 60, ['#f6cf62', '#fff', '#f2a0b4']),
      fx: r => lights(-10, 120, 400, 150, 40, 14, r) + lights(400, 150, 810, 110, 40, 14, r) + fireflies(r, 14, 360, 480),
      couple: { x: 400, y: 478, h: 150 },
      over: r => {
        let h = '';
        for (let i = 0; i < 9; i++) {
          const x = 300 + r() * 200, y = 150 + r() * 150, k = .5 + r() * .7;
          h += `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})"><g class="lan" style="animation-delay:${f(-r() * 6)}s"><path d="M0 12C-9 5-14 1-14-5a7 7 0 0 1 14-2a7 7 0 0 1 14 2c0 6-5 10-14 17z" fill="${i % 2 ? '#e0405a' : '#f28aa0'}" opacity=".9"/></g></g>`;
        }
        return h;
      }
    }),
    reception: () => compose({
      seed: 151, label: 'Lamps on the river for the reception', sky: NIGHT, stars: 120, moon: [660, 90, 20], cloud: C_NIGHT,
      clouds: [[200, 140, 26]],
      land: r => ridge(300, 18, 2.6, '#1d2750', 140) + river(306, 140, ['#2f3f78', '#162252'], '#d9c288', r, 660) + ridge(462, 14, 4.2, '#0f1830', 100),
      fx: r => floatLamps(r, 22, 320, 440) + lights(-10, 40, 810, 40, 60, 30, r)
    })
  };

  function scene(name) { return (S[name] || S.neem)(); }

  /* the card's backdrop: faint line-drawn gopurams and a pillared hall, banana plants with jasmine strings */
  function cardBackdrop() {
    const line = '#d9cbb3', fill = '#ece3d4';
    let hall = `<rect x="200" y="700" width="1200" height="200" fill="${fill}" opacity=".7"/><path d="M200 700H1400M200 712H1400" stroke="${line}" stroke-width="2"/>`;
    for (let x = 220; x <= 1380; x += 46) hall += `<path d="M${x} 716V880" stroke="${line}" stroke-width="5"/><rect x="${x - 7}" y="716" width="14" height="8" fill="${line}"/>`;
    const jasmineString = (x, y0, y1) => {
      let s = '';
      for (let y = y0; y < y1; y += 9) s += `<circle cx="${x + Math.sin(y / 30) * 3}" cy="${y}" r="5" fill="${(y / 9 | 0) % 9 === 4 ? '#e0546d' : (y / 9 | 0) % 9 === 5 ? '#f39c12' : '#fffdf2'}" stroke="#e2d8bd" stroke-width="1"/>`;
      return s;
    };
    return `<svg class="backdrop" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
<g opacity=".75">${gopuram(800, 880, 400, fill, line)}${gopuram(470, 880, 250, fill, line)}${gopuram(1130, 880, 250, fill, line)}</g>
${hall}
<rect x="0" y="880" width="1600" height="20" fill="#e6dccb"/>
<g transform="translate(40 -40)">${banana(60, 520, 210)}${jasmineString(60, 260, 520)}</g>
<g transform="translate(-40 -40)">${banana(1540, 520, 210, true)}${jasmineString(1540, 260, 520)}</g>
</svg>`;
  }
  const coupleSVG = () => `<svg class="couple-svg" viewBox="0 0 180 200" overflow="visible" role="img" aria-label="The bride and groom">
<svg class="bomma" x="0" y="0" width="100" height="200" viewBox="0 0 100 200" overflow="visible">${groomInner()}</svg>
<svg class="bomma" x="78" y="4" width="98" height="196" viewBox="0 0 100 200" overflow="visible">${brideInner()}</svg></svg>`;

  /* ── the hero: a traditional wedding stage ─────────────────────────────── */
  // a string of flowers drawn as round beads along a path
  function flowerRope(d, w, kind, extra) {
    const W = w || 10;
    const sets = {
      jasmine: [['#fffef6', 0], ['#e0405a', 3.5, 7]],
      marigold: [['#f39c12', 0], ['#ffc83d', W * .55, 2], ['#b3122e', W * .3, 9]],
      mixed: [['#fffef6', 0], ['#f39c12', W * .55, 4], ['#e0405a', W * .3, 9]]
    }[kind || 'mixed'];
    let s = `<path d="${d}" stroke="#3f7a3a" stroke-width="${f(W * .25)}" fill="none"${extra || ''}/>`;
    sets.forEach(([c, off, every]) => {
      const gap = W * .95;
      const dash = every ? `.1 ${f(gap * every - .1)}` : `.1 ${f(gap - .1)}`;
      s += `<path d="${d}" stroke="${c}" stroke-width="${W}" stroke-linecap="round" stroke-dasharray="${dash}" stroke-dashoffset="${f(-(off || 0))}" fill="none"${extra || ''}/>`;
    });
    return s;
  }
  function tallLamp(x, base, h) {
    const top = base - h;
    let s = `<ellipse cx="${x}" cy="${f(top + 6)}" rx="${f(h * .5)}" ry="${f(h * .5)}" fill="url(#gGlow)" class="tw" style="animation-duration:2.6s"/>
<ellipse cx="${x}" cy="${f(base - 6)}" rx="${f(h * .16)}" ry="${f(h * .035)}" fill="#9c6418"/>
<path d="M${f(x - h * .14)} ${f(base - 6)}Q${x} ${f(base - h * .16)} ${f(x + h * .14)} ${f(base - 6)}Z" fill="url(#gBrass)"/>
<rect x="${f(x - h * .022)}" y="${f(top + h * .08)}" width="${f(h * .044)}" height="${f(h * .8)}" fill="url(#gBrass)"/>`;
    [.35, .55, .75].forEach(k => { s += `<ellipse cx="${x}" cy="${f(top + h * k)}" rx="${f(h * .045)}" ry="${f(h * .02)}" fill="#d39a32"/>`; });
    s += `<path d="M${f(x - h * .13)} ${f(top + h * .06)}Q${x} ${f(top + h * .16)} ${f(x + h * .13)} ${f(top + h * .06)}Z" fill="url(#gBrass)"/>`;
    [-.1, -.05, 0, .05, .1].forEach((dx, i) => {
      const fx = x + dx * h, fy = top + h * .055 - (i === 2 ? h * .01 : 0), fh = h * .07;
      s += `<path class="flame" style="animation-delay:${-i * .3}s" d="M${f(fx)} ${f(fy - fh)}C${f(fx + fh * .35)} ${f(fy - fh * .45)} ${f(fx + fh * .32)} ${f(fy)} ${f(fx)} ${f(fy)}C${f(fx - fh * .32)} ${f(fy)} ${f(fx - fh * .35)} ${f(fy - fh * .45)} ${f(fx)} ${f(fy - fh)}Z" fill="#ffb02e"/>`;
    });
    return s;
  }
  function heroBackdrop() {
    const r = rng(2026);
    let s = `<defs>
<linearGradient id="hbFold" x1="0" x2="1"><stop offset="0" stop-color="#3e0b19"/><stop offset=".5" stop-color="#8a2338"/><stop offset="1" stop-color="#3e0b19"/></linearGradient>
<pattern id="hbDrape" width="96" height="900" patternUnits="userSpaceOnUse"><rect width="96" height="900" fill="url(#hbFold)"/><rect x="47" width="2" height="900" fill="#d9a441" opacity=".25"/></pattern>
<radialGradient id="hbWarm" cx=".5" cy=".75" r=".7"><stop offset="0" stop-color="#ffb35c" stop-opacity=".45"/><stop offset=".6" stop-color="#d0602a" stop-opacity=".12"/><stop offset="1" stop-color="#2a0710" stop-opacity="0"/></radialGradient>
<linearGradient id="hbSwag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0c35a"/><stop offset="1" stop-color="#b9781e"/></linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#hbDrape)"/>
<rect width="1600" height="900" fill="url(#hbWarm)"/>
<rect width="1600" height="900" fill="#1a0510" opacity=".18"/>`;
    // glowing lights
    for (let i = 0; i < 46; i++) {
      s += `<circle class="tw" style="animation-delay:${f(-r() * 4)}s" cx="${f(r() * 1600)}" cy="${f(60 + r() * 700)}" r="${f(4 + r() * 22)}" fill="url(#gGlow)" opacity="${f(.25 + r() * .45)}"/>`;
    }
    // hanging flower strings — shorter in the middle so the names stay clear
    for (let x = 30, i = 0; x < 1600; x += 64, i++) {
      const behindText = x > 150 && x < 1100;    // keep the names and countdown clear
      const len = behindText ? 50 + r() * 40 : 260 + r() * 360;
      const kind = i % 3 === 0 ? 'jasmine' : i % 3 === 1 ? 'marigold' : 'mixed';
      s += `<g class="str" style="animation-delay:${f(-r() * 5)}s">${flowerRope(`M${x} 40V${f(40 + len)}`, 11, kind)}<circle cx="${x}" cy="${f(48 + len)}" r="7" fill="#e9b53c"/><path d="M${x - 4} ${f(54 + len)}h8l-4 12z" fill="#b3122e"/></g>`;
    }
    // valance with swags and marigold edging
    s += `<rect width="1600" height="34" fill="#5a1222"/><rect y="30" width="1600" height="6" fill="#e9b53c"/>`;
    for (let x = -40; x < 1640; x += 200) {
      s += `<path d="M${x} 34Q${x + 100} 150 ${x + 200} 34Z" fill="url(#hbSwag)"/><path d="M${x + 14} 36Q${x + 100} 124 ${x + 186} 36" stroke="#a3162f" stroke-width="5" fill="none"/>`;
      s += flowerRope(`M${x} 36Q${x + 100} 158 ${x + 200} 36`, 10, 'marigold');
      s += `<circle cx="${x}" cy="40" r="10" fill="#e9b53c"/><path d="M${x - 5} 46h10l-5 26z" fill="#b3122e"/>`;
    }
    // floor and tall brass lamps
    s += `<rect y="846" width="1600" height="60" fill="#2a0a12"/><rect y="844" width="1600" height="4" fill="#d9a441" opacity=".7"/>`;
    s += tallLamp(110, 860, 330) + tallLamp(1490, 860, 330);
    return `<svg class="scene backdrop" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${s}</svg>`;
  }

  /* ── side-view couple (facing right; the groom is mirrored to face her) ─── */
  const PROFILE_HEAD = 'M40 46Q42 32 56 33Q66 35 66 46L69 52Q66 53 66 55Q68 57 66 58.5Q67 61 63 64Q58 69 50 66Q41 62 40 46Z';
  function profileFace(brow) {
    return `<path d="${PROFILE_HEAD}" fill="${SK}"/>
<g class="eyes"><ellipse cx="61" cy="48.5" rx="1.8" ry="2.6" fill="#2a1712"/><circle cx="61.6" cy="47.6" r=".7" fill="#fff"/></g>
<path d="${brow}" stroke="#2a1712" stroke-width="1.1" fill="none" stroke-linecap="round"/>
<ellipse cx="60" cy="56" rx="3" ry="1.6" fill="#ee7a6c" opacity=".45"/>`;
  }
  function brideSide() {
    let jas = '';
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; jas += `<circle cx="${f(37 + Math.cos(a) * 9.5)}" cy="${f(50 + Math.sin(a) * 9.5)}" r="2" fill="#fffdf2" stroke="#e2d8bd" stroke-width=".4"/>`; }
    for (let y = 61; y < 100; y += 4.4) jas += `<circle cx="${f(35 - (y - 61) * .05)}" cy="${f(y)}" r="1.9" fill="#fffdf2" stroke="#e2d8bd" stroke-width=".4"/>`;
    const arm = (cls, sx, sy, col, hx) => `<g class="${cls}"><path d="M${sx} ${sy}Q${sx + 3} ${sy + 30} ${hx} ${sy + 58}" stroke="${col}" stroke-width="7" stroke-linecap="round" fill="none"/>
<path d="M${hx - 3.5} ${sy + 45}l7 .6M${hx - 3.5} ${sy + 48.5}l7 .6" stroke="${GOLD}" stroke-width="1.6"/><circle cx="${hx}" cy="${sy + 60}" r="4" fill="${col}"/></g>`;
    return `<ellipse cx="52" cy="196" rx="24" ry="3.4" fill="#000" opacity=".16"/>
<g class="g-body">
${arm('g-arm far', 51, 83, '#b0744f', 53)}
<circle cx="37" cy="50" r="9" fill="${HAIR}"/>
<path d="M42 104Q36 150 30 192Q52 198 76 192Q68 150 62 104Z" fill="url(#gSaree)"/>
<path d="M30.6 186Q52 192 75.4 186L76 192Q52 198 30 192Z" fill="${GOLD}"/>
<path d="M58 110L66 190M62 110L72 189M54 110L58 190" stroke="#6f0818" stroke-width=".9" opacity=".45" fill="none"/>
<ellipse cx="66" cy="194" rx="5" ry="2" fill="#b8784f"/>
<path d="M44 78Q56 74 62 80Q66 90 62 104L42 104Q40 90 44 78Z" fill="#1d7a4a"/>
<path d="M46 76Q58 74 60 82L52 106Q40 140 36 150L31 146Q38 120 42 104Q42 88 46 76Z" fill="#c4122f"/>
<path d="M60 82L52 106Q40 140 36 150" stroke="${GOLD}" stroke-width="2.6" fill="none"/>
<rect x="49" y="62" width="9" height="16" rx="4" fill="#bd7f58"/>
<path d="M49 75Q55 83 60 75" stroke="${GOLD}" stroke-width="2.2" fill="none"/><circle cx="55" cy="80.6" r="1.8" fill="${GOLD}"/>
${profileFace('M57.6 43.6q3-1.6 6.2 0')}
<path d="M64.4 59.6q1.3.7 2.2 0" stroke="#8a2b1b" stroke-width="1.1" fill="none" stroke-linecap="round"/>
<path d="M38 52Q34 30 54 30Q66 31 66 42Q60 36 52 38Q46 40 44 50Q42 58 44 64Q38 60 38 52Z" fill="${HAIR}"/>
${jas}
<ellipse cx="50" cy="52" rx="2.8" ry="3.8" fill="#c3875f"/><path d="M48.6 56h3l-1.5 4.6z" fill="${GOLD}"/>
<circle cx="64.6" cy="38.6" r="1.3" fill="${GOLD}"/><circle cx="66" cy="42.4" r="1" fill="#b3122e"/>
${arm('g-arm near', 54, 82, SK, 56)}
</g>`;
  }
  function groomSide() {
    return `<ellipse cx="52" cy="196" rx="22" ry="3.4" fill="#000" opacity=".16"/>
<g class="g-body">
<path d="M51 84Q50 112 52 136" stroke="#e2d1a8" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="52" cy="138.5" r="4" fill="#b0744f"/>
<path d="M40 140L37 192Q52 196 68 192L64 140Z" fill="url(#gPanche)"/>
<path d="M37.3 187Q52 191 67.7 187L68 192Q52 196 37 192Z" fill="${GOLD}"/>
<ellipse cx="62" cy="194.4" rx="6" ry="2.2" fill="#a8693f"/><ellipse cx="49" cy="194.4" rx="5" ry="2" fill="#94603a"/>
<path d="M41 78Q54 72 64 80Q68 110 67 145Q54 149 40 145Q38 110 41 78Z" fill="url(#gKurta)"/>
<path d="M40.4 142Q54 147 66.8 142" stroke="${GOLD}" stroke-width="2" fill="none"/>
<path d="M48 76Q56 74 58 80L60 140L55 141L52 84Z" fill="#f6e9c6"/><path d="M58 80L60 140" stroke="${GOLD}" stroke-width="2.2"/>
<rect x="49" y="62" width="9" height="16" rx="4" fill="#bd7f58"/>
${profileFace('M57.4 43.2q3.2-2 6.6-.2')}
<path d="M63.4 57.4q2.6-1 4.4.6" stroke="#2a1712" stroke-width="1.6" fill="none" stroke-linecap="round"/>
<path d="M64.6 60.4q1.1.6 1.9 0" stroke="#8a2b1b" stroke-width="1" fill="none" stroke-linecap="round"/>
<path d="M38 52Q35 31 54 30Q66 30 66 40Q60 37 54 39Q48 40 46 46Q44 54 45 60Q40 58 38 52Z" fill="${HAIR}"/>
<ellipse cx="50" cy="52" rx="2.8" ry="3.8" fill="#c3875f"/>
<path d="M65.2 37.8V43" stroke="#b3122e" stroke-width="1.6" stroke-linecap="round"/>
<path d="M56 84Q60 112 58 136" stroke="#f3e5c4" stroke-width="8.5" stroke-linecap="round" fill="none"/><circle cx="58" cy="138.5" r="4.1" fill="${SK}"/>
</g>`;
  }

  /* the bride places a garland over the groom's head under the mandapam (animated from app.js) */
  function garlandExchange() {
    const r = rng(77);
    let s = '';
    // mandapam frame
    s += `<path d="M14 108L320 20L626 108Z" fill="#a3162f"/><path d="M40 104L320 34L600 104" stroke="#f0c35a" stroke-width="4" fill="none"/>
<circle cx="320" cy="14" r="12" fill="#e9b53c"/><path d="M320 2v-12" stroke="#e9b53c" stroke-width="4" stroke-linecap="round"/>
<rect x="10" y="100" width="620" height="20" fill="#e9b53c"/><rect x="10" y="118" width="620" height="6" fill="#a3162f"/>`;
    [44, 596].forEach(px => {
      s += `<rect x="${px - 13}" y="122" width="26" height="436" fill="#f3dfb0"/><rect x="${px - 17}" y="122" width="34" height="14" fill="#e9b53c"/><rect x="${px - 17}" y="540" width="34" height="18" fill="#e9b53c"/>`;
      for (let y = 160; y < 530; y += 52) s += `<rect x="${px - 13}" y="${y}" width="26" height="7" fill="#c4122f" opacity=".75"/>`;
      s += flowerRope(`M${px} 126V520`, 9, 'mixed');
    });
    // fringe of marigold and jasmine along the beam
    for (let x = 70, i = 0; x <= 570; x += 26, i++) s += flowerRope(`M${x} 124V${124 + (i % 2 ? 46 : 72)}`, 9, i % 2 ? 'jasmine' : 'marigold');
    s += flowerRope('M20 124Q170 210 320 124Q470 210 620 124', 10, 'mixed');
    // banana plants and kalasams beside the pillars
    s += banana(0, 560, 92) + banana(640, 560, 92, true) + kalasam(100, 560, 44) + kalasam(540, 560, 44);
    // platform with a muggu
    s += `<ellipse cx="320" cy="566" rx="306" ry="34" fill="#c98f5a"/><ellipse cx="320" cy="560" rx="300" ry="30" fill="#e8c48a"/>
<ellipse cx="320" cy="561" rx="150" ry="14" fill="none" stroke="#b3122e" stroke-width="2" stroke-dasharray="6 5"/><ellipse cx="320" cy="561" rx="100" ry="9" fill="none" stroke="#e8a317" stroke-width="2"/>
<ellipse cx="318" cy="556" rx="120" ry="8" fill="#000" opacity=".14"/>`;
    // the couple, facing each other
    s += `<svg x="195" y="255" width="150" height="300" viewBox="0 0 100 200" overflow="visible" id="gBride">${brideSide()}</svg>`;
    s += `<svg x="295" y="255" width="150" height="300" viewBox="0 0 100 200" overflow="visible" id="gGroom"><g transform="translate(100 0) scale(-1 1)">${groomSide()}</g></svg>`;
    // the garland, drawn around its top centre (0,0); app.js moves it from her hands onto his shoulders
    s += `<g id="gLoop" transform="translate(367 362)">${flowerRope('M-22 0Q0 -9 22 0', 8, 'jasmine')}${flowerRope('M-22 0Q-31 52 0 78Q31 52 22 0', 9, 'mixed')}<circle cx="0" cy="82" r="6" fill="#e0405a"/><path d="M-4 86h8l-4 12z" fill="#e9b53c"/></g>`;
    // a heart when the garland lands
    s += `<g id="gHeart" opacity="0" transform="translate(321 250)"><path d="M0 18C-11 9.5-17 4-17-4a8.5 8.5 0 0 1 17-2.2A8.5 8.5 0 0 1 17-4c0 8-6 13.5-17 22z" fill="#e0405a" stroke="#fff" stroke-width="2"/></g>`;
    // a few petals in the air
    for (let i = 0; i < 26; i++) {
      const x = 180 + r() * 290, y = 160 + r() * 200;
      s += `<ellipse class="petal" style="animation-delay:${f(-r() * 4)}s" cx="${f(x)}" cy="${f(y)}" rx="3" ry="5" transform="rotate(${f(r() * 180)} ${f(x)} ${f(y)})" fill="${['#e0405a', '#f39c12', '#fffef6', '#ffc83d'][i % 4]}"/>`;
    }
    return `<svg class="garland-scene" viewBox="0 -14 640 616" role="img" aria-label="The bride placing a garland on the groom under the mandapam">${s}</svg>`;
  }

  /* ── celebration card art: cream ground, kolam, garlands, banana leaves, lotus ── */
  function kolam(cx, top, n, d, col) {
    const X = (i, j) => cx + (i - j) * d, Y = (i, j) => top + (i + j) * d;
    let s = `<g stroke="${col}" stroke-width="2.6" fill="none" stroke-linecap="round">`;
    for (let i = 0; i <= n; i++) s += `<path d="M${f(X(i, 0))} ${f(Y(i, 0))}L${f(X(i, n))} ${f(Y(i, n))}"/><path d="M${f(X(0, i))} ${f(Y(0, i))}L${f(X(n, i))} ${f(Y(n, i))}"/>`;
    const loop = (x, y, nx, ny) => `<circle cx="${f(x + nx * d * .55)}" cy="${f(y + ny * d * .55)}" r="${f(d * .42)}"/>`;
    for (let k = 0; k < n; k++) {
      const m = k + .5, q = .7071;
      s += loop(X(0, m), Y(0, m), -q, q) + loop(X(n, m), Y(n, m), q, q) + loop(X(m, 0), Y(m, 0), q, -q) + loop(X(m, n), Y(m, n), -q, q);
    }
    s += `<path d="M${f(X(n, n))} ${f(Y(n, n))}q-${f(d * .6)} ${f(d * 1.3)} 0 ${f(d * 1.6)}q${f(d * .6)} -${f(d * .3)} 0 -${f(d * 1.6)}"/></g><g fill="${col}">`;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += `<circle cx="${f(X(i + .5, j + .5))}" cy="${f(Y(i + .5, j + .5))}" r="2.6"/>`;
    return s + '</g>';
  }
  function hangGarland(x, len, w) {
    const pink = len * .58, jas = len * .32;
    let s = `<path d="M${x} -4V${f(pink)}" stroke="#e05b7e" stroke-width="${w}"/>
<path d="M${x} -4V${f(pink)}" stroke="#f6a8c0" stroke-width="${f(w * .8)}" stroke-dasharray="2.4 3.2" stroke-linecap="round"/>
<path d="M${x} -4V${f(pink)}" stroke="#fff" stroke-width="${f(w * .3)}" stroke-dasharray=".1 7" stroke-linecap="round" opacity=".7"/>
<rect x="${f(x - w * .62)}" y="${f(pink - 2)}" width="${f(w * 1.24)}" height="7" rx="3" fill="#3f8a3c"/>
<path d="M${x} ${f(pink + 5)}V${f(pink + 5 + jas)}" stroke="#fffef6" stroke-width="${f(w * .8)}" stroke-dasharray="3 1.6"/>
<path d="M${x} ${f(pink + 5)}V${f(pink + 5 + jas)}" stroke="#e7e2cc" stroke-width="${f(w * .8)}" stroke-dasharray=".6 4.2" opacity=".8"/>
<rect x="${f(x - w * .5)}" y="${f(pink + 3 + jas)}" width="${f(w)}" height="6" rx="3" fill="#3f8a3c"/>
<path d="M${x} ${f(pink + 9 + jas)}v${f(len * .12)}" stroke="#fffef6" stroke-width="${f(w * .45)}" stroke-dasharray="2 1.4"/>`;
    return s;
  }
  function lotusFlower(x, y, s) {
    let p = `<path d="M${x} ${y}q${f(-s * .1)} ${f(s * .5)} ${f(s * .05)} ${f(s * 1.1)}" stroke="#6f9a52" stroke-width="${f(s * .06)}" fill="none"/>`;
    [[-62, .8], [62, .8], [-35, .95], [35, .95], [-12, 1], [12, 1], [0, 1.02]].forEach(([a, k], i) => {
      p += `<ellipse cx="${x}" cy="${f(y - s * .42 * k)}" rx="${f(s * .17)}" ry="${f(s * .46 * k)}" transform="rotate(${a} ${x} ${y})" fill="${i < 2 ? '#f3a6bd' : i < 4 ? '#f7b9cb' : i < 6 ? '#fbcad7' : '#fde1e8'}" stroke="#e58aa6" stroke-width="1"/>`;
    });
    return p + `<ellipse cx="${x}" cy="${f(y - s * .05)}" rx="${f(s * .16)}" ry="${f(s * .07)}" fill="#f6cf62"/>`;
  }
  function bowl(x, y, s, heap) {
    return `<ellipse cx="${x}" cy="${f(y + s * .32)}" rx="${f(s * .9)}" ry="${f(s * .12)}" fill="#000" opacity=".12"/>
<path d="M${f(x - s)} ${y}Q${f(x - s * .9)} ${f(y + s * .45)} ${x} ${f(y + s * .45)}Q${f(x + s * .9)} ${f(y + s * .45)} ${f(x + s)} ${y}Z" fill="url(#gBrass)"/>
<ellipse cx="${x}" cy="${y}" rx="${s}" ry="${f(s * .22)}" fill="#c9862a"/>
<path d="M${f(x - s * .85)} ${y}Q${x} ${f(y - s * .7)} ${f(x + s * .85)} ${y}Z" fill="${heap}"/>
<ellipse cx="${x}" cy="${f(y + s * .02)}" rx="${s}" ry="${f(s * .2)}" fill="none" stroke="#f3cf73" stroke-width="2"/>`;
  }
  function cardArt(kind) {
    const id = 'ca' + (uid++), r = rng(kind.length * 131 + 7);
    let s = `<defs><radialGradient id="${id}" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#fdf6e3"/><stop offset="1" stop-color="#f3e6c6"/></radialGradient></defs>
<rect width="400" height="500" fill="url(#${id})"/>`;
    s += kolam(200, 14, 4, 15, '#8a2235');
    s += hangGarland(22, 210, 15) + hangGarland(50, 150, 11) + hangGarland(378, 220, 15) + hangGarland(350, 160, 11);
    s += `<path d="M0 452Q200 436 400 452V500H0Z" fill="#ecdcb6"/>`;
    s += banana(18, 520, 150);
    if (kind !== 'vindu') s += lotusFlower(372, 420, 92);
    if (kind === 'pellikuthuru') {
      s += kalasam(200, 450, 120) + bowl(92, 452, 46, '#f2b705') + bowl(312, 458, 40, '#c8102e');
      for (let i = 0; i < 24; i++) s += `<circle cx="${f(70 + r() * 260)}" cy="${f(465 + r() * 30)}" r="${f(2 + r() * 2.5)}" fill="${['#f39c12', '#fffef6', '#e05b7e', '#f2b705'][i % 4]}"/>`;
    } else if (kind === 'talambralu') {
      s += `<ellipse cx="200" cy="470" rx="128" ry="22" fill="#000" opacity=".12"/>
<ellipse cx="200" cy="452" rx="130" ry="30" fill="url(#gBrass)"/><ellipse cx="200" cy="446" rx="118" ry="24" fill="#c9862a"/>
<path d="M98 446Q200 360 302 446Z" fill="#f2c230"/><path d="M130 440Q200 384 270 440" stroke="#ffe27a" stroke-width="6" fill="none" opacity=".7"/>`;
      for (let i = 0; i < 40; i++) s += `<circle cx="${f(120 + r() * 160)}" cy="${f(392 + r() * 50)}" r="${f(1.8 + r() * 1.6)}" fill="#fffdf6" stroke="#e5dcc0" stroke-width=".5"/>`;
      s += riceFall(r, 150, 110, 290, 150, 390);
      for (let i = 0; i < 24; i++) s += `<circle cx="${f(120 + r() * 160)}" cy="${f(160 + r() * 220)}" r="${f(2 + r() * 1.6)}" fill="#fffdf6" stroke="#e5dcc0" stroke-width=".5"/>`;
    } else if (kind === 'vindu') {
      s += `<g transform="translate(58 300) scale(.48)">${leaf(['#f6cf62', '#2e6b34', '#b3122e', '#e07a1f', '#f2e4b0', '#6b3a5a', '#fffbe8', '#d98c1f', '#7a9a3a', '#c86b2a', '#f6cf62', '#fff3c4'].map(color => ({ color })), true)}</g>`;
      s += `<path d="M330 386h40l-5 70h-30z" fill="url(#gBrass)"/><ellipse cx="350" cy="386" rx="20" ry="5" fill="#c9862a"/><ellipse cx="350" cy="459" rx="22" ry="5" fill="#000" opacity=".12"/>`;
      s += lotusFlower(368, 300, 60);
    }
    return `<svg class="scene" viewBox="0 0 400 500" preserveAspectRatio="xMidYMax slice" role="img" aria-label="${kind}">${s}</svg>`;
  }

  /* ── journey vignettes: the couple with props, no frame (transparent background) ── */
  function heart(x, y, k, col) { return `<path transform="translate(${f(x)} ${f(y)}) scale(${f(k)})" d="M0 12C-9 5-14 1-14-5a7 7 0 0 1 14-2a7 7 0 0 1 14 2c0 6-5 10-14 17z" fill="${col}"/>`; }
  function marigoldHeap(x, y, s) {
    let p = '';
    const r = rng(Math.round(x * 7 + y));
    for (let i = 0; i < 9; i++) {
      const cx = x + (r() - .5) * s * 1.6, cy = y - r() * s * .5, rad = s * (.22 + r() * .12);
      p += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rad)}" fill="${i % 3 ? '#f39c12' : '#ffb627'}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rad * .45)}" fill="#d9700f"/>`;
    }
    return p;
  }
  function ringPlate(x, y) {
    return `<ellipse cx="${x}" cy="${y + 6}" rx="46" ry="9" fill="#000" opacity=".12"/><ellipse cx="${x}" cy="${y}" rx="46" ry="12" fill="url(#gBrass)"/><ellipse cx="${x}" cy="${y - 2}" rx="38" ry="8" fill="#c9862a"/>
<path d="M${x - 30} ${y - 4}q30 -10 60 0" stroke="#e0405a" stroke-width="7" stroke-dasharray=".1 6" stroke-linecap="round" fill="none"/>
<ellipse cx="${x - 10}" cy="${y - 10}" rx="8" ry="7" fill="none" stroke="#f6cf62" stroke-width="3"/><ellipse cx="${x + 9}" cy="${y - 11}" rx="7" ry="6" fill="none" stroke="#f6cf62" stroke-width="3"/>
<circle cx="${x - 10}" cy="${y - 17}" r="2.4" fill="#fff"/><circle cx="${x + 9}" cy="${y - 17}" r="2.2" fill="#e0405a"/>`;
  }
  function fruitTray(x, y) {
    return `<ellipse cx="${x}" cy="${y + 6}" rx="52" ry="9" fill="#000" opacity=".12"/><ellipse cx="${x}" cy="${y}" rx="52" ry="13" fill="url(#gBrass)"/>
<circle cx="${x - 14}" cy="${y - 12}" r="14" fill="#8a5a2e"/><path d="M${x - 18} ${y - 25}q4 -8 8 0" stroke="#5a3a1a" stroke-width="2" fill="none"/>
<path d="M${x + 2} ${y - 6}q14 -26 34 -16q-16 2 -30 20z" fill="#f2c230"/><path d="M${x + 6} ${y - 4}q14 -22 34 -10q-16 0 -30 14z" fill="#f7d34a"/>
<circle cx="${x + 26}" cy="${y - 4}" r="7" fill="#e0405a"/><circle cx="${x - 34}" cy="${y - 4}" r="6" fill="#f39c12"/>
<path d="M${x - 30} ${y - 8}l-6 -10M${x - 30} ${y - 8}l6 -11" stroke="#3f8a3c" stroke-width="3" stroke-linecap="round"/>`;
  }
  function tumbler(x, y) {
    return `<ellipse cx="${x}" cy="${y + 2}" rx="20" ry="5" fill="#000" opacity=".12"/><path d="M${x - 18} ${y - 6}h36l-4 8h-28z" fill="url(#gBrass)"/>
<path d="M${x - 9} ${y - 6}l-3 -30h24l-3 30z" fill="url(#gBrass)"/><ellipse cx="${x}" cy="${y - 36}" rx="12" ry="3" fill="#8a5a2e"/>
<path d="M${x - 4} ${y - 44}q-4 -8 2 -14M${x + 4} ${y - 44}q4 -8 -2 -14" stroke="#fff" stroke-width="1.6" fill="none" opacity=".6"/>`;
  }
  /* the bride's friends: same figure, their own saree colours, no bridal tikka */
  function girlInner(saree, blouse, pallu) {
    return brideInner().replace('fill="url(#gSaree)"', `fill="${saree}"`).replace('fill="#1d7a4a"', `fill="${blouse}"`).replace('fill="#c4122f"', `fill="${pallu}"`)
      .replace(/<path d="M50 37\.6 V42"[^>]*\/><circle cx="50" cy="43\.3"[^>]*\/>/, '');
  }
  const GIRLS = [['#6b3fa0', '#e8a317', '#8e5cc4'], ['#1f8a6a', '#c8102e', '#2fb08a'], ['#e07a1f', '#7a1f35', '#f39c12'], ['#d6407a', '#2f6b3a', '#ef6a9a']];
  /* one standing girl: saree colours, bridal tikka or not, raised-arm angle, mirrored, hennaed hands */
  function girl(x, y, w, o) {
    let g = brideInner();
    if (o.cols) g = g.replace('fill="url(#gSaree)"', `fill="${o.cols[0]}"`).replace('fill="#1d7a4a"', `fill="${o.cols[1]}"`).replace('fill="#c4122f"', `fill="${o.cols[2]}"`);
    if (!o.bride) g = g.replace(/<path d="M50 37\.6 V42"[^>]*\/><circle cx="50" cy="43\.3"[^>]*\/>/, '');
    if (o.arm != null) g = g.replace('<g class="hasta">', `<g class="hasta" style="animation:none;transform:rotate(${o.arm}deg)">`);
    if (o.henna) g = g.replace(/(<circle data-hand cx="72" cy="126" r="4" fill=")[^"]+"/, '$1#9a4a1e"').replace(/(<circle cx="28" cy="126" r="4" fill=")[^"]+"/, '$1#9a4a1e"');
    if (o.dots) g = g.replace(/<circle cx="70\.8" cy="123\.6"[^>]*\/><circle cx="73\.3" cy="124\.4"[^>]*\/>/, `<circle cx="71" cy="123.5" r="2.6" fill="${o.dots}"/>`);
    const inner = o.flip ? `<g transform="translate(100 0) scale(-1 1)">${g}</g>` : g;
    return `<svg class="bomma" x="${x}" y="${y}" width="${w}" height="${w * 2}" viewBox="0 0 100 200" overflow="visible">${inner}</svg>`;
  }

  function vignette(kind) {
    if (kind === 'haldi') {
      // pellikuthuru: the bride in turmeric yellow, two friends leaning in to apply haldi, under a marigold toranam
      const r = rng(41);
      let s = `<ellipse cx="200" cy="200" rx="190" ry="150" fill="#f6c84a" opacity=".12"/>`;
      s += flowerRope('M6 26Q200 92 394 26', 12, 'marigold');
      for (let x = 24; x < 390; x += 26) s += `<g transform="translate(${x} ${f(32 + Math.sin((x - 6) / 388 * Math.PI) * 30)}) scale(.55)">${mango(x)}</g>`.replace('<svg', '<svg width="26" height="76"');
      s += `<ellipse cx="200" cy="290" rx="160" ry="16" fill="#000" opacity=".2"/>` + kalasam(36, 292, 60) + kalasam(364, 292, 60);
      s += girl(52, 92, 96, { cols: ['#2fb08a', '#f2b705', '#1f8a6a'], arm: -58, dots: '#f2b705' });
      s += girl(252, 92, 96, { cols: ['#d6407a', '#f2b705', '#ef6a9a'], arm: -58, flip: true, dots: '#f2b705' });
      s += girl(142, 60, 116, { bride: true, cols: ['#f2b705', '#2f6b3a', '#e07a1f'] });
      // mangala snanam pot and turmeric bowls
      s += `<path d="M178 300q-4 -26 22 -30q26 4 22 30z" fill="url(#gBrass)"/><ellipse cx="200" cy="270" rx="16" ry="4" fill="#c9862a"/><path d="M194 266q6 -12 12 0" stroke="#7fc6e8" stroke-width="3" fill="none"/>`;
      s += bowl(110, 300, 30, '#f2b705') + bowl(290, 302, 28, '#f2b705') + bowl(150, 318, 20, '#c8102e') + bowl(252, 320, 20, '#f2b705');
      for (let i = 0; i < 22; i++) s += `<circle cx="${f(70 + r() * 260)}" cy="${f(316 + r() * 18)}" r="${f(2 + r() * 2)}" fill="${['#f39c12', '#ffb627', '#f2b705', '#fffef6'][i % 4]}"/>`;
      return `<svg class="vignette" viewBox="0 0 400 340" role="img" aria-label="Pellikuthuru — the bride with friends applying turmeric">${s}</svg>`;
    }
    if (kind === 'mehendi') {
      // mehendi night: girls in a row under string lights showing their hennaed hands, a dholak and the henna plate
      const r = rng(97);
      let s = `<ellipse cx="200" cy="190" rx="200" ry="150" fill="#3f8a3c" opacity=".12"/>`;
      s += lights(-6, 18, 200, 34, 18, 9, r) + lights(200, 34, 406, 18, 18, 9, r);
      s += `<ellipse cx="200" cy="290" rx="180" ry="15" fill="#000" opacity=".2"/>`;
      s += girl(-6, 100, 88, { cols: ['#e07a1f', '#7a1f35', '#f39c12'], arm: -150, henna: true });
      s += girl(320, 100, 88, { cols: ['#6b3fa0', '#e8a317', '#8e5cc4'], arm: -150, henna: true, flip: true });
      s += girl(70, 84, 96, { cols: ['#1f8a6a', '#c8102e', '#2fb08a'], arm: -130, henna: true });
      s += girl(236, 84, 96, { cols: ['#d6407a', '#2f6b3a', '#ef6a9a'], arm: -130, henna: true, flip: true });
      s += girl(144, 56, 112, { bride: true, cols: ['#1d7a4a', '#c8102e', '#3fae5a'], arm: -160, henna: true });
      // dholak
      s += `<g transform="translate(62 296)"><ellipse cx="0" cy="18" rx="40" ry="6" fill="#000" opacity=".15"/><rect x="-36" y="-14" width="72" height="30" rx="14" fill="#a8461f"/>
<ellipse cx="-36" cy="1" rx="7" ry="15" fill="#f3e2c0"/><ellipse cx="36" cy="1" rx="7" ry="15" fill="#f3e2c0"/>
<path d="M-30 -12L-18 14M-18 -12L-6 14M-6 -12L6 14M6 -12L18 14M18 -12L30 14" stroke="#f6cf62" stroke-width="1.6"/></g>`;
      // henna plate with cones
      s += `<ellipse cx="270" cy="318" rx="44" ry="9" fill="#000" opacity=".12"/><ellipse cx="270" cy="312" rx="44" ry="11" fill="url(#gBrass)"/>
<path d="M236 310Q270 286 304 310Z" fill="#4f6b2a"/><path d="M228 316l30 -40l5 4l-28 40z" fill="#7a3f1a"/><path d="M312 318l-26 -42l5 -3l26 42z" fill="#7a3f1a"/>`;
      for (let i = 0; i < 6; i++) s += `<ellipse cx="${f(150 + r() * 70)}" cy="${f(316 + r() * 14)}" rx="8" ry="3.4" transform="rotate(${f((r() - .5) * 60)} ${f(150 + i * 12)} 320)" fill="#3f8a3c"/>`;
      return `<svg class="vignette" viewBox="0 0 400 340" role="img" aria-label="Mehendi — the bride and her friends showing their henna">${s}</svg>`;
    }
    const r = rng(kind.length * 53 + 11);
    const wed = kind === 'wedding' || kind === 'talambralu';
    const girls = kind === 'haldi' || kind === 'mehendi';   // pellikuthuru and mehendi: the bride with her friends, no groom
    const bride = `<svg class="bomma" x="${girls ? 143 : 98}" y="52" width="115" height="230" viewBox="0 0 100 200" overflow="visible">${brideInner().replace('</g></g></g>', (wed ? garland(118) : '') + '</g></g></g>')}</svg>`;
    const groom = girls
      ? [[60, 0, 98], [244, 1, 98], [16, 2, 84], [302, 3, 84]].map(([x, c, w], i) => `<g class="${i % 2 ? 'groom' : ''}"><svg class="bomma" x="${x}" y="${282 - w * 2}" width="${w}" height="${w * 2}" viewBox="0 0 100 200" overflow="visible">${girlInner(...GIRLS[c])}</svg></g>`).reverse().join('')
      : `<g class="groom"><svg class="bomma" x="188" y="48" width="117" height="234" viewBox="0 0 100 200" overflow="visible">${wed ? groomInner() : groomInner().replace(/<path d="M39 80 Q37 113 50 121 Q63 113 61 80"[^>]*\/>/g, '')}</svg></g>`;
    let back = `<ellipse cx="200" cy="286" rx="150" ry="16" fill="#000" opacity=".2"/>`, front = '';
    if (kind === 'hello') {
      back += `<g transform="translate(30 0)">${banana(40, 292, 110)}</g>` + lotusFlower(338, 268, 70);
      front += `<g opacity=".95">${heart(200, 40, .9, '#f28aa0')}${heart(236, 22, .6, '#e0405a')}${heart(170, 20, .5, '#f6b3c4')}</g>`;
      for (let i = 0; i < 16; i++) front += `<circle cx="${f(110 + r() * 190)}" cy="${f(280 + r() * 14)}" r="${f(2.4 + r() * 2)}" fill="${i % 2 ? '#fffef6' : '#f6cf62'}"/>`;
    } else if (kind === 'choopulu') {
      back += kalasam(56, 288, 70) + kalasam(344, 288, 70);
      front += fruitTray(120, 300) + tumbler(290, 306);
    } else if (kind === 'engagement') {
      back += marigoldHeap(60, 292, 34) + marigoldHeap(342, 292, 34);
      front += ringPlate(200, 304);
      front += `<g>${heart(150, 30, .8, '#e0405a')}${heart(252, 44, 1, '#f28aa0')}${heart(206, 12, .6, '#f6b3c4')}</g>`;
    } else if (kind === 'haldi') {
      back += kalasam(52, 290, 76) + kalasam(348, 290, 76);
      front += bowl(120, 296, 34, '#f2b705') + bowl(284, 298, 30, '#f2b705') + bowl(200, 306, 26, '#c8102e') + marigoldHeap(160, 314, 16) + marigoldHeap(244, 316, 16);
      for (let i = 0; i < 18; i++) front += `<ellipse cx="${f(70 + r() * 260)}" cy="${f(318 + r() * 16)}" rx="3" ry="1.8" fill="${['#f39c12', '#e0405a', '#ffb627'][i % 3]}"/>`;
    } else if (kind === 'mehendi') {
      back += marigoldHeap(58, 292, 30) + marigoldHeap(344, 292, 30);
      // a plate of henna paste with leaves, two henna cones, small lamps
      front += `<ellipse cx="200" cy="312" rx="44" ry="9" fill="#000" opacity=".12"/><ellipse cx="200" cy="306" rx="44" ry="11" fill="url(#gBrass)"/>
<path d="M166 304Q200 278 234 304Z" fill="#4f6b2a"/><path d="M180 296q20-12 40 0" stroke="#6f8f3a" stroke-width="3" fill="none"/>`;
      [[-40, 0], [-20, -10], [22, -8], [40, 2]].forEach(([dx, dy], i) => { front += `<ellipse cx="${200 + dx}" cy="${300 + dy}" rx="9" ry="4" transform="rotate(${i % 2 ? 30 : -30} ${200 + dx} ${300 + dy})" fill="#3f8a3c"/>`; });
      front += `<path d="M112 312l26-46l6 3l-24 46z" fill="#7a3f1a"/><path d="M134 268l6 3l4-8z" fill="#f6cf62"/>`;
      front += `<path d="M288 314l-22-44l6-3l20 45z" fill="#7a3f1a"/><path d="M268 272l6-3l-6-8z" fill="#f6cf62"/>`;
      [[96, 322], [304, 322]].forEach(([x, y]) => { front += `<circle cx="${x}" cy="${y - 14}" r="14" fill="url(#gGlow)"/><path d="M${x - 10} ${y - 4}q10 8 20 0z" fill="url(#gBrass)"/><path class="flame" d="M${x} ${y - 18}c3 6 3 9 0 12c-3-3-3-6 0-12z" fill="#ffb02e"/>`; });
    } else if (kind === 'talambralu') {
      back += kalasam(52, 290, 70) + kalasam(348, 290, 70);
      front += `<ellipse cx="200" cy="316" rx="92" ry="15" fill="#000" opacity=".14"/><ellipse cx="200" cy="306" rx="92" ry="17" fill="url(#gBrass)"/><ellipse cx="200" cy="302" rx="82" ry="12" fill="#c9862a"/>
<path d="M126 302Q200 262 274 302Z" fill="#f2c230"/>`;
      for (let i = 0; i < 26; i++) front += `<circle cx="${f(140 + r() * 120)}" cy="${f(282 + r() * 18)}" r="${f(1.8 + r() * 1.4)}" fill="#fffdf6" stroke="#e5dcc0" stroke-width=".5"/>`;
      front += riceFall(r, 140, 90, 310, 10, 170);
      for (let i = 0; i < 20; i++) front += `<circle cx="${f(100 + r() * 200)}" cy="${f(20 + r() * 150)}" r="${f(1.8 + r() * 1.4)}" fill="#fffdf6" stroke="#e5dcc0" stroke-width=".5"/>`;
    } else if (kind === 'vindu') {
      back += banana(36, 292, 90) + banana(364, 292, 90, true);
      front += `<g transform="translate(80 262) scale(.4)">${leaf(['#f6cf62', '#2e6b34', '#b3122e', '#e07a1f', '#f2e4b0', '#6b3a5a', '#fffbe8', '#d98c1f', '#7a9a3a', '#c86b2a', '#f6cf62', '#fff3c4'].map(color => ({ color })), true)}</g>`;
      front += tumbler(330, 322) + tumbler(70, 322);
    } else if (kind === 'wedding') {
      back += kalasam(52, 290, 76) + kalasam(348, 290, 76);
      front += riceFall(r, 70, 120, 290, 20, 150);
      front += `<ellipse cx="200" cy="306" rx="70" ry="13" fill="url(#gBrass)"/><path d="M146 304Q200 280 254 304Z" fill="#f2c230"/>`;
    }
    return `<svg class="vignette" viewBox="0 0 400 340" role="img" aria-label="${kind}">${back}${girls ? groom + bride : bride + groom}${front}</svg>`;
  }

  /* ── papercut arch windows for the journey: layered paper with depth, couple in silhouette ── */
  function papercut(kind) {
    const id = 'pc' + (uid++), r = rng(kind.length * 71 + 3);
    const P = {
      hello:      { sky: ['#fbe3c4', '#f6b5a6', '#d9708a', '#9a3a5e'], sun: [180, 210, 54, '#fff4dc'], layers: ['#e48a96', '#b8496a', '#7e2246', '#3d0a1f'] },
      choopulu:   { sky: ['#ffe2a6', '#f8b26e', '#e07058', '#9a2f45'], sun: [180, 200, 60, '#fff2cc'], layers: ['#e38b62', '#b8533e', '#7a2533', '#3a0a17'] },
      engagement: { sky: ['#f8c6b4', '#e48c9c', '#a8507e', '#4e1d4a'], sun: [180, 190, 50, '#ffe9e0'], layers: ['#c86890', '#93386a', '#5e1d48', '#2c0a22'] },
      haldi:      { sky: ['#20081c', '#4d1638', '#a13d52', '#eea06a'], moon: [256, 128, 30], layers: ['#8a3048', '#5e1a36', '#3c0d24', '#1e0512'] },
      wedding:    { sky: ['#ffd895', '#f6966a', '#d24e55', '#7a1f35'], sun: [180, 196, 64, '#fff3d0'], layers: ['#e47a6a', '#b23f4c', '#74192f', '#360812'] }
    }[kind];
    const L = P.layers;
    const wave = (y, amp, seed, w) => { let d = `M-10 470L-10 ${y}`; for (let x = -10; x <= 370; x += 10) d += `L${x} ${f(y - amp * (Math.sin(x / w + seed) * .7 + Math.sin(x / (w * .37) + seed * 2) * .3))}`; return d + 'L370 470Z'; };
    let s = `<defs>
<clipPath id="${id}c"><path d="M0 460V180A180 180 0 0 1 360 180V460Z"/></clipPath>
<linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1">${stops(P.sky)}</linearGradient>
<filter id="${id}d" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="-3" stdDeviation="3.5" flood-color="#1a0008" flood-opacity=".45"/></filter>
</defs><g clip-path="url(#${id}c)"><rect width="360" height="460" fill="url(#${id}s)"/>`;
    if (P.sun) s += `<circle cx="${P.sun[0]}" cy="${P.sun[1]}" r="${P.sun[2] * 2.6}" fill="url(#gGlow)" opacity=".75"/><circle cx="${P.sun[0]}" cy="${P.sun[1]}" r="${P.sun[2]}" fill="${P.sun[3]}"/>`;
    if (P.moon) {
      s += `<circle cx="${P.moon[0]}" cy="${P.moon[1]}" r="${P.moon[2] * 3}" fill="url(#gMoon)"/><circle cx="${P.moon[0]}" cy="${P.moon[1]}" r="${P.moon[2]}" fill="#fff6dc"/>`;
      for (let i = 0; i < 50; i++) s += `<circle class="tw" style="animation-delay:${f(-r() * 4)}s" cx="${f(r() * 360)}" cy="${f(r() * 220)}" r="${f(.5 + r())}" fill="#fff" opacity="${f(.4 + r() * .6)}"/>`;
    }
    // paper layers, back to front
    let back = '', mid = '';
    if (kind === 'hello') {
      back = `<path d="${wave(300, 26, 1.3, 70)}" fill="${L[0]}"/>`;
      mid = `<path d="${wave(352, 22, 2.6, 60)}" fill="${L[1]}"/>` + palm(40, 360, 120, L[2], L[2]) + palm(330, 362, 100, L[2], L[2]);
      for (let i = 0; i < 5; i++) { const x = 70 + i * 26 + r() * 10, y = 90 + r() * 50; s += `<path d="M${f(x)} ${f(y)}q5 -5 10 0q5 -5 10 0" stroke="#5a1a30" stroke-width="2" fill="none" stroke-linecap="round"/>`; }
    } else if (kind === 'choopulu') {
      back = `<path d="${wave(316, 12, .8, 90)}" fill="${L[0]}"/>` + gopuram(96, 330, 120, L[0], L[0]) + gopuram(270, 330, 150, L[0], L[0]);
      mid = `<path d="${wave(360, 14, 2.2, 70)}" fill="${L[1]}"/>` + palm(26, 372, 130, L[2], L[2]) + palm(336, 372, 116, L[2], L[2]);
    } else if (kind === 'engagement') {
      back = `<path d="${wave(318, 22, 1.7, 80)}" fill="${L[0]}"/>`;
      mid = `<path d="${wave(360, 18, 3.1, 60)}" fill="${L[1]}"/>` + tree(40, 380, 60, r, [L[2], L[2], L[2]]) + tree(325, 382, 56, r, [L[2], L[2], L[2]]);
      s += lights(-10, 96, 370, 96, 34, 16, r);
      for (let i = 0; i < 6; i++) s += heart(110 + r() * 140, 110 + r() * 80, .45 + r() * .4, i % 2 ? '#ffd0d8' : '#ffb3c1');
    } else if (kind === 'haldi') {
      back = `<path d="${wave(330, 16, 2.1, 80)}" fill="${L[0]}"/>` + gopuram(300, 344, 110, L[0], L[0]);
      mid = `<path d="${wave(372, 12, 1.1, 70)}" fill="${L[1]}"/>` + kalasam(40, 392, 52).replace(/fill="[^"]+"/g, `fill="${L[2]}"`) + kalasam(322, 394, 52).replace(/fill="[^"]+"/g, `fill="${L[2]}"`);
      s += lanterns(r, 14, 40, 260, 20, 340);
    } else if (kind === 'wedding') {
      back = `<path d="${wave(320, 14, 2.4, 80)}" fill="${L[0]}"/>`;
      // mandapam silhouette framing the couple
      mid = `<path d="M40 150L180 92L320 150Z" fill="${L[2]}"/><rect x="34" y="148" width="292" height="12" fill="${L[2]}"/>
<rect x="52" y="158" width="14" height="250" fill="${L[2]}"/><rect x="294" y="158" width="14" height="250" fill="${L[2]}"/>
<path d="M66 160Q120 200 180 160Q240 200 294 160" stroke="${L[2]}" stroke-width="7" fill="none" stroke-dasharray=".1 9" stroke-linecap="round"/>
<circle cx="180" cy="86" r="8" fill="${L[2]}"/>`;
      for (let x = 74; x <= 286; x += 16) mid += `<path d="M${x} 160v${22 + (x % 32 ? 10 : 0)}" stroke="${L[2]}" stroke-width="5" stroke-dasharray=".1 7" stroke-linecap="round"/>`;
    }
    s += `<g filter="url(#${id}d)">${back}</g><g filter="url(#${id}d)">${mid}</g>`;
    // foreground ground and the couple in silhouette
    s += `<g filter="url(#${id}d)"><path d="${wave(420, 6, .5, 60)}" fill="${L[3]}"/></g>`;
    const pose = { hello: [-6, 0], choopulu: [-28, 3], engagement: [-78, 2], haldi: [-128, 0], wedding: [-92, 2] }[kind];
    const brideFig = brideSide().replace('class="g-arm near"', `class="g-arm near" transform="rotate(${pose[0]} 54 82)"`)
      .replace('class="g-arm far"', `class="g-arm far" transform="rotate(${pose[0] + 8} 51 83)"`)
      .replace('<g class="g-body">', `<g class="g-body" transform="rotate(${pose[1]} 50 195)">`);
    if (kind === 'haldi') {
      // the bride with her friends — no groom
      const friend = (x, h, flip, arm) => `<svg x="${x}" y="${428 - h}" width="${h / 2}" height="${h}" viewBox="0 0 100 200" overflow="visible">${flip ? '<g transform="translate(100 0) scale(-1 1)">' : '<g>'}${brideSide().replace('class="g-arm near"', `class="g-arm near" transform="rotate(${arm} 54 82)"`).replace('class="g-arm far"', `class="g-arm far" transform="rotate(${arm + 8} 51 83)"`)}</g></svg>`;
      s += `<g class="sil">${friend(4, 220, false, -40)}${friend(262, 214, true, -20)}${friend(178, 240, true, -60)}
<svg x="86" y="168" width="130" height="260" viewBox="0 0 100 200" overflow="visible">${brideFig}</svg></g>`;
    } else {
      s += `<g class="sil"><svg x="80" y="168" width="130" height="260" viewBox="0 0 100 200" overflow="visible">${brideFig}</svg>
<svg x="167" y="168" width="130" height="260" viewBox="0 0 100 200" overflow="visible"><g transform="translate(100 0) scale(-1 1)">${groomSide()}</g></svg></g>`;
    }
    if (kind === 'engagement') s += `<circle cx="222" cy="262" r="5" fill="none" stroke="#ffe08a" stroke-width="2.2"/><circle cx="222" cy="262" r="12" fill="url(#gGlow)"/>`;
    if (kind === 'wedding') {
      s += `<g transform="translate(229 260) scale(.85)">${flowerRope('M-22 0Q-31 52 0 78Q31 52 22 0', 8, 'marigold')}</g>`;
      for (let i = 0; i < 30; i++) s += `<ellipse class="petal" style="animation-delay:${f(-r() * 4)}s" cx="${f(r() * 360)}" cy="${f(60 + r() * 330)}" rx="2.6" ry="4.4" transform="rotate(${f(r() * 180)})" fill="${i % 3 ? '#ffd0d8' : '#ffe08a'}" opacity=".9"/>`;
    }
    if (kind === 'haldi') s += `<circle cx="140" cy="226" r="10" fill="url(#gGlow)"/>`;
    s += `</g>`;
    // the arch frame
    s += `<path d="M2 460V180A178 178 0 0 1 358 180V460" fill="none" stroke="#f6cf62" stroke-width="3"/>
<path d="M12 460V182A168 168 0 0 1 348 182V460" fill="none" stroke="#f6cf62" stroke-width="1" opacity=".7"/>
<circle cx="180" cy="2" r="5" fill="#f6cf62"/>`;
    return `<svg class="papercut" viewBox="-4 -6 368 468" role="img" aria-label="${kind}">${s}</svg>`;
  }

  /* ── watermark: temples, a domed shrine, a pillared hall and palms ──────── */
  function templeWatermark() {
    const C = '#ffe6d6', H = '#5a1a26';     // shape colour, and "window" colour (the page background)
    let s = `<rect x="0" y="404" width="1200" height="20" fill="${C}"/>`;
    // pillared hall
    s += `<rect x="330" y="296" width="440" height="16" fill="${C}"/><rect x="322" y="290" width="456" height="8" fill="${C}"/>`;
    for (let x = 340; x <= 756; x += 32) s += `<rect x="${x}" y="312" width="11" height="88" fill="${C}"/>`;
    s += `<rect x="326" y="396" width="448" height="10" fill="${C}"/>`;
    // domed shrine
    s += `<rect x="190" y="300" width="150" height="106" fill="${C}"/><rect x="180" y="290" width="170" height="14" fill="${C}"/><rect x="200" y="256" width="130" height="36" fill="${C}"/>
<path d="M205 258Q205 168 265 160Q325 168 325 258Z" fill="${C}"/><path d="M265 160v-26" stroke="${C}" stroke-width="5"/><circle cx="265" cy="130" r="6" fill="${C}"/>`;
    for (let i = 0; i < 4; i++) s += `<path d="M${214 + i * 30} 400v-56a9 9 0 0 1 18 0v56Z" fill="${H}"/>`;
    for (let i = 0; i < 5; i++) s += `<path d="M${212 + i * 24} 286v-16a6 6 0 0 1 12 0v16Z" fill="${H}"/>`;
    for (let i = 0; i < 4; i++) s += `<path d="M${222 + i * 22} 236v-14a5.5 5.5 0 0 1 11 0v14Z" fill="${H}"/>`;
    // gopurams
    s += gopuram(880, 408, 300, C, H) + gopuram(1090, 408, 170, C, H);
    for (let row = 0; row < 4; row++) for (let i = -2; i <= 2; i++) {
      const y = 380 - row * 66, wdt = 300 * Math.pow(.79, row) * .7;
      s += `<path d="M${f(880 + i * wdt / 5 - 5)} ${y}v-18a5 5 0 0 1 10 0v18Z" fill="${H}"/>`;
    }
    // palms
    s += palm(110, 408, 230, C, C) + palm(50, 408, 160, C, C) + palm(1170, 408, 190, C, C);
    return `<svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${s}</svg>`;
  }

  /* ── a border of hanging vines with small flowers ──────────────────────── */
  let vineId = 0;
  function vines() {
    const id = 'vp' + (vineId++), r = rng(31);
    const flower = (x, y, rad, col) => {
      let p = '';
      for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 - Math.PI / 2; p += `<circle cx="${f(x + Math.cos(a) * rad * .6)}" cy="${f(y + Math.sin(a) * rad * .6)}" r="${f(rad * .5)}" fill="${col}"/>`; }
      return p + `<circle cx="${x}" cy="${y}" r="${f(rad * .3)}" fill="#f6cf62"/>`;
    };
    let p = `<path d="M0 6Q30 1 60 6T120 6T180 6T240 6" stroke="#8fae7e" stroke-width="1.6" fill="none"/>`;
    [14, 46, 80, 112, 150, 182, 216].forEach((x, i) => {
      const len = 34 + r() * 52, sway = (r() - .5) * 10;
      p += `<path d="M${x} 6q${f(sway)} ${f(len / 2)} ${f(sway / 2)} ${f(len)}" stroke="#8fae7e" stroke-width="1.1" fill="none"/>`;
      for (let y = 14; y < len; y += 11) {
        const side = (y / 11 | 0) % 2 ? 1 : -1;
        p += `<ellipse cx="${f(x + sway * y / len * .6 + side * 3.5)}" cy="${f(6 + y)}" rx="3.6" ry="1.7" transform="rotate(${side * 35} ${f(x + sway * y / len * .6 + side * 3.5)} ${f(6 + y)})" fill="${side > 0 ? '#9cbb88' : '#7f9f70'}"/>`;
      }
      const fx = x + sway / 2, fy = 6 + len + 3;
      p += flower(fx, fy, i % 2 ? 6 : 7.5, i % 3 ? '#e79a9a' : '#d8707a');
      if (i % 2) p += flower(fx + 6, fy - 12, 4.4, '#efb3ad');
    });
    for (let x = 6; x < 240; x += 13) p += `<ellipse cx="${x}" cy="${f(7 + (x % 26 ? 3 : -3))}" rx="3.4" ry="1.6" fill="#9cbb88" transform="rotate(${x % 26 ? 25 : -25} ${x} 7)"/>`;
    return `<svg width="100%" height="104" aria-hidden="true"><defs><pattern id="${id}" width="240" height="104" patternUnits="userSpaceOnUse">${p}</pattern></defs><rect width="100%" height="104" fill="url(#${id})"/></svg>`;
  }

  return { defs, bride, groom, mango, marigold, diya, lampBoat, foot, lotus, divider, leaf, scene, cardBackdrop, coupleSVG, heroBackdrop, garlandExchange, templeWatermark, vines, cardArt, vignette, papercut };
})();
