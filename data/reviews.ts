export type Review = {
  author: string
  location: string
  rating: number
  text: string
  airline: string
  amount: number
  date: string
}

export const REVIEWS: Record<string, Review[]> = {
  KL: [
    {
      author: 'Marieke V.',
      location: 'Amsterdam',
      rating: 5,
      text: 'KLM had mijn vlucht met 4 uur vertraagd. Ik had het zelf al opgegeven, maar Aerefund heeft binnen 7 weken €400 voor me binnengehaald. Geweldig!',
      airline: 'KLM',
      amount: 400,
      date: 'februari 2026',
    },
    {
      author: 'Thomas B.',
      location: 'Utrecht',
      rating: 5,
      text: 'KLM wees mijn directe claim eerst af. Aerefund heeft het opgepakt en alsnog geregeld. Factuur van €42 was het meer dan waard.',
      airline: 'KLM',
      amount: 400,
      date: 'januari 2026',
    },
  ],
  FR: [
    {
      author: 'Sandra M.',
      location: 'Rotterdam',
      rating: 5,
      text: 'Ryanair weigerde alles. Na 3 maanden strijd heeft Aerefund toch €250 voor mij gekregen. Ze kennen de trucs van Ryanair precies.',
      airline: 'Ryanair',
      amount: 250,
      date: 'januari 2026',
    },
    {
      author: 'Kevin P.',
      location: 'Eindhoven',
      rating: 4,
      text: 'Duurde wat langer bij Ryanair, maar uiteindelijk €250 ontvangen. Zonder hulp was dit nooit gelukt.',
      airline: 'Ryanair',
      amount: 250,
      date: 'december 2025',
    },
  ],
  HV: [
    {
      author: 'Lisa K.',
      location: 'Den Haag',
      rating: 5,
      text: 'Transavia vlucht 5 uur vertraagd. Binnen 6 weken stond €400 op mijn rekening. Super service!',
      airline: 'Transavia',
      amount: 400,
      date: 'februari 2026',
    },
    {
      author: 'Joost W.',
      location: 'Haarlem',
      rating: 5,
      text: 'Snel en professioneel geregeld. Transavia betaalde zonder gedoe na de indiening door Aerefund.',
      airline: 'Transavia',
      amount: 400,
      date: 'januari 2026',
    },
  ],
  U2: [
    {
      author: 'Anna de R.',
      location: 'Leiden',
      rating: 5,
      text: 'easyJet vlucht geannuleerd. Aerefund heeft alles geregeld en ik ontving €250. Aanrader!',
      airline: 'easyJet',
      amount: 250,
      date: 'januari 2026',
    },
    {
      author: 'Pieter S.',
      location: 'Delft',
      rating: 4,
      text: 'Goede service. easyJet probeerde buitengewone omstandigheden in te roepen maar dat werd door het team weerlegd.',
      airline: 'easyJet',
      amount: 400,
      date: 'december 2025',
    },
  ],
  CD: [
    {
      author: 'Fatima A.',
      location: 'Amsterdam',
      rating: 5,
      text: 'Corendon gaf geen reactie op mijn eigen email. Via Aerefund was het binnen 10 weken geregeld. €400!',
      airline: 'Corendon',
      amount: 400,
      date: 'februari 2026',
    },
  ],
  TB: [
    {
      author: 'Hans V.',
      location: 'Tilburg',
      rating: 5,
      text: 'TUI fly vlucht 4 uur vertraagd op vakantie. Heel onprettig. Aerefund heeft €400 voor ons gezin (4 personen = €1.600) geregeld!',
      airline: 'TUI fly',
      amount: 400,
      date: 'december 2025',
    },
  ],
  VY: [
    {
      author: 'Carmen L.',
      location: 'Rotterdam',
      rating: 4,
      text: 'Vueling reageert traag maar Aerefund hield vol. Na 11 weken €400 ontvangen.',
      airline: 'Vueling',
      amount: 400,
      date: 'november 2025',
    },
  ],
  DEFAULT: [
    {
      author: 'Bas T.',
      location: 'Groningen',
      rating: 5,
      text: 'Fantastische service! Mijn vlucht was 5 uur vertraagd en ik wist niet dat ik recht had op compensatie. Binnen 2 maanden €400 ontvangen.',
      airline: 'diverse airline',
      amount: 400,
      date: 'februari 2026',
    },
    {
      author: 'Miriam J.',
      location: 'Maastricht',
      rating: 5,
      text: 'Simpel aangemeld, Aerefund deed de rest. Factuur van €42 betaald nadat ik mijn €250 had ontvangen. Eerlijk systeem!',
      airline: 'diverse airline',
      amount: 250,
      date: 'januari 2026',
    },
  ],
}

export function getReviewsForAirline(iataPrefix: string): Review[] {
  const prefix = iataPrefix.toUpperCase()
  return REVIEWS[prefix] ?? REVIEWS['DEFAULT']
}
