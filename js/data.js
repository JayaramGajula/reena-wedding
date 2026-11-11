/* ──────────────────────────────────────────────────────────────────────────
   EVERYTHING ON THE SITE COMES FROM HERE — edit this file only.
   Times are India time (+05:30).
   ────────────────────────────────────────────────────────────────────────── */
window.WEDDING = {
  bride: 'Reena',
  groom: 'Deekshith',
  hashtag: '#ReenaWedsDeekshith',
  city: 'Hyderabad',
  datesLabel: 'Thursday · 26 November 2026',
  muhurtham: '2026-11-26T09:15:00+05:30', // countdown target
  tagline: 'Two families, one auspicious morning, and a hall full of the people we love. We would be honoured by your blessings.',

  card: {
    front: 'assets/card-front.jpg',
    inside: 'assets/card-inside.jpg'
  },

  // the wedding journey — each moment has a painted scene (see js/art.js)
  journey: [
    { art: 'hello', te: 'మొదటి పరిచయం', title: 'The first hello', text: 'Two paths crossed, a shy smile was shared, and a story quietly began.' },
    { art: 'choopulu', te: 'పెళ్లి చూపులు', title: 'Pelli Choopulu', text: 'Both families came together over coffee and sweets, and the elders gave their happy nod.' },
    { art: 'engagement', te: 'నిశ్చితార్థం', title: 'Nischitartham', text: 'Rings were exchanged, tambulam was shared, and a promise was made in front of everyone we love.' },
    { art: 'haldi', te: 'పెళ్లికూతురు · మెహందీ', title: 'Pellikuthuru & Mehendi', text: 'Turmeric, henna and music fill the house as the days count down to the big morning.' },
    { art: 'wedding', te: 'సుముహూర్తం', title: 'Sumuhurtham', text: '26 November 2026, 9:15 a.m. — seven steps, one life together, and your blessings.' }
  ],

  eventsIntro: 'From the pellikuthuru to the muhurtham — come celebrate every moment with us.',
  events: [
    // place: shown under the title (optional) · dir: a Directions link (otherwise the main venue is used when there is a place)
    { name: 'Pellikuthuru', te: 'పెళ్లికూతురు', vig: 'haldi', start: '2026-11-23T19:00:00+05:30', end: '2026-11-23T22:00:00+05:30', when: '7:00 pm', place: '', desc: 'Turmeric, mangala snanam, new clothes and blessings as the bride is made ready.' },
    { name: 'Mehendi', te: 'మెహందీ', vig: 'mehendi', start: '2026-11-24T19:00:00+05:30', end: '2026-11-24T22:30:00+05:30', when: '7:00 pm', place: '', desc: 'Henna, music and laughter — an evening of colour with family and friends.' },
    { name: 'Sumuhurtham', te: 'సుముహూర్తం', vig: 'wedding', start: '2026-11-26T09:15:00+05:30', end: '2026-11-26T10:30:00+05:30', when: '9:15 am · Dhanur Lagnam', place: 'Y.A.R. Convention', desc: 'Kanyadanam, jeelakarra-bellam at the auspicious minute, and the mangalasutram.' },
    { name: 'Talambralu', te: 'తలంబ్రాలు', vig: 'talambralu', start: '2026-11-26T10:30:00+05:30', end: '2026-11-26T11:30:00+05:30', when: 'Following the muhurtham', place: 'Y.A.R. Convention', desc: 'The joyful shower of turmeric rice and pearls over each other. Expect some very friendly competition.' },
    { name: 'Pelli Vindu', te: 'పెళ్లి విందు', vig: 'vindu', start: '2026-11-26T12:00:00+05:30', end: '2026-11-26T14:30:00+05:30', when: 'After the ceremonies', place: 'Y.A.R. Convention', desc: 'A traditional feast served on banana leaves. Please stay and accept our hospitality.' }
  ],

  menu: [
    { name: 'Pulihora', color: '#f6cf62' },
    { name: 'Gongura pachadi', color: '#2e6b34' },
    { name: 'Avakaya', color: '#b3122e' },
    { name: 'Mudda pappu & neyyi', color: '#f2c14e' },
    { name: 'Gutti vankaya kura', color: '#6b3a5a' },
    { name: 'Dondakaya vepudu', color: '#7a9a3a' },
    { name: 'Annam', color: '#fffbe8' },
    { name: 'Pachi pulusu', color: '#d98c1f' },
    { name: 'Garelu', color: '#c86b2a' },
    { name: 'Bobbatlu', color: '#e8a317' },
    { name: 'Double ka meetha', color: '#c9772e' },
    { name: 'Perugu annam', color: '#f3efe0' }
  ],
  feastNote: 'Vegetarian, served in the traditional order and best eaten with your hands. Second helpings are not optional.',

  gallery: [
    { scene: 'neem', caption: 'Under the old neem tree' },
    { scene: 'temple', caption: 'Temple bells' },
    { scene: 'jasmine', caption: 'Jasmine mornings' },
    { scene: 'river', caption: 'By the water' },
    { scene: 'lanterns', caption: 'Lantern night' },
    { scene: 'mandapam', caption: 'At the mandapam' }
  ],

  venue: {
    name: 'Y.A.R. Convention',
    address: 'R.C.I. Road, Balapur, Hyderabad',
    mapQuery: 'Y.A.R. Convention, RCI Road, Balapur, Hyderabad'
  },

  // the message sent by the Share buttons at the end of the page
  share: {
    url: 'https://reena-deekshith-wedding.vercel.app/',
    title: 'Reena & Deekshith — Wedding Invitation',
    message: `With immense happiness and love, we invite you to be a part of our special day! ❤️

As we begin this beautiful new chapter of our lives, your presence and blessings would mean the world to us.

We have created a little invitation with all the wedding details. Please take a moment to visit the link below.

💍 https://reena-deekshith-wedding.vercel.app/

We genuinely wish to celebrate this precious moment with you. Please join us and make our special day even more memorable with your love and blessings.

With love,
Deekshith & Reena ❤️`
  }
};
